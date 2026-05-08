import api from "./api";

export const loginRequest = async (email, password) => {
  const res = await api.post("/auth/login", { email, password });
  return res.data;
};

export const saveToken = (token, email) => {
  localStorage.setItem("token", token);
  if (email) localStorage.setItem("userEmail", email);
};

export const logout = () => {
  localStorage.clear();
  window.location.href = "/login";
};

export const getToken = () => localStorage.getItem("token");

export const isAuthenticated = () => !!getToken();

// ESSA FUNÇÃO É VITAL PARA O DASHBOARD NÃO TRAVAR O LOGIN
export const getUserEmail = () => {
  return localStorage.getItem("userEmail") || "Usuário";
};