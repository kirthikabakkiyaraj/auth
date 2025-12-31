const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['USER', 'ADMIN'], default: 'USER' },
  otp: String,
  otpExpiry: Number,
  isVerified: { type: Boolean, default: false }
})

// hash password
userSchema.pre('save', async function () {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10)
  }
})

module.exports = mongoose.model('User', userSchema)
