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

async function create_User(userData) {
  try {
    const newUser = await prisma.user.create({
      data: {
        user: userData.user,
        email: userData.email,
        password: userData.password,
        recovery_email: userData.recovery_email || null,
        verified: false,
        verificationCode: userData.verificationCode || null,
        isAdmin: false
      }
    });
    return newUser;
  }
  catch (error) {
    throw new Error('Error al crear el usuario: ' + error.message);
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

async function getByEmail (email) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email
      }
    });
    return user;
  }
  catch (error) {
    throw new Error('Error al obtener el usuario: ' + error.message);
  }
}

async function putUser(usernameOrEmail, userData) {
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
        password: userData.password,
        recovery_email: userData.recovery_email,
        verified: userData.verified,
        verificationCode: userData.verificationCode,
      }
    });
    return user;
  }
  catch (error) {
    throw new Error('Error al actualizar el usuario: ' + error.message);
  }
}

async function patchUser(username, userData) {
  try {
    const validationResult = userSchema.partial().safeParse(userData);
    
    if (!validationResult.success) {
      throw new Error(`Datos de usuario inválidos: ${validationResult.error.message}`);
    }

    const user = await prisma.user.updateMany({
      where: {
        user: username
      },
      data: validationResult.data
    });
    
    return user;
  }
  catch (error) {
    throw new Error('Error al actualizar el usuario: ' + error.message);
  }
}

async function deleteUser(username) {
  try {
    const user = await prisma.user.delete({
      where: {
        user: username,
      },
    });
    return user;
  } catch (error) {
    throw new Error('Error al eliminar el usuario: ' + error.message);
  }
  
}

module.exports = { getByUsername, create_User, getAllUsers, getByEmail, putUser, patchUser, deleteUser};