const router = require('express').Router()
const User = require('../models/User')
const bcrypt = require('bcrypt')

// update user
router.put('/:id', async (req, res) => {
  const userId = req.body.userId
  const id = req.params.id
  const isAdmin = req.body.isAdmin
  if (userId === id || isAdmin) {
    if (req.body.password) {
      try {
        const salt = await bcrypt.genSalt(10)
        req.body.password = await bcrypt.hash(req.body.password, salt)
      } catch (e) {
        return res.status(500).json(e)
      }
    }
    try {
      await User.findOneAndUpdate(
        id,
        { $set: req.body }
      )
      return res.status(200).json('account hs been update')
    } catch (e) {
      return res.status(500).json(e)
    }
  } else {
    return res.status(403).json('you can update only your account!')
  }
})

// delete user
router.delete('/:id', async (req, res) => {
  const userId = req.body.userId
  const id = req.params.id
  const isAdmin = req.body.isAdmin
  if (userId === id || isAdmin) {
    try {
      await User.findByIdAndDelete(id)
      return res.status(200).json('account has been deleted')
    } catch (e) {
      return res.status(500).json(e)
    }
  } else {
    return res.status(403).json('you can delete only your account!')
  }
})

// get a user
router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id
    const user = await User.findById(id)
    const { password, updatedAt, ...info } = user._doc
    return res.status(200).json(info)
  } catch (e) {
    return res.status(500).json(e)
  }
})

// follow a user
router.put('/:id/follow', async (req, res) => {
  const userId = req.body.userId
  const id = req.params.id
  if (userId !== id) {
    try {
      const user = await User.findById(id)
      const currentUser = await User.findById(userId)
      if (!user.followers.includes(userId)) {
        await user.updateOne({ $push: { followers: userId } })
        await currentUser.updateOne({ $push: { followings: id } })
        return res.status(200).json('user has been followed')
      } else {
        return res.status(500).json('you already follow this user')
      }
    } catch (e) {
      return res.status(500).json(e)
    }
  } else {
    return res.status(403).json('you cannot follow yourself')
  }
})

// unfollow a user
router.put('/:id/unfollow', async (req, res) => {
  const userId = req.body.userId
  const id = req.params.id
  if (userId !== id) {
    try {
      const user = await User.findById(id)
      const currentUser = await User.findById(userId)
      if (user.followers.includes(userId)) {
        await user.updateOne({ $pull: { followers: userId } })
        await currentUser.updateOne({ $pull: { followings: id } })
        return res.status(200).json('user has been unfollowed')
      } else {
        return res.status(403).json('you dont follow this user')
      }
    } catch (e) {
      return res.status(500).json(e)
    }
  } else {
    return res.status(403).json('you cannot unfollow yourself')
  }
})

module.exports = router
