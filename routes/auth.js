const router = require('express').Router()
const bcrypt = require('bcryptjs')
const User = require('../models/user')
const sendMail = require('../utils/sendMail')

// SIGNUP
router.post('/signup', async (req, res) => {
  const { username, password, role } = req.body
  const user = new User({ username, password, role })
  await user.save()
  res.json({ message: "User Registered" })
})

// LOGIN → SEND OTP
router.post('/login', async (req, res) => {
  const { username, password } = req.body
  const user = await User.findOne({ username })

  if (!user) return res.status(401).json({ error: "User not found" })

  const valid = await bcrypt.compare(password, user.password)
  if (!valid) return res.status(401).json({ error: "Wrong password" })

  const otp = Math.floor(100000 + Math.random() * 900000).toString()

  user.otp = otp
  user.otpExpiry = Date.now() + 5 * 60 * 1000
  user.isVerified = false
  await user.save()

  await sendMail(username, otp)

  res.json({ message: "OTP sent to email" })
})

// VERIFY OTP
router.post('/verify-otp', async (req, res) => {
  const { username, otp } = req.body
  const user = await User.findOne({ username })

  if (
    user.otp !== otp ||
    Date.now() > user.otpExpiry
  ) {
    return res.status(401).json({ error: "Invalid OTP" })
  }

  user.isVerified = true
  user.otp = null
  await user.save()

  res.json({ message: "OTP Verified Successfully" })
})

module.exports = router
