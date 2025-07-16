import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const [form, setForm] = useState({
    nome: "",
    endereco: "",
    cidade: "",
    postal: "",
    pagamento: "cash",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { nome, endereco, cidade, postal, pagamento } = form;
    if (!nome || !endereco || !cidade || !postal) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    const orderData = {
      user: nome,
      items: cart,
      shipping: { nome, endereco, cidade, postal },
      paymentMethod: pagamento,
      total
    };

    try {
      const res = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData)
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
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Finalizar Compra</h1>

      {cart.map((item) => (
        <div key={item._id} className="border p-2 mb-2 rounded bg-white shadow-sm">
          <div className="font-semibold">{item.name}</div>
          <div className="text-sm text-gray-600">Quantidade: {item.quantity}</div>
          <div className="text-sm text-gray-600">
            Preço total: Kz {(item.price * item.quantity).toLocaleString()}
          </div>
        </div>
      ))}

      <div className="font-bold text-right mb-6 text-lg">
        Total Geral: Kz {total.toLocaleString()}
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <input type="text" name="nome" placeholder="Nome completo" className="w-full border p-2 rounded" value={form.nome} onChange={handleChange} />
        <input type="text" name="endereco" placeholder="Endereço" className="w-full border p-2 rounded" value={form.endereco} onChange={handleChange} />
        <input type="text" name="cidade" placeholder="Cidade" className="w-full border p-2 rounded" value={form.cidade} onChange={handleChange} />
        <input type="text" name="postal" placeholder="Código Postal" className="w-full border p-2 rounded" value={form.postal} onChange={handleChange} />

        <div>
          <label className="block mb-1 font-semibold">Método de Pagamento</label>
          <select name="pagamento" value={form.pagamento} onChange={handleChange} className="w-full border p-2 rounded">
            <option value="cash">Dinheiro na entrega</option>
            <option value="transfer">Transferência bancária</option>
            <option value="mobile">Pagamento por telemóvel</option>
          </select>
        </div>

        <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
          Finalizar Pedido
        </button>
      </form>
    </div>
  );
};

export default Checkout;
