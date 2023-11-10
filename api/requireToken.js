const jwt = require('jsonwebtoken')
const prisma = require('../prisma')

const requireToken = async (req, res, next) => {
  try {
    // This line verifies the user is logged in
    const payload = jwt.verify(req.headers.authorization, process.env.JWT)

    const user = await prisma.user.findUnique({
      where: {
        id: payload.id
      }
    })

    // This line adds the user data to the `req` object
    req.user = user;
    next();
  } catch(error) {
    console.error(error.stack);
    res.status(401).send('not logged in');
  }
};

module.exports = requireToken;