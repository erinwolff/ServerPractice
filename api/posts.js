const express = require("express");
const router = express.Router();
const prisma = require('../prisma');
const requireToken = require('./requireToken');


// /api/posts - GET all posts
router.get('/', async (req, res, next) => {
  try {
    const posts = await prisma.post.findMany();
    res.json(posts);
  } catch (err) {
    next(err);
  }
});

// /api/posts/:id - GET the post specified by the id
router.get('/:id', async (req, res, next) => {
  try {
    const id = +req.params.id
    const result = await prisma.post.findUnique({
      where: {
        id: id,
      },
    });
    if (!result) {
      return next({
        status: 404,
        message: `Could not find post with id ${id}`
      });
    }
    res.json(result)
  } catch (err) {
    next(err);
  }
})


// /api/posts - POST, create a new post as the currently logged-in user
router.post('/', requireToken, async (req, res, next) => {
  try {
    if (!req.user) {
      return next({
        status: 401,
        message: 'Please login to create a new post.'
      });
    }

    const { userTitle, userContent } = req.body
    if (!userTitle || !userContent) {
      const error = {
        status: 400,
        message: 'Must provide title & content.',
      };
      return next(error);
    }
    const post = await prisma.post.create({
      data: { title: userTitle, content: userContent, userId: req.user.id }
    })
    res.json(post);
  } catch (err) {
    next(err);
  }
});

// /api/posts/:id - PUT, update a post only if it was created by the currently logged in user
router.put('/:id', requireToken, async (req, res, next) => {
  try {
    if (!req.user) {
      return next({
        status: 401,
        message: 'Please login to update your post.'
      });
    }
    const id = +req.params.id
    const postExists = await prisma.post.findUnique({ where: { id } });
    if (!postExists) {
      return next({
        status: 404,
        message: `Could not find post with id ${id}`,
      });
    }
    if (postExists.userId !== req.user.id) {
      return next({
        status: 403,
        message: 'You can only update posts that you created.'
      });
    }
    const { userTitle, userContent } = req.body
    if (!userTitle || !userContent) {
      return next({
        status: 400,
        message: 'Must provide title & content.'
      });
    }
    const update = await prisma.post.update({
      where: { id },
      data: { title: userTitle, content: userContent }
    });
    res.json(update)
  } catch (err) {
    next(err);
  }
})

// /api/posts/:id - DELETE, delete a post only if it was created by the currently logged in user
router.delete('/:id', requireToken, async (req, res, next) => {
  try {
    if (!req.user) {
      return next({
        status: 401,
        message: 'Please login to delete your post.'
      });
    }
    
    const id = +req.params.id
    const postExists = await prisma.post.findUnique({ where: { id } });
    if (!postExists) {
      return next({
        status: 404,
        message: `Could not find post with id ${id}`,
      });
    }
    if (postExists.userId !== req.user.id) {
      return next({
        status: 403,
        message: 'You can only update posts that you created.'
      });
    }
    const deletePost = await prisma.post.delete({
      where: { id },
    });
    res.json(`Post with id ${id} was successfully deleted.`)
  } catch (err) {
    next(err);
  }
})

module.exports = router;