import prisma from '../../src/config/database';
import { faker } from '@faker-js/faker'
import consolesFactory from './consoles.factory';


async function createGame() {
    const console = await consolesFactory.createConsole();
    return await prisma.game.create({
        data: {
            title: faker.commerce.product(),
            consoleId: console.id
        }
    })
}

async function createManyGames() {
    const console = await prisma.console.create({
        data: {
            name: faker.commerce.product()
        }
    })
}

async function generateGame() {
    const console = await consolesFactory.createConsole();
    const game = {
        title: faker.commerce.product(),
        consoleId: console.id
    }
    return game;
}

export const gamesFactory = {
    generateGame,
    createGame
}