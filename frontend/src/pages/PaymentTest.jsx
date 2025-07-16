import React, { useState } from "react";

const PaymentTest = () => {
  const [orderStatus, setOrderStatus] = useState("paid");

  const totalAmount = 10000; // em Kz
  const commission = totalAmount * 0.05;
  const sellerAmount = totalAmount - commission;

  const handleConfirmDelivery = () => {
    setOrderStatus("released");
  };

  return (
    <div className="p-6 max-w-xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">🧾 Simulação de Pagamento</h1>

      <p>Status da ordem: <strong>{orderStatus === "paid" ? "Pago (Aguardando entrega)" : "Pagamento Liberado ao Vendedor"}</strong></p>

      <div className="border rounded p-4 space-y-2 shadow">
        <p><strong>💰 Valor Total:</strong> Kz {totalAmount.toLocaleString()}</p>
        <p><strong>📉 Comissão da Plataforma (5%):</strong> Kz {commission.toLocaleString()}</p>
        <p><strong>📦 Vendedor receberá:</strong> Kz {sellerAmount.toLocaleString()}</p>
      </div>

      {orderStatus === "paid" && (
        <button
          onClick={handleConfirmDelivery}
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          ✅ Confirmar Recebimento
        </button>
      )}
    </div>
  );
};

export default PaymentTest;
