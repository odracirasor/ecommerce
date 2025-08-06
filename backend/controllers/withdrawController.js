// controllers/withdrawController.js
import User from '../models/User.js';

export const handleWithdraw = async (req, res) => {
  const { amount } = req.body;

  const user = await User.findById(req.userId);
  if (user.balance < amount) {
    return res.status(400).json({ error: 'Saldo insuficiente' });
  }

  user.balance -= amount;
  await user.save();

  // Aqui você pode adicionar lógica para enviar para um sistema de pagamento real
  res.json({ message: 'Retirada solicitada com sucesso.' });
};
