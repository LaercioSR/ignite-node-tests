import { getRepository, Repository } from "typeorm";

import { Statement } from "../entities/Statement";
import { ICreateStatementDTO } from "../useCases/createStatement/ICreateStatementDTO";
import { IGetBalanceDTO } from "../useCases/getBalance/IGetBalanceDTO";
import { ITransferDTO } from "../useCases/getBalance/ITransferDTO";
import { IGetStatementOperationDTO } from "../useCases/getStatementOperation/IGetStatementOperationDTO";
import { IStatementsRepository } from "./IStatementsRepository";

export class StatementsRepository implements IStatementsRepository {
  private repository: Repository<Statement>;

  constructor() {
    this.repository = getRepository(Statement);
  }

  async create({
    user_id,
    amount,
    description,
    type
  }: ICreateStatementDTO): Promise<Statement> {
    const statement = this.repository.create({
      user_id,
      amount,
      description,
      type
    });

    return this.repository.save(statement);
  }

  async findStatementOperation({ statement_id, user_id }: IGetStatementOperationDTO): Promise<Statement | undefined> {
    return this.repository.findOne(statement_id, {
      where: { user_id }
    });
  }

  async getUserBalance({ user_id, with_statement = false }: IGetBalanceDTO):
    Promise<
      { balance: number } | { balance: number, statement: Statement[], received_transfers: ITransferDTO[] }
    >
  {
    const statement = await this.repository.find({
      where: { user_id }
    });
    const received_transfers = await this.repository.find({
      where: { receiver_id: user_id }
    });

    let balance = statement.reduce((acc, operation) => {
      if (operation.type === 'deposit') {
        return acc + Number(operation.amount);
      } else {
        return acc - Number(operation.amount);
      }
    }, 0)
    balance += received_transfers.reduce((acc, operation) => {
      return acc + Number(operation.amount);
    }, 0)

    if (with_statement) {
      const received_transfers_normalized = received_transfers.map((transfer) => {
        return {
          id: transfer.id,
          sender_id: transfer.user_id,
          amount: transfer.amount,
          description: transfer.description,
          type: transfer.type,
          created_at: transfer.created_at,
          updated_at: transfer.updated_at,
        } as ITransferDTO
      })

      return {
        statement,
        received_transfers: received_transfers_normalized,
        balance
      }
    }

    return { balance }
  }
}
