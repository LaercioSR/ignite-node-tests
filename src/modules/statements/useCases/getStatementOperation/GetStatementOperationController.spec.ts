import { hash } from "bcryptjs";
import request from "supertest";
import { Connection } from "typeorm";
import { v4 as uuidV4 } from "uuid";
import { app } from "../../../../app";

import createConnection from "../../../../database";

let connection: Connection;
let token: string;
let statement_id: string;

describe("Get Statement Controller", () => {
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

    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "user@test.com",
      password: "12345678",
    });
    token = responseToken.body.token;

    const responseNewDeposit = await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        amount: 100,
        description: "Create a deposit",
      })
      .set({
        Authorization: `Bearer ${token}`,
      });
    statement_id = responseNewDeposit.body.id
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to get statement", async () => {
    const response = await request(app)
      .get(`/api/v1/statements/${statement_id}`)
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id");
    expect(response.body.description).toEqual("Create a deposit");
  });

  it("should not be able to create a statement of unauthenticated user", async () => {
    const response = await request(app)
      .get(`/api/v1/statements/${statement_id}`)

    expect(response.status).toBe(401);
  });

  it("should not be able to get statement with not-existing statement", async () => {
    const response = await request(app)
      .get("/api/v1/statements/aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee")
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(404);
  });
});
