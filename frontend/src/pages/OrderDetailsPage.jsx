import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function OrderDetailsPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get(`/api/orders/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrder(data.order);
      } catch (error) {
        console.error(error);
      }
    };
    fetchOrder();
  }, [id]);

  if (!order) return <p>Carregando...</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Pedido {order._id}</h2>
      <p><strong>Status Pagamento:</strong> {order.status}</p>
      <p><strong>Status Entrega:</strong> {order.deliveryStatus}</p>
      <p><strong>Total:</strong> Kz {order.totalAmount}</p>
      <h3 className="font-bold mt-4">Itens</h3>
      <ul className="list-disc ml-5">
        {order.items.map((i, idx) => (
          <li key={idx}>
            Produto: {i.productId} | Qtd: {i.quantity} | Preço: {i.price}
          </li>
        ))}
      </ul>
      <h3 className="font-bold mt-4">Endereço</h3>
      <p>{order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.country} - {order.shippingAddress.zip}</p>
    </div>
  );
}
