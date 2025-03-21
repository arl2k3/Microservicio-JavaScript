const {PrismaClient} = require('@prisma/client');
const {} = require('../util/validationSchema');

const prisma = new PrismaClient();

async function verifyByEmail(email) {
    try {
        const user = await prisma.user.update({
            where: {
                email: email
            },
            data: {
                verified: true,
                verificationCode: null 
            }
        });
        return user;
    }
    catch (error) {
        throw new Error('Error al verificar el usuario: ' + error.message);
    }
}

    module.exports = { verifyByEmail };