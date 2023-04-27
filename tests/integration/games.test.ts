import app from "app";
import prisma from "../../src/config/database";
import supertest from "supertest";
import { gamesFactory } from "../factories";
import { cleanDB } from "../helpers";

const api = supertest(app);

beforeEach(async () => {
    await cleanDB();
})

describe(`GET /games`, () => {
    it(`should return statusCode 200 and a list of games`, async () => {
        await gamesFactory.createGame();
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
        const game = await gamesFactory.createGame();
        const response = await api.get(`/games/${game.id}`);
        expect(response.status).toBe(200)
        expect(response.body).toEqual(game);
    })
})

describe(`POST /games`, () => {
    it(`should respond with status 201 and insert the game in the database`, async () => {
        const generatedGame = await gamesFactory.generateGame();
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
        const game = await gamesFactory.createGame();
        delete game.id;
        const response = await api.post('/games').send(game);
        expect(response.status).toBe(409);
    })
})