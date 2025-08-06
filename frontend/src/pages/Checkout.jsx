import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

const provinciasDeAngola = [
  "Bengo", "Benguela", "Bié", "Cabinda", "Cuando Cubango", "Cuanza Norte",
  "Cuanza Sul", "Cunene", "Huambo", "Huíla", "Luanda", "Lunda Norte",
  "Lunda Sul", "Malanje", "Moxico", "Namibe", "Uíge", "Zaire"
];

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();

  const total = cart.reduce((sum, item) => sum + Math.max(0, item.price) * item.quantity, 0);

  const [form, setForm] = useState({
    nome: "",
    endereco: "",
    provincia: "",
    cidade: "",
    postal: "",
    pagamento: "cash",
    bilhete: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { nome, endereco, provincia, cidade, postal, pagamento, bilhete } = form;
    if (!nome || !endereco || !provincia || !cidade || !postal) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    const orderData = {
      user: nome,
      items: cart,
      shipping: { nome, endereco, provincia, cidade, postal },
      paymentMethod: pagamento,
      total,
      bilhete: bilhete || null,
    };

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Usuário não autenticado. Faça login.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      if (!res.ok) throw new Error("Erro ao finalizar o pedido.");

      const data = await res.json();
      clearCart();
      alert("✅ Pedido finalizado com sucesso!");
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Erro ao processar pedido.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4 py-10">
      <div className="bg-white p-6 md:p-10 rounded-2xl shadow-xl w-full max-w-2xl">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Finalizar Compra</h1>

        {cart.map((item) => (
          <div
            key={item._id}
            className="border p-3 mb-3 rounded-lg bg-gray-50 flex justify-between items-center"
          >
            <div>
              <div className="font-semibold text-gray-800">{item.name}</div>
              <div className="text-sm text-gray-600">Quantidade: {item.quantity}</div>
            </div>
            <div className="text-sm text-right text-gray-700">
              Kz {(Math.max(0, item.price * item.quantity)).toLocaleString()}
            </div>
          </div>
        ))}

        <div className="font-bold text-right mb-6 text-lg text-blue-600">
          Total Geral: Kz {total.toLocaleString()}
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            name="nome"
            placeholder="Nome completo"
            className="w-full border p-3 rounded-lg"
            value={form.nome}
            onChange={handleChange}
          />
          <input
            type="text"
            name="endereco"
            placeholder="Endereço"
            className="w-full border p-3 rounded-lg"
            value={form.endereco}
            onChange={handleChange}
          />
          <select
            name="provincia"
            className="w-full border p-3 rounded-lg"
            value={form.provincia}
            onChange={handleChange}
          >
            <option value="">Selecione a província</option>
            {provinciasDeAngola.map((prov) => (
              <option key={prov} value={prov}>
                {prov}
              </option>
            ))}
          </select>
          <input
            type="text"
            name="cidade"
            placeholder="Cidade"
            className="w-full border p-3 rounded-lg"
            value={form.cidade}
            onChange={handleChange}
          />
          <input
            type="text"
            name="postal"
            placeholder="Código Postal"
            className="w-full border p-3 rounded-lg"
            value={form.postal}
            onChange={handleChange}
          />
          <input
            type="text"
            name="bilhete"
            placeholder="Nº do Bilhete de Identidade (opcional)"
            className="w-full border p-3 rounded-lg"
            value={form.bilhete}
            onChange={handleChange}
          />
          <div>
            <label className="block mb-1 font-semibold text-gray-700">Método de Pagamento</label>
            <select
              name="pagamento"
              value={form.pagamento}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg"
            >
              <option value="cash">Dinheiro na entrega</option>
              <option value="transfer">Transferência bancária</option>
              <option value="mobile">Pagamento por telemóvel</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold transition"
          >
            Finalizar Pedido
          </button>
        </form>
      </div>
    </div>
  );
};

export const refreshToken = async () => {
  const refreshToken = localStorage.getItem("refreshToken");

  const res = await fetch("http://localhost:5000/api/auth/refresh", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });

  if (!res.ok) throw new Error("Falha ao renovar token");
  const data = await res.json();
  localStorage.setItem("token", data.accessToken);
  return data.accessToken;
};

export default Checkout;
