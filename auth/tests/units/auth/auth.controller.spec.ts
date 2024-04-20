import { describe, it } from "mocha";
import { faker } from "@faker-js/faker";
import { Request, Response } from "express";
import Database from "../../../configuration/db";
import { AuthController } from "../../../src/controllers/auth.controller";
import mongoose from "mongoose";

// instance db
const db = new Database();

beforeEach(async () => {
  await db.connect();
});

after(async () => {
  await mongoose.connection.close();
});

// Extiende la interfaz de Response para incluir la propiedad _data
declare module "express" {
  interface Response {
    _data: any;
  }
}

describe("AuthController Test", async () => {
  
  // import chai de forma dinamica
  const chai = await import("chai");
  const expect = chai.expect;

  // Prueba para el método register()
  describe("register", () => {
    it("should register new user successfully", async () => {
      // Crea una instancia del controlador de autenticación
      const authController = new AuthController();

      // Define los datos del usuario para la prueba
      const userData = {
        username: faker.internet.userName(),
        password: faker.internet.password(),
        email: faker.internet.email(),
      };

      // Crea objetos de solicitud y respuesta ficticios para la prueba
      const mockRequest = {
        body: userData,
      } as Request;
      const mockResponse = {
        status: (statusCode: number) => {
          // Mock de la función status que devuelve el objeto de respuesta para encadenar llamadas
          return {
            json: (data: any) => {
              // Mock de la función json que almacena la respuesta JSON
              mockResponse._data = data;
            },
          };
        },
        _data: null, // Variable para almacenar la respuesta JSON
      } as unknown as Response;

      // Llama al método register() del controlador de autenticación
      await authController.register(mockRequest, mockResponse);

      // Verifica que la respuesta tenga los atributos esperados
      expect(mockResponse._data).to.have.property('success').that.is.a('boolean');
      expect(mockResponse._data).to.have.property('data').that.is.an('object');
      expect(mockResponse._data).to.have.property('message').that.is.a('string');
      // validate if data._data.data has _id attribute
      console.log(mockResponse._data)
    });

    // Agrega más pruebas según sea necesario para otros escenarios
  });
});
