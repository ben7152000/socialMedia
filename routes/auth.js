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

// login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user) return res.status(404).json('user not found')

    const validPassword = await bcrypt.compare(password, user.password)
    if (!validPassword) return res.status(400).json('password is wrong')

    const { userPassword, ...info } = user
    return res.status(200).json(info)
  } catch (e) {
    return res.status(500).json(e)
  }
})

module.exports = router
