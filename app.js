const express = require('express');
const morgan = require('morgan');
const app = express();

// middleware: logging & bodyparser
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))


// middleware: routers

// /api
app.use('/api/profile', require('./api/profile.js'));

// /api/auth
app.use('/api/auth', require('./api/auth.js'));

// /api/posts
app.use('/api/posts', require('./api/posts.js'));

// Simple error handling middleware
app.use((err, req, res, next)=> {
  console.error(err);
  const status = err.status ?? 500;
  const message = err.message ?? 'Internal server error.';
  res.status(status).json({message});
});

module.exports = app