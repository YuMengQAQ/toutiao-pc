<template>
  <el-container class="layout-container">
    <!-- 侧边栏 -->
    <el-aside class="aside" :width="isCollapse ? 'auto' : '300px'">
      <Aside class="aside-menu" :isCollapse="isCollapse"></Aside>
    </el-aside>
    <el-container>
      <!-- 主体头部 -->
      <el-header class="header">
        <!-- 左侧折叠按钮 -->
        <div class="left-wrap">
          <i
            :class="isCollapse ? 'el-icon-s-fold' : 'el-icon-s-unfold'"
            @click="isCollapse = !isCollapse"
          ></i>
          <span>{{
            isCollapse ? "点击左侧按钮展开" : "点击左侧图标收起"
          }}</span>
        </div>
        <!-- 右侧下拉菜单 -->
        <el-dropdown>
          <div class="avatar">
            <img :src="user.photo" alt="" />
            <span>{{ user.name }}</span>
            <i class="el-icon-arrow-down el-icon--right"></i>
          </div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="$router.push('/settings')"
              >设置</el-dropdown-item
            >
            <el-dropdown-item @click.native="onloginOut">退出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-header>
      <el-main class="main">
        <!-- 路由出口 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import Aside from "./components/aside.vue";
import { getUserInfo } from "@/api/user.js";
import { setItem } from "@/utils/storage.js";
import globalBus from "@/utils/global-bus";
export default {
  name: "layoutIndex",
  components: { Aside },
  props: {},
  data() {
    return {
      user: {}, //用户数据
      isCollapse: false, //控制菜单折叠状态
    };
  },
  watch: {},
  computed: {},
  methods: {
    //获取用户信息
    async getUserInfo() {
      const { data: res } = await getUserInfo();
      this.user = res.data;
    },
    //退出
    onloginOut() {
      this.$confirm("确认退出吗", "登出提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$router.replace({
            name: "login",
          });
          setItem("user", null);
          this.$message({
            type: "success",
            message: "退出成功!",
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作",
          });
        });
    },
  },
  created() {
    this.getUserInfo();
  },
  mounted() {
    //更新名字
    globalBus.$on("updateName", (name) => {
      this.user.name = name;
    });
    //更新图片
    globalBus.$on("updateImg", (img) => {
      this.user.photo = img;
    });
  },
};
</script>
<style lang="less" scoped>
.layout-container {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  .aside {
    background-color: #444b52;
    .aside-menu {
      height: 100%;
    }
  }
  .header {
    background-color: #b3c0d1;
    height: 60px;
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .avatar {
      display: flex;
      align-items: center;
      img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        margin-right: 10px;
      }
    }
  }
  .main {
    background-color: #e9eef3;
  }
}
</style>
