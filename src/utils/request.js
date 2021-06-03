import axios from "axios";
import { getItem } from "@/utils/storage.js";
import jsonBig from "json-bigint";
import router from "@/router";
import { removeItem } from "./storage";
import { Message } from "element-ui";
// 导入NProgress包对应的js和css
import NProgress from "nprogress";
import "nprogress/nprogress.css";

//封装请求模块
const request = axios.create({
  baseURL: "http://api-toutiao-web.itheima.net",
  transformResponse: [
    (data) => {
      try {
        return jsonBig.parse(data);
      } catch (error) {
        return data;
      }
    },
  ],
});

// 请求拦截器
request.interceptors.request.use(
  function(config) {
    // 在发送请求之前做些什么，例如加入token
    const user = getItem("user");
    if (user) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    //加入进度条
    NProgress.start();
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
    //关闭进度条
    NProgress.done();
    return response;
  },
  function(error) {
    // 对响应错误做点什么
    if (error.response && error.response.status === 401) {
      //清除本地伪造的user
      removeItem("user");
      //跳转到登录页
      router.push("/login");
      Message.error("登录状态无效，请重新登录");
    } else if (error.response.status === 403) {
      Message.error({
        type: "warning",
        message: "没有操作权限",
      });
    } else if (error.response.status === 400) {
      Message.error("请求参数错误");
    } else if (error.response.status >= 500) {
      Message.error("服务器内容错误，请稍后再试");
    }
    return Promise.reject(error);
  }
);
export default request;
