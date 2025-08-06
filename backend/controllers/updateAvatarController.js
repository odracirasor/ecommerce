// controllers/updateAvatarController.js
import User from '../models/User.js';

const updateAvatar = async (req, res) => {
  const userId = req.params.userId;

  if (!req.file) {
    return res.status(400).json({ error: 'Nenhuma imagem enviada.' });
  }

  try {
    const imagePath = `/uploads/${req.file.filename}`;

    const user = await User.findByIdAndUpdate(
      userId,
      { avatar: imagePath },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    res.status(200).json({ message: 'Avatar atualizado.', avatar: imagePath });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao atualizar avatar.' });
  }
};

export default updateAvatar;
