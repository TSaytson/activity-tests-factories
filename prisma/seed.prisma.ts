import prisma from "../src/config/database";

async function main() {
    const consoleExists =
        await prisma.console.findFirst();
    if (!consoleExists) {
        await prisma.console.createMany({
            data: [{
                name: 'Playstation 4'
            }, {
                name: 'Nintedo Switch'
            }]
        });
    }

    const gameExists =
        await prisma.game.findFirst();
    if (!gameExists) {
        const consoles =
            await prisma.console.findMany();
        await prisma.game.createMany({
            data: [{
                title: 'God of War',
                consoleId: consoles[0].id
            },
            {
                title: 'Zelda: Breath of the Wild',
                consoleId: consoles[1].id
            }]
        })
    }
}

main()
    .catch((error) => {
        console.log(error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    })