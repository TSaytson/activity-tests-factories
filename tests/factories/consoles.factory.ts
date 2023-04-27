import prisma from '../../src/config/database';
import { faker } from '@faker-js/faker'

function generateConsole() {
    return {
        name: faker.commerce.product()
    }
}

async function createConsole() {
    return await prisma.console.create({
        data: {
            name: faker.commerce.product()
        }
    })
}

async function createManyConsoles() {

    return await prisma.console.createMany({
        data: [{
            name: faker.commerce.product()
        },
        {
            name: faker.commerce.product()
        }]
    })
}

export default {
    generateConsole,
    createConsole,
    createManyConsoles
}