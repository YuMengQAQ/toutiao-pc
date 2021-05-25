import request from "@/utils/request";
//用户请求相关模块

//登录验证
export const login = (data) => {
  return request({
    method: "POST",
    url: "/mp/v1_0/authorizations",
    data,
  });
};

//获取用户信息
export const getUserInfo = () => {
  return request({
    method: "GET",
    url: "/mp/v1_0/user/profile",
  });
};

//修改用户信息
