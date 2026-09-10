import axios from 'axios'
import type { User } from './types/types';
import type { LoginUser } from './types/auth';
import type { TodoInput } from '../frontend/types/types';

const api = axios.create({
  baseURL: `${(import.meta as ImportMeta & { env: { VITE_API_BASE_URL: string } }).env.VITE_API_BASE_URL}`,
  withCredentials: true
})

const AUTH_SESSION_KEY = "todoapp-authenticated";

const hasAuthSession = () =>
  localStorage.getItem(AUTH_SESSION_KEY) === "true";

export const setAuthSession = () => {
  localStorage.setItem(AUTH_SESSION_KEY, "true");
};

export const clearAuthSession = () => {
  localStorage.removeItem(AUTH_SESSION_KEY);
};

export const createUser = async (userData: User) => {
  const response = await api.post("/register", userData);
  return response.data;
};

export const loginUser = async (userInfo: LoginUser) => {
  const response = await api.post("/login", userInfo);
  return response.data;
};

export const getCurrentUser = async () => {
  if (!hasAuthSession()) {
    return null;
  }

  try {
    const response = await api.get("/me");
    return response.data;
  } catch (error) {
    if (!axios.isAxiosError(error) || error.response?.status !== 401) {
      throw error;
    }

    try {
      await api.get("/refresh");
      const response = await api.get("/me");
      return response.data;
    } catch {
      clearAuthSession();
      return null;
    }
  }
};

export const logout = async () => {
  const response = await api.post("/logout");
  return response.data;
};

export const getTodos = async () => {
  const response = await api.get(`/todos/me`);
  return response.data;
};

export const createTodo = async (todo: TodoInput) => {
  const response = await api.post("/create-todos", todo);
  return response.data;
};

export const updateTodo = async ({ id, todo }: { id: number; todo: TodoInput }) => {
  const response = await api.put(`/update-Item/${id}`, todo);
  return response.data;
};

export const deleteTodo = async (todoId: number) => {
  const response = await api.delete(`/delete-Item/${todoId}`);
  return response.data;
};