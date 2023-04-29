import app from "app";
import prisma from "../../src/config/database";
import supertest from "supertest";
import {consolesFactory, gamesFactory} from "../factories";
import { cleanDB } from "../helpers";
import { faker } from "@faker-js/faker";

const api = supertest(app);

beforeEach(async () => {
    await cleanDB();
});

describe(`GET /games`, () => {
    it(`should return statusCode 200 and a list of games`, async () => {
        const { id: consoleId } = await consolesFactory.createConsole();
        await gamesFactory.createManyGames(consoleId);
        const response = await api.get('/games');
        expect(response.status).toBe(200);
        expect(response.body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    id: expect.any(Number),
                    title: expect.any(String),
                    consoleId: expect.any(Number)
                })
            ])
        )
    })
})

describe(`GET /games/:id`, () => {
    it(`should respond with status 200 and game specific data`, async () => {
        const { id: consoleId } = await consolesFactory.createConsole();
        const game = await gamesFactory.createGame(consoleId);
        const response = await api.get(`/games/${game.id}`);
        expect(response.status).toBe(200)
        expect(response.body).toEqual(game);
    })
    it(`should respond with status 404 when game id is invalid`, async () => {
        const response = await api.get('/games/0');
        expect(response.status).toBe(404);
        expect(response.body).toEqual({});
    })
})

describe(`POST /games`, () => {
    it(`should respond with status 201 and insert the game in the database when a valid game is sent`, async () => {
        const { id: consoleId } = await consolesFactory.createConsole();
        const generatedGame = gamesFactory.generateGame(consoleId);
        const response = await api.post('/games').send(generatedGame);
        const insertedGame = await prisma.game.findUnique({
            where: { title: generatedGame.title }
        });
        expect(response.status).toBe(201);
        expect(insertedGame).toEqual({
            consoleId: expect.any(Number),
            id: expect.any(Number),
            title: generatedGame.title
        })
    });
    it(`should respond with status 409 when sending an already registred game`, async () => {
        const { id: consoleId } = await consolesFactory.createConsole();
        const game = await gamesFactory.createGame(consoleId);
        delete game.id;
        const response = await api.post('/games').send(game);
        expect(response.status).toBe(409);
    })
    it(`should respond with status 422 when an invalid body is sent`, async () => {
        const invalidBody = {
            name: faker.helpers.unique(faker.commerce.product)
        }
        const response = await api.post('/games').send(invalidBody);
        expect(response.status).toBe(422);
    })
    it(`should respond with status 409 when an invalid console is sent`, async () => {
        const { id: consoleId } = await consolesFactory.createConsole();
        const invalidConsoleGame = gamesFactory.generateGame(consoleId + 1);
        const response = await api.post('/games').send(invalidConsoleGame);
        expect(response.status).toBe(409);
    })
})