const express = require("express");
const router = express.Router();
const prisma = require('../prisma');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')

// /api/auth/login - POST, login with the provided credentials and return a token
router.post('/login', async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      const error = {
        status: 400,
        message: 'Must provide both username & password',
      };
      return next(error);
    }
    const user = await prisma.user.findFirst({
      where: {
        username: username
      }
    })
    //password from the form comes first, password from the database comes 2nd
    if (user && await bcrypt.compare(password, user.password)) {
      return res.json({
        token: jwt.sign({ id: user.id }, process.env.JWT)
      });
    }
  } catch (err) {
    next(err);
  }
});

// /api/auth/register - POST, create a new User with the provided credentials and return a token
router.post('/register', async (req, res, next) => {
  try {
    const { username, password } = req.body
    if (!username || !password) {
      const error = {
        status: 400,
        message: 'Must provide both username & password',
      };
      return next(error);
    }
    const user = await prisma.user.create({
      data: {
        username: username,
        password: password,

      }
    })
    if (user) {
      return res.json({
        token: jwt.sign({ id: user.id }, process.env.JWT), message: `Welcome, ${user.username}! You have successfully registered.`
      });
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;