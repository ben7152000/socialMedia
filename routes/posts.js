const router = require('express').Router()
const Post = require('../models/Post')
const User = require('../models/User')

// create a post
router.post('/', async (req, res) => {
  try {
    const newPost = new Post(req.body)
    const post = await newPost.save()
    return res.status(200).json(post)
  } catch (e) {
    return res.status(500).json(e)
  }
})

// get a post
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    return res.status(200).json(post)
  } catch (e) {
    return res.status(500).json(e)
  }
})

// update a post
router.put('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    if (post.userId === req.body.userId) {
      await post.updateOne({ $set: req.body })
      res.status(200).json('a post has been updated')
    } else {
      res.status(403).json('you can update only your post')
    }
  } catch (e) {
    res.status(500).json(e)
  }
})

// delete a post
router.delete('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    if (post.userId === req.body.userId) {
      await post.deleteOne()
      return res.status(200).json('a post has been deleted')
    } else {
      return res.status(403).json('you can delete only your post')
    }
  } catch (e) {
    return res.status(500).json(e)
  }
})

module.exports = router
