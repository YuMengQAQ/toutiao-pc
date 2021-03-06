import Vue from "vue";
import VueRouter from "vue-router";
import { getItem } from "@/utils/storage.js";
import { Message } from "element-ui";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    component: () => import("@/views/Layout/"),
    children: [
      {
        path: "",
        name: "home",
        component: () => import("@/views/Home/"),
      },
      {
        path: "/article",
        name: "article",
        component: () => import("@/views/Article/"),
      },
      {
        path: "/publish",
        name: "publish",
        component: () => import("@/views/Publish/"),
      },
      {
        path: "/image",
        name: "image",
        component: () => import("@/views/Image/"),
      },
      {
        path: "/comment",
        name: "comment",
        component: () => import("@/views/Comment/"),
      },
      {
        path: "/settings",
        name: "setting",
        component: () => import("@/views/Setting/"),
      },
      {
        path: "/fans",
        name: "fans",
        component: () => import("@/views/Fans/"),
      },
    ],
  },
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/Login/"),
  },
  {
    path: "*",
    component: () => import("@/views/Error/"),
  },
];

const router = new VueRouter({
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.path !== "/login") {
    const user = getItem("user");
    if (user) {
      next();
      return;
    }
    next("/login");
    Message({
      message: "请先登录哦，亲",
      type: "info",
    });
  } else {
    next();
  }
});

export default router;
