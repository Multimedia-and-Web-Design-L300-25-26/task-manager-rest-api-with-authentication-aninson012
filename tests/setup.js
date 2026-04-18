import dotenv from "dotenv";
import mongoose from "mongoose";
import { jest } from "@jest/globals";
import connectDB from "../src/config/db.js";

dotenv.config({ path: ".env.test" });
jest.setTimeout(30000);

beforeAll(async () => {
  await connectDB();
});

afterAll(async () => {
  await mongoose.disconnect();
});
