import request from "supertest";
import app from "../src/app.js";

describe("Auth Routes", () => {

  let token;
  const email = `test+${Date.now()}@example.com`;

  it("should register a user", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Test User",
        email,
        password: "123456"
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.email).toBe(email);
  });

  it("should login user and return token", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email,
        password: "123456"
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();

    token = res.body.token;
  });

});
