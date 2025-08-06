import jwt from 'jsonwebtoken';
import RefreshToken from '../../models/RefreshToken.js';
import { generateAccessToken } from '../../utils/generateAccessToken.js';

export const refreshTokenHandler = async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ error: 'Refresh token ausente.' });
  }

  try {
    const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    const storedToken = await RefreshToken.findOne({ token: refreshToken });
    if (!storedToken) {
      return res.status(403).json({ error: 'Refresh token inválido.' });
    }

    const newAccessToken = generateAccessToken({ _id: payload.id });

    // Você pode também renovar o refresh token e atualizar o cookie, se desejar
    res.cookie('accessToken', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 15 * 60 * 1000, // 15 minutos
    });

    res.json({ message: 'Novo token gerado com sucesso.' });
  } catch (err) {
    res.status(403).json({ error: 'Token expirado ou inválido.' });
  }
};
