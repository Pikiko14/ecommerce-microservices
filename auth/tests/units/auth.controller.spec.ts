import { describe, it, beforeEach, after } from "mocha";
import { faker } from "@faker-js/faker";
import { Request, Response } from "express";
import Database from "../../configuration/db";
import { AuthController } from "../../src/controllers/auth.controller";
import mongoose from "mongoose";

// Instance db
const db = new Database();

beforeEach(async () => {
  await db.connect();
});

after(async () => {
  await mongoose.connection.close();
});

// Extend Response interface to include _data property
declare module "express" {
  interface Response {
    _data: any;
  }
}

describe("AuthController Test", async () => {
  // import chai de forma dinamica
  const chai = await import("chai");
  const expect = chai.expect;

  // do register user
  describe("register", () => {
    it("should register new user successfully", async () => {
      const authController = new AuthController();
      const userData = {
        username: faker.internet.userName(),
        password: faker.internet.password(),
        email: faker.internet.email(),
      };
      const mockRequest = {
        body: userData,
      } as Request;
      const mockResponse = {
        status: (statusCode: number) => {
          return {
            json: (data: any) => {
              mockResponse._data = data;
            },
          };
        },
        _data: null,
      } as unknown as Response;

      await authController.register(mockRequest, mockResponse);

      // Validating response
      expect(mockResponse._data).to.have.property('success').that.is.a('boolean');
      expect(mockResponse._data).to.have.property('data').that.is.an('object');
      expect(mockResponse._data).to.have.property('message').that.is.a('string');
    });

    // Add more tests as needed for other scenarios
  });
});
