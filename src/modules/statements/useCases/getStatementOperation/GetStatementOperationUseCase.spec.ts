import { User } from "../../../users/entities/User";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { Statement } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let statementRepositoryInMemory: InMemoryStatementsRepository;
let userRepositoryInMemory: InMemoryUsersRepository;
let getStatementOperationUseCase: GetStatementOperationUseCase;
let user: User;
let statement: Statement;

enum OperationType {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
  TRANSFER = "transfer",
}

describe("Get Balance", () => {
  beforeEach(async () => {
    statementRepositoryInMemory = new InMemoryStatementsRepository();
    userRepositoryInMemory = new InMemoryUsersRepository();
    getStatementOperationUseCase = new GetStatementOperationUseCase(userRepositoryInMemory, statementRepositoryInMemory);
    user = await userRepositoryInMemory.create({
      name: "New User",
      email: "user@test.com",
      password: "passwordwithhash"
    })
    statement = await statementRepositoryInMemory.create({
      user_id: user.id as string,
      description: "New deposit",
      type: OperationType.DEPOSIT,
      amount: 100,
    })
  })

  it("should be able to get statement", async () => {
    const getStatement = await getStatementOperationUseCase.execute({
      user_id: user.id as string,
      statement_id: statement.id as string
    })

    expect(getStatement).toEqual(statement)
  })

  it("should not be able to get statement with not-existing user", () => {
    expect(async () => {
      await getStatementOperationUseCase.execute({
        user_id: "1",
        statement_id: statement.id as string
      })
    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
  })

  it("should not be able to get statement with not-existing statement", () => {
    expect(async () => {
      await getStatementOperationUseCase.execute({
        user_id: user.id as string,
        statement_id: "1"
      })
    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
  })
})
