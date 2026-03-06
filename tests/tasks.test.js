import request from "supertest";
import app from "../src/app.js";

let token;
let taskId;
let otherUserToken;
const email = `task+${Date.now()}@example.com`;
const otherEmail = `task-other+${Date.now()}@example.com`;

beforeAll(async () => {
  // Register
  await request(app)
    .post("/api/auth/register")
    .send({
      name: "Task User",
      email,
      password: "123456"
    });

  // Login
  const res = await request(app)
    .post("/api/auth/login")
    .send({
      email,
      password: "123456"
    });

  token = res.body.token;

  // Register second user
  await request(app)
    .post("/api/auth/register")
    .send({
      name: "Other User",
      email: otherEmail,
      password: "123456"
    });

  // Login second user
  const otherRes = await request(app)
    .post("/api/auth/login")
    .send({
      email: otherEmail,
      password: "123456"
    });

  otherUserToken = otherRes.body.token;
});

describe("Task Routes", () => {

  it("should not allow access without token", async () => {
    const res = await request(app)
      .get("/api/tasks");

    expect(res.statusCode).toBe(401);
  });

  it("should create a task", async () => {
    const res = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Test Task",
        description: "Testing"
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe("Test Task");

    taskId = res.body._id;
  });

  it("should get user tasks only", async () => {
    const res = await request(app)
      .get("/api/tasks")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("should not allow non-owner to delete a task", async () => {
    const res = await request(app)
      .delete(`/api/tasks/${taskId}`)
      .set("Authorization", `Bearer ${otherUserToken}`);

    expect(res.statusCode).toBe(403);
  });

  it("should allow owner to delete a task", async () => {
    const res = await request(app)
      .delete(`/api/tasks/${taskId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Task deleted successfully");
  });

});
