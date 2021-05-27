import request from "@/utils/request.js";

//获取评论列表
export const getComment = (params) => {
  return request({
    method: "GET",
    url: "/mp/v1_0/articles",
    params,
  });
};

//修改文章状态
export const updateComment = (params, data) => {
  return request({
    method: "PUT",
    url: "/mp/v1_0/comments/status",
    params,
    data,
  });
};
