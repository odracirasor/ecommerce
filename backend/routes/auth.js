router.get("/verify/:token", async (req, res) => {
  const { token } = req.params;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ email: decoded.email, verifyToken: token });

    if (!user) return res.status(400).json({ error: "Token inválido" });

    user.verified = true;
    user.verifyToken = null;
    await user.save();

    res.status(200).json({ message: "Conta verificada com sucesso" });
  } catch (error) {
    res.status(400).json({ error: "Token expirado ou inválido" });
  }
});
