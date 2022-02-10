import { hash } from "bcryptjs";
import request from "supertest";
import { Connection } from "typeorm";
import { v4 as uuidV4 } from "uuid";
import { app } from "../../../../app";

import createConnection from "../../../../database";

let connection: Connection;

describe("Create Balance Controller", () => {
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

  it("should be able to get balance statement", async () => {
    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "user@test.com",
      password: "12345678",
    });

    const { token } = responseToken.body;

    await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        amount: 300,
        description: "Create a deposit 1",
      })
      .set({
        Authorization: `Bearer ${token}`,
      });
    await request(app)
      .post("/api/v1/statements/withdraw")
      .send({
        amount: 150,
        description: "Create a withdraw",
      })
      .set({
        Authorization: `Bearer ${token}`,
      });
    await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        amount: 25,
        description: "Create a deposit 2",
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    const response = await request(app)
      .get("/api/v1/statements/balance")
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(200);
    expect(response.body.balance).toEqual(175);
    expect(response.body.statement).toHaveLength(3);
  });

  it("should not be able to get balance of unauthenticated user", async () => {
    const response = await request(app)
      .get("/api/v1/statements/balance");

    expect(response.status).toBe(401);
  });
});
