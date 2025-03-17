const {PrismaClient} = require('@prisma/client');

const prisma = new PrismaClient();

const getUser = async (user) => {
  return await prisma.user.findUnique({
      where: { user: user }
  });
}

module.exports = { getUser };