import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";

let userRepositoryInMemory: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Create User", () => {
  beforeEach(() => {
    userRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(userRepositoryInMemory);
  })

  it("should be able to create a new user", async () => {
    const user = await createUserUseCase.execute({
      name: "New User",
      email: "user@test.com",
      password: "12345678"
    })

    expect(user).toHaveProperty("id")
  })

  it("should not be able to create a new user with exists email", () => {
    expect(async () => {
      await createUserUseCase.execute({
        name: "New User 1",
        email: "user@test.com",
        password: "12345678"
      })
      await createUserUseCase.execute({
        name: "New User 2",
        email: "user@test.com",
        password: "12345678"
      })
    }).rejects.toBeInstanceOf(CreateUserError);
  })
})
