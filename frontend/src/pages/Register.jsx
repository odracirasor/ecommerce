import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validateField = (name, value) => {
    let error = "";
    if (!value.trim()) error = "Campo obrigatório";
    else if (name === "email" && !/\S+@\S+\.\S+/.test(value)) error = "Email inválido";
    else if (name === "password" && value.length < 6) error = "Mínimo 6 caracteres";
    else if (name === "confirmPassword" && value !== form.password) error = "Senhas não coincidem";
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    // Validação em tempo real
    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value),
    }));

    if (name === "confirmPassword" || name === "password") {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: validateField("confirmPassword", name === "confirmPassword" ? value : form.confirmPassword),
      }));
    }
  };

  const isFormValid = () => {
    const newErrors = {};
    Object.keys(form).forEach((field) => {
      newErrors[field] = validateField(field, form[field]);
    });
    setErrors(newErrors);
    return !Object.values(newErrors).some((err) => err);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid()) return;

    setLoading(true);
    try {
      await api.post("/register", form);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000); // animação de sucesso desaparece após 3s
    } catch {
      setErrors({ global: "Erro ao registrar. Tente novamente." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-8 relative overflow-hidden">
        {success && (
          <div className="absolute inset-0 flex items-center justify-center bg-green-100 animate-fade-in">
            <div className="bg-white rounded-full p-6 shadow-lg animate-bounce">
              <svg
                className="w-12 h-12 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        )}

        <h2 className="text-2xl font-bold text-center mb-6">Criar Conta</h2>

        {errors.global && <p className="text-center text-red-500 mb-4">{errors.global}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {["name", "username", "email"].map((field) => (
            <div key={field}>
              <input
                name={field}
                placeholder={field === "name" ? "Nome completo" : field === "username" ? "Nome de usuário" : "Email"}
                type={field === "email" ? "email" : "text"}
                value={form[field]}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                  errors[field] ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors[field] && <p className="text-red-500 text-sm mt-1">{errors[field]}</p>}
            </div>
          ))}

          <div className="relative">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Senha"
              value={form.password}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? "Ocultar" : "Mostrar"}
            </button>
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

          <div>
            <input
              name="confirmPassword"
              type="password"
              placeholder="Confirmar senha"
              value={form.confirmPassword}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                errors.confirmPassword ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Registrando..." : "Registrar"}
          </button>
        </form>

        <p className="text-center text-gray-600 text-sm mt-6">
          Já tem conta?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Faça login
          </Link>
        </p>
      </div>
    </div>
  );
}
