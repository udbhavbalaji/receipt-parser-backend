import axios2, { AxiosInstance } from "axios";
import { secrets } from "../../src/constants";

const axios: AxiosInstance = axios2.create({
  baseURL: "http://localhost:3000/api/auth",
  validateStatus: (status) => true,
});

export default axios;
