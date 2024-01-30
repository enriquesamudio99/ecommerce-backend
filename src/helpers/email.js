import nodemailer from 'nodemailer';

const forgetPasswordEmail = async (data) => {
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const { name, email, token } = data;

  await transport.sendMail({
    from: 'ecommerce.com',
    to: email,
    subject: 'Reset your password on ecommerce',
    text: 'Reset your password on ecommerce',
    html: `
      <p>Hello ${name}, reset your user password</p>
      <p>Enter the following link to generate your new password: <a href="${process.env.BACKEND_URL}:${process.env.SERVER_PORT || 3000}/auth/users/forget-password/${token}">Change Password</a></p>
      <p>If you did not request this change, just ignore it.</p>
    `
  });
}

export {
  forgetPasswordEmail
}