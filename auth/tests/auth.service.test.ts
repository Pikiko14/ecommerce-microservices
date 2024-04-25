import { Response } from "express";
import { faker } from '@faker-js/faker';
import Database from '../configuration/db';
import { Utils } from "./../src/utils/utils";
import messageBroker from './../src/utils/messageBroker';
import { User } from "../src/interfaces/users.interface";
import { AuthService } from "../src/services/auth.service";

// Crear mocks o simulaciones para las dependencias externas si es necesario
const mockResponse = () => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res as Response;
};

describe("AuthService", () => {
  let utils: Utils;
  let database: Database;
  let authService: AuthService;
  let hashedPassword: string;

  beforeEach(async () => { // Hacer el beforeEach async
    utils = new Utils();
    database = new Database();
    await database.connect();
    await messageBroker.connect();
    authService = new AuthService();
    hashedPassword = await utils.encryptPassword("123456789Aa-");
  });

  afterEach(async () => {
    await database.close();
  })

  describe("registerUser", () => {
    it("debería registrar un nuevo usuario correctamente", async () => {
      let user: User = {
        username: faker.person.firstName(),
        password: hashedPassword,
        email: faker.internet.email(),
        name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        // Resto de los campos necesarios para el usuario
      };
      const response = mockResponse();

      const result = await authService.registerUser(response, user);
      console.log(result);

      expect(result).toEqual({
        user,
        message: "User registered correctly",
      });

      expect(response.json).toHaveBeenCalledWith({
        user,
        message: "User registered correctly",
      });
    });
  });
});
