// utils/sendEmail.js
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

export const sendVerificationEmail = async (toEmail, token) => {
  console.log('📨 Preparando envio de email para:', toEmail);
  console.log('🔐 Token de verificação:', token);

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // Seu email do Gmail
      pass: process.env.EMAIL_PASS  // Senha de app do Gmail (App Password)
    }
  });

  const verificationUrl = `http://localhost:5173/verify/${token}`;

  const mailOptions = {
    from: `"Ecommerce App" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: 'Verifique sua conta',
    html: `
      <h2>Bem-vindo à nossa loja!</h2>
      <p>Clique no botão abaixo para verificar sua conta:</p>
      <a href="${verificationUrl}" style="padding: 10px 15px; background-color: #28a745; color: white; text-decoration: none;">Verificar Conta</a>
      <p>Ou copie e cole este link no navegador:</p>
      <p>${verificationUrl}</p>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email enviado com sucesso:', info.response);
  } catch (error) {
    console.error('❌ Erro ao enviar email:', error);
  }
};
