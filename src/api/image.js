import request from "@/utils/request.js";
// 素材管理模块

//上传用户图片素材
export const getImgUrl = (data) => {
  return request({
    method: "POST",
    url: "/mp/v1_0/user/images",
    data,
  });
};

//获取图片素材信息
export const getImgInfo = (params) => {
  return request({
    method: "GET",
    url: "/mp/v1_0/user/images",
    params,
  });
};

//收藏图片素材信息
export const collectImg = (target, data) => {
  return request({
    method: "PUT",
    url: `/mp/v1_0/user/images/${target}`,
    data,
  });
};

//删除图片信息
export const deleteImg = (target) => {
  return request({
    method: "DELETE",
    url: `/mp/v1_0/user/images/${target}`,
  });
};
