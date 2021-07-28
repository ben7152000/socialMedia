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
    const id = req.params.id
    const post = await Post.findById(id)
    return res.status(200).json(post)
  } catch (e) {
    return res.status(500).json(e)
  }
})

// update a post
router.put('/:id', async (req, res) => {
  try {
    const userId = req.body.userId
    const id = req.params.id
    const post = await Post.findById(id)
    if (post.userId === userId) {
      await post.updateOne({ $set: req.body })
      return res.status(200).json('a post has been updated')
    } else {
      return res.status(403).json('you can update only your post')
    }
  } catch (e) {
    return res.status(500).json(e)
  }
})

// delete a post
router.delete('/:id', async (req, res) => {
  try {
    const userId = req.body.userId
    const id = req.params.id
    const post = await Post.findById(id)
    if (post.userId === userId) {
      await post.deleteOne()
      return res.status(200).json('a post has been deleted')
    } else {
      return res.status(403).json('you can delete only your post')
    }
  } catch (e) {
    return res.status(500).json(e)
  }
})

// like or dislike a post
router.put('/:id/like', async (req, res) => {
  try {
    const userId = req.body.userId
    const id = req.params.id
    const post = await Post.findById(id)
    if (!post.likes.includes(userId)) {
      await post.updateOne({ $push: { likes: userId } })
      return res.status(200).json('a post has been liked')
    } else {
      await post.updateOne({ $pull: { likes: userId } })
      return res.status(200).json('a post has been disliked')
    }
  } catch (e) {
    return res.status(500).json(e)
  }
})

// get timeline all posts
router.get('/timeline/all', async (req, res) => {
  try {
    const userId = req.body.userId
    const currentUser = await User.findById(userId)
    const userPosts = await Post.find({ userId: currentUser._id })
    const friendPosts = await Promise.all(
      currentUser.followings.map((friendId) => {
        return Post.find({ userId: friendId })
      })
    )
    return res.json(userPosts.concat(...friendPosts))
  } catch (e) {
    return res.status(500).json(e)
  }
})

// get user's all posts
router.get('/profile/:username', async (req, res) => {
  try {
    const username = req.params.username
    const user = await User.findOne({ username })
    const posts = await Post.find({ userId: user._id })
    return res.status(200).json(posts)
  } catch (e) {
    return res.status(500).json(e)
  }
})

module.exports = router
