import axios from "axios";
import queryString from "query-string";
import RootAPI from "./RootAPI";

const axiosClient = axios.create({
  baseURL: RootAPI,
  withCredentials: "include",
  headers: {
    "content-type": "application/json",
  },
  paramsSerializer: (params) => queryString.stringify(params),
});

axiosClient.interceptors.request.use(async (config) => {
  const token = localStorage.getItem("token");
  // console.log("Token truoc khi gui request:", token);
  if (token) config.headers["Authorization"] = `Bearer ${token}`;

  return config;
});

axiosClient.interceptors.response.use(
  (response) => {
    if (response && response.data) {
      return response.data;
    }
    return response;
  },
  (error) => {
    // Handle errors
    if (error.response.data.status) {
      // Xử lý lỗi từ phản hồi HTTP
      console.error("HTTP error:", error.response.status);
      throw error;
    } else if (error.request) {
      // Xử lý lỗi không nhận được phản hồi từ server
      console.error("No response received from server");
    } else {
      // Xử lý lỗi trong quá trình thiết lập yêu cầu
      console.error("Error setting up the request:", error.message);
    }

    // Truyền lỗi để có thể xử lý nó ở các thành phần khác
    // return Promise.reject(error);
  }
);
export default axiosClient;
