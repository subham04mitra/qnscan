import { getToken, storeToken, clearToken } from "../utils/jwtUtils";
import { toast } from "react-toastify";

const API_BASE = "https://exam-omr.onrender.com/api/auth"; //PORD
// const API_BASE = "http://localhost:8080/api/auth"; //local

// 🔹 Common error handler for 408
async function handleResponse(res) {
  if (res.status === 408) {
    clearToken();
    toast.error("Session expired, please login again");
    window.location.href = "/login"; // redirect to login page
    return;
  }
  return res.json();
}

export async function loginApi(uuid, user_pwd) {
  const res = await fetch(`${API_BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ uuid, user_pwd }),
  });
  return handleResponse(res);
}

export async function refreshTokenApi() {
  const token = getToken();
  const res = await fetch(`${API_BASE}/refresh`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await handleResponse(res);
  if (data?.token) {
    storeToken(data.token);
  }
  return data;
}

export async function logoutApi() {
  const token = getToken();
  const res = await fetch(`${API_BASE}/logout`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(res);
}
