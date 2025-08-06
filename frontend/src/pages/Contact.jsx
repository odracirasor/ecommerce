import React from "react";
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";

const Contact = () => (
  <div className="flex justify-center items-center min-h-[80vh] bg-gray-50 px-4">
    <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md text-center">
      <h1 className="text-3xl font-bold mb-4 text-blue-700">Fale Conosco</h1>
      <p className="text-gray-700 mb-6">Estamos aqui para ajudar com qualquer dúvida ou problema.</p>

      <div className="space-y-4 text-left text-gray-600">
        <div className="flex items-center gap-3">
          <FaEnvelope className="text-blue-600" />
          <span>Email: <strong>suporte@exemplo.com</strong></span>
        </div>
        <div className="flex items-center gap-3">
          <FaPhone className="text-blue-600" />
          <span>Telefone: <strong>+244 912 345 678</strong></span>
        </div>
        <div className="flex items-center gap-3">
          <FaMapMarkerAlt className="text-blue-600" />
          <span>Endereço: <strong>Luanda, Angola</strong></span>
        </div>
      </div>
    </div>
  </div>
);

export default Contact;
