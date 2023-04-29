import app from "app";
import prisma from "../../src/config/database";
import supertest from "supertest";
import {consolesFactory} from "../factories/consoles.factory";
import { cleanDB } from "../helpers";
import { faker } from "@faker-js/faker";

const api = supertest(app);

beforeEach(async () => {
    await cleanDB();
});

describe(`GET /consoles`, () => {
    it(`should return statusCode 200 and a list with consoles`, async () => {
        await consolesFactory.createManyConsoles();
        const response = await api.get('/consoles');
        expect(response.status).toBe(200);
        expect(response.body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    id: expect.any(Number),
                    name: expect.any(String)
                })
            ])
        )
    })
})

describe(`GET /consoles/:id`, () => {
    it(`should respond with status 200 and specific console data`, async () => {
        const createdConsole = await consolesFactory.createConsole();
        const response = await api.get(`/consoles/${createdConsole.id}`);
        expect(response.status).toBe(200);
        expect(response.body).toEqual(createdConsole);
    })
    it(`should respond with status 404 when given an invalid console id`, async () => {
        await consolesFactory.createConsole();
        const response = await api.get(`/consoles/0`);
        expect(response.status).toBe(404);
        expect(response.body).toEqual({});
    })
})

describe(`POST /console`, () => {
    it(`should respond with status 201 and insert the game in the database`, async () => {
        const generatedConsole = consolesFactory.generateConsole();
        const response = await api.post('/consoles').send(generatedConsole);
        const insertedConsole = await prisma.console.findUnique({
            where: { name: generatedConsole.name }
        });
        expect(response.status).toBe(201);
        expect(insertedConsole).toEqual({
            id: expect.any(Number),
            name: generatedConsole.name
        })
    });
    it(`should respond with status 409 when sending an already registred game`, async () => {
        const createdConsole = await consolesFactory.createConsole();
        delete createdConsole.id;
        const response = await api.post('/consoles').send(createdConsole);
        expect(response.status).toBe(409);
    })
    it(`should respond with status 422 when an invalid body is sent`, async () => {
        const invalidBody = {
            name: faker.helpers.unique(faker.commerce.product)
        }
        const response = await api.post('/games').send(invalidBody);
        expect(response.status).toBe(422);
    })
})