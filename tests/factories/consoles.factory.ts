import prisma from '../../src/config/database';
import { faker } from '@faker-js/faker'

function generateConsole() {
    return {
        name: faker.helpers.unique(faker.commerce.product)
    }
}

function createConsole() {
    return prisma.console.create({
        data: {
            name: faker.helpers.unique(faker.commerce.product)
        }
    })
}

function createManyConsoles() {

    return prisma.console.createMany({
        data: [
            generateConsole(),
            generateConsole(),
            generateConsole()
        ]
    })
}

export const consolesFactory = {
    generateConsole,
    createConsole,
    createManyConsoles
}