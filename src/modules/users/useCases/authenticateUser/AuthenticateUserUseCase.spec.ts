import { hash } from "bcryptjs";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let userRepositoryInMemory: InMemoryUsersRepository;
let authenticateUserUseCase: AuthenticateUserUseCase;

describe("Authenticate User", () => {
  beforeEach(async () => {
    userRepositoryInMemory = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(userRepositoryInMemory);

    const passwordHash = await hash("12345678", 8);
    await userRepositoryInMemory.create({
      name: "New User",
      email: "user@test.com",
      password: passwordHash
    })
  })

  it("should be able authenticate a user", async () => {
    const result = await authenticateUserUseCase.execute({
      email: "user@test.com",
      password: "12345678"
    })

    expect(result).toHaveProperty("token")
  })

  it("should not be able authenticate a non-existent user", async () => {
    expect(async () => {
      await authenticateUserUseCase.execute({
        email: "user2@test.com",
        password: "12345678"
      })
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
  })

  it("should not be able authenticate a user with wrong password", async () => {
    expect(async () => {
      await authenticateUserUseCase.execute({
        email: "user@test.com",
        password: "1234567890"
      })
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
  })
})
