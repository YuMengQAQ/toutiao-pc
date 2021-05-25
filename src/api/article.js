import request from "@/utils/request";
//获取文章列表
export const getArticle = (params) => {
  return request({
    method: "GET",
    url: "/mp/v1_0/articles",
    params,
  });
};

//获取文章频道
export const getChannel = () => {
  return request({
    method: "GET",
    url: "/mp/v1_0/channels",
  });
};
