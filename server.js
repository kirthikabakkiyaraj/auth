require('dotenv').config()
const express = require('express')
require('./db')

const auth = require('./routes/auth')
const otpVerify = require('./middleware/otpVerify')
const roleCheck = require('./middleware/roleCheck')

const app = express()
app.use(express.json())

app.use('/auth', auth)

// USER API
app.get('/user-data', otpVerify, (req, res) => {
  res.json({ message: "User Data Accessed" })
})

// ADMIN API
app.get('/admin-data',
  otpVerify,
  roleCheck(['ADMIN']),
  (req, res) => {
    res.json({ message: "Admin Access Granted" })
})

app.listen(process.env.PORT, () =>
  console.log("Server Running")
)
