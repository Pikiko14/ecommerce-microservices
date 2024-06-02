import request from 'supertest';
import { Server } from '../src/app'; // Asegúrate de exportar correctamente tu aplicación desde '../src/app'
import { faker } from '@faker-js/faker';
import { Utils } from "./../src/utils/utils";
import { User } from "../src/interfaces/users.interface";

describe("AuthService", () => {
  let utils: Utils;
  let server: Server;
  let hashedPassword: string;

  beforeEach(async () => {
    utils = new Utils();
    server = new Server();
    hashedPassword = await utils.encryptPassword("123456789Aa-");
  });

  describe("registerUser", () => {
    it("it should register a new user", async () => {
      let user: User = {
        username: faker.person.firstName(),
        password: hashedPassword,
        email: faker.internet.email(),
        name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        // Resto de los campos necesarios para el usuario
      };

      // Enviar solicitud POST a la ruta correcta de tu aplicación
      const res = await request(server.app)
        .post('register')
        .send(user);

      // Verificar la respuesta
      expect(res.status).toBe(201); // Cambia el código de estado según lo que devuelva tu endpoint
      expect(res.body).toHaveProperty('success'); // Ajusta según la estructura de tu respuesta
    });
  });
});
