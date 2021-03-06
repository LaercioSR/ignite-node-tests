import request from "supertest";
import { Connection } from "typeorm";
import { app } from "../../../../app";

import createConnection from "../../../../database";

let connection: Connection;

describe("Create User Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to create a new user", async () => {
    const response = await request(app)
      .post("/api/v1/users")
      .send({
        name: "New User 1",
        email: "user@test.com",
        password: "12345678"
      });

    expect(response.status).toBe(201);
  });

  it("should not be able to create a new user with email exists", async () => {
    const response = await request(app)
      .post("/api/v1/users")
      .send({
        name: "New User 2",
        email: "user@test.com",
        password: "12345678"
      });

    expect(response.status).toBe(400);
  });
});
