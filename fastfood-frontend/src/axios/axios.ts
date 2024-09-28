import axios from "axios";
export const IP_ADDR = "184.73.81.97"
const axiosInstance = axios.create({
  baseURL: `http://${IP_ADDR}/api`,
})
export default axiosInstance;