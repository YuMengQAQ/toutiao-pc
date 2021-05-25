import axios from "axios";
import { getItem } from "@/utils/storage.js";

//封装请求模块
const request = axios.create({
  baseURL: "http://api-toutiao-web.itheima.net",
});

// 请求拦截器
request.interceptors.request.use(
  function(config) {
    // 在发送请求之前做些什么，例如加入token
    const user = getItem("user");
    if (user) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  function(error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 响应拦截器
request.interceptors.response.use(
  function(response) {
    // 在接收响应做些什么，例如跳转到登录页

    return response;
  },
  function(error) {
    // 对响应错误做点什么
    return Promise.reject(error);
  }
);
export default request;
