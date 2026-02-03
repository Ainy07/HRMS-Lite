import axios from "axios";

export const api = axios.create({
  baseURL: "https://hrms-lite-production-fa7e.up.railway.app",
});