const nodemailer = require('nodemailer')

module.exports = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASS
    }
  })

  await transporter.sendMail({
    from: process.env.EMAIL,
    to: email,
    subject: 'Your OTP',
    text: `Your OTP is ${otp}. Valid for 5 minutes`
  })
}
