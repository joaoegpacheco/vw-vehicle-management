import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:1880",
});

export default API;
