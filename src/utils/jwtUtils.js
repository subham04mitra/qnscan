// src/utils/jwtUtils.js
import { jwtDecode } from "jwt-decode";

export function storeToken(token) {
  localStorage.setItem("token", token);
}

export function getToken() {
  return localStorage.getItem("token");
}

export function clearToken() {
  localStorage.removeItem("token");
}

export function decodeToken(token) {
  try {
    return jwtDecode(token);
  } catch {
    return null;
  }
}
