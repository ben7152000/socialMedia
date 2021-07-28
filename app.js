const express = require('express')
const app = express()
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const helmet = require('helmet')
const morgan = require('morgan')
const multer = require('multer')
const path = require('path')
const PORT = 8081
const userRoute = require('./routes/users')
const authRoute = require('./routes/auth')
const postRoute = require('./routes/posts')

dotenv.config()

// database
mongoose.connect(
  process.env.MONGO_URL,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => { console.log('Connected to MongoDB') }
)

// static
app.use('/images', express.static(path.join(__dirname, 'public/images')))

// middlewares
app.use(express.json())
app.use(helmet())
app.use(morgan('common'))

// multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images')
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name)
  }
})

const upload = multer({ storage })
app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    return res.status(200).json('file uploded successfully')
  } catch (e) {
    console.error(e)
  }
})

// routes
app.use('/api/auth', authRoute)
app.use('/api/users', userRoute)
app.use('/api/posts', postRoute)

app.listen(PORT, () => {
  console.log('Backend server is running!')
})
