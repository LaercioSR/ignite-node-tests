import { User } from "../../../users/entities/User";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

let statementRepositoryInMemory: InMemoryStatementsRepository;
let userRepositoryInMemory: InMemoryUsersRepository;
let createStatementUseCase: CreateStatementUseCase;
let user: User;

enum OperationType {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
  TRANSFER = "transfer",
}

describe("Create Statement", () => {
  beforeEach(async () => {
    statementRepositoryInMemory = new InMemoryStatementsRepository();
    userRepositoryInMemory = new InMemoryUsersRepository();
    createStatementUseCase = new CreateStatementUseCase(userRepositoryInMemory, statementRepositoryInMemory);
    user = await userRepositoryInMemory.create({
      name: "New User",
      email: "user@test.com",
      password: "passwordwithhash"
    })
  })

  it("should be able to create a deposit statement", async () => {
    const statement = await createStatementUseCase.execute({
      user_id: user.id as string,
      description: "New Statement",
      type: OperationType.DEPOSIT,
      amount: 50,
    })

    expect(statement).toHaveProperty("id")
  })

  it("should be able to create a withdraw statement", async () => {
    await createStatementUseCase.execute({
      user_id: user.id as string,
      description: "New Statement",
      type: OperationType.DEPOSIT,
      amount: 100,
    })

    const statement = await createStatementUseCase.execute({
      user_id: user.id as string,
      description: "New Statement",
      type: OperationType.WITHDRAW,
      amount: 50,
    })

    expect(statement).toHaveProperty("id")
  })

  it("should not be able to create a new statement with not-existing user", () => {
    expect(async () => {await createStatementUseCase.execute({
      user_id: "1",
      description: "New Statement",
      type: OperationType.DEPOSIT,
      amount: 50,
    })
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
  })

  it("should not be able to create a new statement with insufficient user funds", () => {
    expect(async () => {await createStatementUseCase.execute({
      user_id: user.id as string,
      description: "New Statement",
      type: OperationType.WITHDRAW,
      amount: 50,
    })
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
  })
})
