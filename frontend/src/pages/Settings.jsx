import React, { useState } from "react";

const Settings = () => {
  const [name, setName] = useState("João Silva");
  const [email, setEmail] = useState("joao@example.com");
  const [language, setLanguage] = useState("pt");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("⚙️ Configurações salvas com sucesso!");
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Configurações da Conta</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Nome</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Nova Senha</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Idioma</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full border p-2 rounded"
          >
            <option value="pt">Português</option>
            <option value="en">Inglês</option>
          </select>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Salvar Configurações
        </button>
      </form>
    </div>
  );
};

// ❗ Isso é essencial para funcionar:
export default Settings;
