import { hash } from "bcryptjs";
import request from "supertest";
import { Connection } from "typeorm";
import { v4 as uuidV4 } from "uuid";
import { app } from "../../../../app";

import createConnection from "../../../../database";

let connection: Connection;

describe("Authenticate User Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    const id = uuidV4();
    const password = await hash("12345678", 8);

    await connection.query(
      `INSERT INTO USERS(id, name, email, password)
        values('${id}', 'Test User', 'user@test.com', '${password}')
      `
    );
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to authenticate user", async () => {
    const response = await request(app)
      .post("/api/v1/sessions")
      .send({
        email: "user@test.com",
        password: "12345678"
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
  });

  it("should not be able to authenticate a not-existing user", async () => {
    const response = await request(app)
      .post("/api/v1/sessions")
      .send({
        email: "user2@test.com",
        password: "12345678"
      });

    expect(response.status).toBe(401);
  });

  it("should not be able to authenticate a user with wrong password", async () => {
    const response = await request(app)
      .post("/api/v1/sessions")
      .send({
        email: "user@test.com",
        password: "1234567890"
      });

    expect(response.status).toBe(401);
  });
});
