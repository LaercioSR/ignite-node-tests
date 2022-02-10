import { User } from "../../../users/entities/User";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let statementRepositoryInMemory: InMemoryStatementsRepository;
let userRepositoryInMemory: InMemoryUsersRepository;
let getBalanceUseCase: GetBalanceUseCase;
let user: User;

enum OperationType {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
}

describe("Get Balance", () => {
  beforeEach(async () => {
    statementRepositoryInMemory = new InMemoryStatementsRepository();
    userRepositoryInMemory = new InMemoryUsersRepository();
    getBalanceUseCase = new GetBalanceUseCase(statementRepositoryInMemory, userRepositoryInMemory);
    user = await userRepositoryInMemory.create({
      name: "New User",
      email: "user@test.com",
      password: "passwordwithhash"
    })
  })

  it("should be able to get balance", async () => {
    await statementRepositoryInMemory.create({
      user_id: user.id as string,
      description: "New deposit",
      type: OperationType.DEPOSIT,
      amount: 100,
    })

    await statementRepositoryInMemory.create({
      user_id: user.id as string,
      description: "New withdraw 1",
      type: OperationType.WITHDRAW,
      amount: 25,
    })

    await statementRepositoryInMemory.create({
      user_id: user.id as string,
      description: "New withdraw 2",
      type: OperationType.WITHDRAW,
      amount: 25,
    })

    const result = await getBalanceUseCase.execute({ user_id: user.id as string })

    expect(result.balance).toEqual(50)
    expect(result.statement).toHaveLength(3)
  })

  it("should not be able to get balance with not-existing user", () => {
    expect(async () => {await getBalanceUseCase.execute({
      user_id: "1",
    })
    }).rejects.toBeInstanceOf(GetBalanceError);
  })
})
