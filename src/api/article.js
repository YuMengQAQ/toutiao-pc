import request from "@/utils/request";
// 文章相关管理模块

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

// 删除文章
export const deleteArticle = (target) => {
  return request({
    method: "DELETE",
    url: `/mp/v1_0/articles/${target}`,
  });
};

// 发表文章
export const publishArticle = (data, draft = false) => {
  return request({
    method: "POST",
    url: "/mp/v1_0/articles",
    params: {
      draft, //是否存为草稿（true 为草稿）
    },
    data,
  });
};

//获取指定文章
export const getAssignArticle = (target) => {
  return request({
    method: "GET",
    url: `/mp/v1_0/articles/${target}`,
  });
};

//修改指定文章
export const updateAssignArticle = (target, data, draft = false) => {
  return request({
    method: "PUT",
    url: `/mp/v1_0/articles/${target}`,
    params: {
      draft,
    },
    data,
  });
};
