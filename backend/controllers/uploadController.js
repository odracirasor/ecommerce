import path from 'path';

export const handleImageUpload = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Nenhuma imagem enviada.' });
  }

  const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  res.status(200).json({ imageUrl });
};
