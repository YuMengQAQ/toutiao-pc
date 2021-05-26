import request from "@/utils/request.js";

//上传用户图片素材
export const getImgUrl = (data) => {
  return request({
    method: "POST",
    url: "/mp/v1_0/user/images",
    data,
  });
};
