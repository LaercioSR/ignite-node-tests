import { inject, injectable } from "tsyringe";

import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { CreateStatementError } from "../createStatement/CreateStatementError";
import { ICreateTransferDTO } from "./ICreateTransferDTO";

@injectable()
export class CreateTransferUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('StatementsRepository')
    private statementsRepository: IStatementsRepository
  ) {}

  async execute({ user_id, receiver_id, type, amount, description }: ICreateTransferDTO) {
    const user = await this.usersRepository.findById(user_id);
    const receiver = await this.usersRepository.findById(receiver_id as string);

    if(!user) {
      throw new CreateStatementError.UserNotFound();
    }
    if(!receiver) {
      throw new CreateStatementError.UserNotFound();
    }

    const { balance } = await this.statementsRepository.getUserBalance({ user_id });

    if (balance < amount) {
      throw new CreateStatementError.InsufficientFunds()
    }

    const statementOperation = await this.statementsRepository.create({
      user_id,
      receiver_id,
      type,
      amount,
      description
    });

    return statementOperation;
  }
}
