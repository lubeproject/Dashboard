import nodemailer from 'nodemailer';

export const sendResetEmail = async (email, resetUrl) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.REACT_APP_EMAIL_HOST,
      port: process.env.REACT_APP_EMAIL_PORT,
      secure: true, // true for 465, false for other ports
      auth: {
        user: process.env.REACT_APP_EMAIL_USER,
        pass: process.env.REACT_APP_EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Your Company" <${process.env.REACT_APP_EMAIL_USER}>`,
      to: email,
      subject: 'Reset Your Password',
      text: `You requested a password reset. Please click the link below to reset your password: ${resetUrl}`,
      html: `
        <p>Hi,</p>
        <p>You requested a password reset. Please click the link below to reset your password:</p>
        <a href="${resetUrl}">Reset Password</a>
        <p>If you did not request this, please ignore this email. This link will expire in 1 hour.</p>
        <p>Thank you,<br>Your Company Team</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('Reset email sent successfully.');
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send reset email.');
  }
};
