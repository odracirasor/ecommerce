import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendVerificationEmail = async (to, token) => {
  const link = `http://localhost:3000/verify/${token}`;
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: "Verifique sua conta - Bue",
    html: `<p>Verifique sua conta:</p><a href="${link}">${link}</a>`,
  });
};

export const sendResetEmail = async (to, link) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: "Redefinir senha - Bue",
    html: `<p>Clique no link para redefinir sua senha:</p><a href="${link}">${link}</a>`,
  });
};
