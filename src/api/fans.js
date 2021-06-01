import request from "@/utils/request.js";
//粉丝相关模块

//获取粉丝列表
export const getFansList = (params) => {
  return request({
    method: "GET",
    url: "/mp/v1_0/followers",
    params,
  });
};

//获取粉丝统计数据
export const getFansData = (params) => {
  return request({
    method: "GET",
    url: "/mp/v1_0/statistics/followers",
    params,
  });
};
