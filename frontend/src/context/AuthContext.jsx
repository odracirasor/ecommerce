import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("userInfo");

    if (stored) {
      const userInfo = JSON.parse(stored);
      setCurrentUser({
        email: userInfo.email,
        isAdmin: userInfo.isAdmin,
        _id: userInfo._id,
        username: userInfo.username,
        token: userInfo.token,
      });
    }
  }, []);

  const login = ({ email, token, isAdmin, _id, username }) => {
    const userInfo = { email, token, isAdmin, _id, username };
    localStorage.setItem("userInfo", JSON.stringify(userInfo));
    setCurrentUser({ ...userInfo });
  };

  const logout = () => {
    localStorage.removeItem("userInfo");
    setCurrentUser(null);
  };

  const refreshToken = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/refresh", {
        method: "POST",
        credentials: "include", // Envia o refresh token como cookie
      });

      if (!res.ok) throw new Error("Falha ao renovar token");

      const data = await res.json();
      if (!data.token) throw new Error("Token ausente na resposta");

      const updatedUser = {
        ...currentUser,
        token: data.token,
      };

      setCurrentUser(updatedUser);
      localStorage.setItem("userInfo", JSON.stringify(updatedUser));

      return data.token;
    } catch (err) {
      logout();
      throw err;
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, refreshToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
