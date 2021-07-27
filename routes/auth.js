const router = require('express').Router()
const User = require('../models/User')
const bcrypt = require('bcrypt')

// register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body
    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(password, salt)

    const newUser = new User({
      username,
      email,
      password: hashPassword
    })

    const user = await newUser.save()
    return res.status(200).json(user)
  } catch (e) {
    return res.status(500).json(e)
  }
})

module.exports = router
