const router = require('express').Router()
const User = require('../models/User')
const bcrypt = require('bcrypt')

// update user
router.put('/:id', async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
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
        req.params.id,
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

module.exports = router
