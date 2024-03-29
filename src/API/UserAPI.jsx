import axiosClient from "./axiosClient";

const UserAPI = {
  getAllData: () => {
    const url = "/users";
    return axiosClient.get(url);
  },

  getLogout: () => {
    const url = "/users/logout";
    return axiosClient.get(url);
  },

  getDetailData: (id) => {
    const url = `/users/detail/${id}`;
    return axiosClient.get(url);
  },

  postSignUp: (query) => {
    const url = `/users/signup/${query}`;
    return axiosClient.post(url);
  },
  postLogin: (query) => {
    const url = `/users/login/${query}`;
    return axiosClient.post(url);
  },
};

export default UserAPI;
