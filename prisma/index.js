const bcrypt = require('bcrypt')
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient().$extends({
  query: {
    user: {
      async create({ args, query }) {
        args.data.password = await bcrypt.hash(args.data.password, 10)
        return query(args)
      }
    }
  }
})
module.exports = prisma;
