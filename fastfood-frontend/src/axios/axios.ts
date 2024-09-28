import axios from "axios";
export const IP_ADDR = "3.83.41.46"
const axiosInstance = axios.create({
  baseURL: `http://${IP_ADDR}/api`,
})
export default axiosInstance;