import React, { useState, useEffect } from "react";

const Configuracoes = () => {
  const [username, setUsername] = useState("mestre_ricardo");
  const [newUsername, setNewUsername] = useState("");
  const [biType, setBiType] = useState("none"); // 'none', 'number', 'image'
  const [biNumber, setBiNumber] = useState("");
  const [biImage, setBiImage] = useState(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [background, setBackground] = useState("white");

  useEffect(() => {
    document.body.style.backgroundColor = background;
  }, [background]);

  const handleBiImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBiImage(file);
      alert("📄 Imagem do BI carregada com sucesso!");
    }
  };

  const handleUsernameChange = () => {
    if (newUsername.trim() === "") return alert("Nome inválido");
    setUsername(newUsername);
    alert("✅ Nome de usuário alterado com sucesso!");
    setNewUsername("");
  };

  const handlePasswordChange = () => {
    if (!currentPassword || !newPassword) {
      return alert("Preencha ambos os campos de senha");
    }

    if (currentPassword !== "senha-fake") {
      return alert("❌ Senha atual incorreta");
    }

    alert("✅ Senha alterada com sucesso!");
    setCurrentPassword("");
    setNewPassword("");
  };

  const handleBackgroundChange = () => {
    const newColor = background === "white" ? "#f0f0f0" : "white";
    setBackground(newColor);
  };

  const handleSaveAll = () => {
    const configData = {
      username,
      biType,
      biNumber,
      biImage: biImage?.name || null,
      background,
    };

    console.log("🔒 Salvando configurações:", configData);
    alert("✅ Todas as alterações foram salvas!");
    // Aqui você pode fazer um fetch/axios POST para salvar no backend
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Configurações</h1>

      {/* BI */}
      <div className="mb-6">
        <label className="block mb-1 font-semibold">Bilhete de Identidade (opcional)</label>
        <select
          className="w-full border p-2 rounded mb-2"
          value={biType}
          onChange={(e) => {
            setBiType(e.target.value);
            setBiNumber("");
            setBiImage(null);
          }}
        >
          <option value="none">Não fornecer</option>
          <option value="number">Inserir número</option>
          <option value="image">Carregar imagem</option>
        </select>

        {biType === "number" && (
          <input
            type="text"
            className="w-full border p-2 rounded"
            placeholder="Número do BI"
            value={biNumber}
            onChange={(e) => setBiNumber(e.target.value)}
          />
        )}

        {biType === "image" && (
          <>
            <input type="file" accept="image/*" onChange={handleBiImageUpload} />
            {biImage && (
              <p className="text-sm text-green-600 mt-1">✅ {biImage.name} carregado</p>
            )}
          </>
        )}
      </div>

      {/* Nome de Usuário */}
      <div className="mb-6">
        <label className="block mb-1 font-semibold">Alterar Nome de Usuário</label>
        <input
          type="text"
          className="w-full border p-2 rounded"
          placeholder="Novo nome de usuário"
          value={newUsername}
          onChange={(e) => setNewUsername(e.target.value)}
        />
        <button
          onClick={handleUsernameChange}
          className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Alterar Nome
        </button>
      </div>

      {/* Senha */}
      <div className="mb-6">
        <label className="block mb-1 font-semibold">Alterar Senha</label>
        <input
          type="password"
          className="w-full border p-2 rounded mb-2"
          placeholder="Senha atual"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />
        <input
          type="password"
          className="w-full border p-2 rounded"
          placeholder="Nova senha"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <button
          onClick={handlePasswordChange}
          className="mt-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Alterar Senha
        </button>
      </div>

      {/* Fundo */}
      <div className="mb-6">
        <label className="block mb-1 font-semibold">Fundo do Site</label>
        <button
          onClick={handleBackgroundChange}
          className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800"
        >
          Alterar Fundo
        </button>
        <p className="text-sm text-gray-600 mt-1">Cor atual: {background}</p>
      </div>

      {/* Botão Final de Salvar Tudo */}
      <div className="text-right">
        <button
          onClick={handleSaveAll}
          className="bg-purple-600 text-white px-6 py-3 rounded hover:bg-purple-700"
        >
          💾 Salvar Todas as Alterações
        </button>
      </div>
    </div>
  );
};

export default Configuracoes;
