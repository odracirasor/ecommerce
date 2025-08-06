// utils/sanitizeUser.js

const sanitizeUser = (user) => {
  const {
    password,
    verifyToken,
    resetPasswordToken,
    resetPasswordExpires,
    ...data
  } = user.toObject();

  return data;
};

export default sanitizeUser;
