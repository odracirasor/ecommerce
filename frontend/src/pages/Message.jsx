import React from "react";
import { useParams } from "react-router-dom";

const Message = () => {
  const { sellerId } = useParams();

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Conversar com {decodeURIComponent(sellerId)}</h1>
      <p className="text-gray-600">
        Esta é uma área reservada para o sistema de mensagens entre compradores e vendedores.
      </p>
      <p className="text-gray-500 text-sm mt-2">
        Em breve, você poderá trocar mensagens em tempo real com o vendedor aqui.
      </p>
    </div>
  );
};

export default Message;
