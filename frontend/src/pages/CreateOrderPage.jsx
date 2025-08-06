import { useState } from "react";
import axios from "axios";

export default function CreateOrderPage() {
  const [items, setItems] = useState([{ productId: "", quantity: 1, price: 0 }]);
  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    street: "",
    city: "",
    country: "",
    zip: "",
  });
  const [shippingFee, setShippingFee] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("cartao");
  const [message, setMessage] = useState("");

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const addItem = () => setItems([...items, { productId: "", quantity: 1, price: 0 }]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const finalAmount = totalAmount + parseFloat(shippingFee) - parseFloat(discount);

    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.post(
        "/api/orders",
        {
          items,
          shippingAddress: address,
          totalAmount,
          shippingFee,
          discount,
          finalAmount,
          paymentMethod,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(`Pedido criado com sucesso! ID: ${data.order._id}`);
    } catch (err) {
      console.error(err);
      setMessage("Erro ao criar pedido");
    }
  };

  const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const finalAmount = totalAmount + parseFloat(shippingFee) - parseFloat(discount);

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white shadow-2xl rounded-xl transition-transform duration-300 hover:scale-[1.01]">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Criar Pedido</h2>
      {message && (
        <p className={`mb-4 text-center p-2 rounded ${message.includes("sucesso") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
          {message}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Items */}
        {items.map((item, index) => (
          <div key={index} className="border p-4 rounded-lg space-y-3 shadow-sm bg-gray-50">
            <input
              type="text"
              placeholder="ID do Produto"
              value={item.productId}
              onChange={(e) => handleItemChange(index, "productId", e.target.value)}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="number"
              placeholder="Quantidade"
              value={item.quantity}
              onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="number"
              placeholder="Preço"
              value={item.price}
              onChange={(e) => handleItemChange(index, "price", e.target.value)}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-400"
            />
          </div>
        ))}
        <button type="button" onClick={addItem} className="text-blue-600 underline">
          + Adicionar Item
        </button>

        {/* Endereço */}
        <div className="space-y-2">
          <h3 className="font-semibold text-lg">Endereço de Entrega</h3>
          <input
            type="text"
            placeholder="Nome completo"
            value={address.fullName}
            onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="text"
            placeholder="Telefone"
            value={address.phone}
            onChange={(e) => setAddress({ ...address, phone: e.target.value })}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="text"
            placeholder="Rua"
            value={address.street}
            onChange={(e) => setAddress({ ...address, street: e.target.value })}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="text"
            placeholder="Cidade"
            value={address.city}
            onChange={(e) => setAddress({ ...address, city: e.target.value })}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="text"
            placeholder="País"
            value={address.country}
            onChange={(e) => setAddress({ ...address, country: e.target.value })}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="text"
            placeholder="Código Postal"
            value={address.zip}
            onChange={(e) => setAddress({ ...address, zip: e.target.value })}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Extra charges */}
        <div className="space-y-2">
          <input
            type="number"
            placeholder="Taxa de envio"
            value={shippingFee}
            onChange={(e) => setShippingFee(e.target.value)}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="number"
            placeholder="Desconto"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Pagamento */}
        <div>
          <label className="font-semibold">Método de Pagamento:</label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-400 mt-1"
          >
            <option value="cartao">Cartão</option>
            <option value="transferencia">Transferência</option>
            <option value="dinheiro">Dinheiro</option>
          </select>
        </div>

        {/* Preview */}
        <div className="bg-gray-100 p-4 rounded shadow-inner text-lg font-semibold">
          Total dos Itens: {totalAmount.toFixed(2)} <br />
          + Frete: {shippingFee || 0} <br />
          - Desconto: {discount || 0} <br />
          <span className="text-blue-700 text-xl">Total Final: {finalAmount.toFixed(2)}</span>
        </div>

        <button className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition-colors">
          Criar Pedido
        </button>
      </form>
    </div>
  );
}
