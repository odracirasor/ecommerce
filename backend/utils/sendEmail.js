// utils/sendEmail.js
import nodemailer from 'nodemailer';

export const sendVerificationEmail = async (toEmail, token) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // ex: 'seuemail@gmail.com'
      pass: process.env.EMAIL_PASS  // App Password, não a senha normal
    }
  });

  const verificationUrl = `http://localhost:5173/verify/${token}`;

  const mailOptions = {
    from: `"Ecommerce App" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: 'Verifique sua conta',
    html: `
      <h2>Bem-vindo!</h2>
      <p>Clique no botão abaixo para verificar sua conta:</p>
      <a href="${verificationUrl}" style="padding: 10px 15px; background-color: #007bff; color: white; text-decoration: none;">Verificar Conta</a>
      <p>Ou copie e cole este link no navegador:</p>
      <p>${verificationUrl}</p>
    `
  };

  await transporter.sendMail(mailOptions);
};
