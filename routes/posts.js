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

module.exports = router
