const express = require("express");
const router = express.Router();
const prisma = require('../prisma');
const requireToken = require('./requireToken');


// /api/profile GET - returns the current logged-in user's information, excluding the password
router.get('/', requireToken, async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.user.id
      }
    })
    if (!user) {
      return res.status(404).send('User not found')
    }
    const profile = await prisma.post.findMany({
      where: {
        userId: req.user.id
      }
    })
    return res.json({ message: `Welcome, ${user.username}! Here are your posts:`, data: profile })
  } catch (err) {
    next(err);
  }
});


module.exports = router;


