import prisma from '../../src/config/database';
import { faker } from '@faker-js/faker'

function createGame(consoleId: number) {
    return prisma.game.create({
        data: {
            title: faker.helpers.unique(faker.commerce.product),
            consoleId
        }
    })
}

function createManyGames(consoleId: number) {
    return prisma.game.createMany({
        data: [
            generateGame(consoleId),
            generateGame(consoleId),
            generateGame(consoleId),
            generateGame(consoleId),
        ]
    })
}

function generateGame(consoleId: number) {
    return {
        title: faker.helpers.unique(faker.commerce.product),
        consoleId
    }
}

export const gamesFactory = {
    createGame,
    createManyGames,
    generateGame
}