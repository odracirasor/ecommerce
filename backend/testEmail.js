// testEmail.js
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // seu email do Gmail
    pass: process.env.EMAIL_PASS, // senha de app
  },
});

const mailOptions = {
  from: process.env.EMAIL_USER,
  to: 'rosaricardo290@gmail.com',
  subject: '🔔 Teste de envio de email',
  text: 'Este é um email de teste enviado do Node.js!',
};

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.error('❌ Falha ao enviar email:', error);
  } else {
    console.log('✅ Email enviado com sucesso:', info.response);
  }
});
