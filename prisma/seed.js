const prisma = require('../prisma');
const seed = async () => {
  //TODO: seed the database with at least 3 users. Each user should have at least 3 posts.
  for (let i = 1; i <= 5; i++) {
    await prisma.user.create({
      data: {
        username: `username${i}`,
        password: `password${i}`,
        posts: {
          create: [
            { title: `Post 1`, content: `Here is some post content!` },
            { title: `Post 2`, content: `Here is some post content!` },
            { title: `Post 3`, content: `Here is some post content!` },
          ],
        },
      },
    });
  }
};

seed()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1)
  });

module.exports = seed