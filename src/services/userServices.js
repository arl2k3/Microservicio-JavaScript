const {PrismaClient} = require('@prisma/client');
const { userSchema } = require('../util/validationSchema');

const prisma = new PrismaClient();

async function getByUsername (username) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        user: username
      }
    });
    return user;
  }
  catch (error) {
    throw new Error('Error al obtener el usuario: ' + error.message);
  }
}

async function getAllUsers() {
  try {
    const users = await prisma.user.findMany();
    return users;
  }
  catch (error) {
    throw new Error('Error al obtener los usuarios: ' + error.message);
  }
}

async function postUser(userData){
  try {
    const newUser = await prisma.user.create({
      data: {
        user: userData.user,
        email: userData.email,
        recovery_email: userData.recovery_email,
        password: userData.password,
        verified: false,
        verificationCode: ''
      }
    });
    return newUser;
  } catch (error) {
    throw new Error('Error al crear el usuario: ' + error.message);
  }
}

async function putUser (usernameOrEmail, userData) {
  try {
    const user = await prisma.user.updateMany({
      where: {
        OR: [
          { email: usernameOrEmail },
          { user: usernameOrEmail }
        ]
      },
      data: {
        user: userData.user,
        email: userData.email,
        recovery_email: userData.recovery_email,
        password: userData.password,
        verified: userData.verified,
        verificationCode: userData.verificationCode
      }
    })
    return user;
  } catch (error) {
    throw new Error('Error al actualizar el usuario: ' + error.message);
  }
}

module.exports = { getByUsername, getAllUsers, postUser, putUser};