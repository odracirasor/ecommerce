// testEmail.js
import dotenv from 'dotenv';
dotenv.config();

import { sendVerificationEmail } from './utils/sendEmail.js';

const test = async () => {
  const testEmail = 'rosaricardo290@gmail.com';
  const fakeToken = '1234567890abcdef';

  try {
    await sendVerificationEmail(testEmail, fakeToken);
    console.log('✅ Email enviado com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao enviar email:', error);
  }
};

test();// utils/sendEmail.js
import nodemailer from 'nodemailer';

export const sendVerificationEmail = async (toEmail, token) => {
  console.log('📨 Preparando envio de email para:', toEmail);
  console.log('🔐 Token de verificação:', token);

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // ex: 'seuemail@gmail.com'
      pass: process.env.EMAIL_PASS  // App Password, não a senha normal
    }
  });

  const verificationUrl = `http://localhost:5173/verify/${token}`;
  console.log('🔗 Link de verificação:', verificationUrl);

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

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email enviado com sucesso:', info.response);
  } catch (error) {
    console.error('❌ Erro ao enviar email:', error);
  }
};
