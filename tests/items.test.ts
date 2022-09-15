import { faker } from "@faker-js/faker";
import supertest from "supertest";
import app from "../src/app";
import { PrismaClient } from "@prisma/client";
const client = new PrismaClient();

describe("Testa POST /items ", () => {
  it("Deve retornar 201, se cadastrado um item no formato correto", async () => {
    const body = {
      title: "coelho",
      url: faker.internet.url(),
      description: faker.hacker.phrase(),
      amount: faker.datatype.number(),
    };
    const result = await supertest(app).post("/items").send(body);
    const status = result.status;
    expect(status).toEqual(201);
  });
  it("Deve retornar 409, ao tentar cadastrar um item que exista", async () => {
    const body = {
      title: "coelho",
      url: faker.internet.url(),
      description: faker.hacker.phrase(),
      amount: faker.datatype.number(),
    };
    const result = await supertest(app).post("/items").send(body);
    const status = result.status;
    expect(status).toEqual(409);
  });
});

describe("Testa GET /items ", () => {
  it("Deve retornar status 200 e o body no formato de Array", async () => {
    const result = await supertest(app).get("/items");
    expect(result.statusCode).toEqual(200);
    expect(result.body).toBeInstanceOf("Array");
  });
});

describe("Testa GET /items/:id ", () => {
  it("Deve retornar status 200 e um objeto igual a o item cadastrado", async () => {
    const body = {
      title: faker.animal.rabbit(),
      url: faker.internet.url(),
      description: faker.hacker.phrase(),
      amount: faker.datatype.number(),
    };

    const item = await client.items.create({ data: body });
    const result = await supertest(app).get(`/items/${item.id}`);
    expect(result.statusCode).toEqual(200);
    expect(result.body).toEqual(expect.objectContaining(item));
  });
  it("Deve retornar status 404 caso não exista um item com esse id", async () => {
    const result = await supertest(app).get("/items/0");
    expect(result.statusCode).toEqual(404);
  });
});
