import User from '../../models/userModel.js';

export const verifyAccount = async (req, res) => {
  const { token } = req.params;
  console.log("🔍 Iniciando verificação com token:", token);

  try {
    const user = await User.findOne({ verifyToken: token });

    if (!user) {
      console.warn("⚠️ Token inválido ou já utilizado.");
      return res.status(400).json({ error: "Token inválido ou expirado." });
    }

    user.isVerified = true;
    user.verifyToken = null;
    await user.save();

    console.log(`✅ Conta verificada com sucesso para o e-mail: ${user.email}`);
    res.status(200).json({ message: "Conta verificada com sucesso!" });
  } catch (error) {
    console.error("❌ Erro ao verificar token:", error.message);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
};
