import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
});

// Adiciona o token em todas as requisições automaticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    // O prefixo 'Bearer ' é essencial para o middleware funcionar
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});
// Exemplo de função para adicionar ao seu serviço
export const updateAssignmentStatus = (id, data) => {
  return api.patch(`/assignments/${id}/status`, data);
};


export default api;