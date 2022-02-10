import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let userRepositoryInMemory: InMemoryUsersRepository;
let showUserProfileUseCase: ShowUserProfileUseCase;

describe("Show User Profile", () => {
  beforeEach(() => {
    userRepositoryInMemory = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(userRepositoryInMemory);
  })

  it("should be able to show user profile", async () => {
    const newUser = await userRepositoryInMemory.create({
      name: "New User",
      email: "user@test.com",
      password: "passwordwithhash"
    })

    const user = await showUserProfileUseCase.execute(newUser.id as string)

    expect(user).toEqual(newUser);
  })

  it("should not be able show profile of a non-existent user", () => {
    expect(async () => {
      await showUserProfileUseCase.execute("1")
    }).rejects.toBeInstanceOf(ShowUserProfileError);
  })
})
