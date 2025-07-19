import React, { useState } from "react";

const Settings = () => {
  const [name, setName] = useState("João Silva");
  const [email, setEmail] = useState("joao@example.com");
  const [language, setLanguage] = useState("pt");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("⚙️ Configurações salvas com sucesso!");
    // Aqui você pode enviar os dados atualizados para o backend
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Configurações da Conta</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Nome</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Nova Senha</label>
          <input
            type="password"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Idioma Preferido</label>
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
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Salvar Configurações
        </button>
      </form>
    </div>
  );
};

export default Settings;
