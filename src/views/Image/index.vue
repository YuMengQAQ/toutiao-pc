<template>
  <div class="img-container">
    <el-card>
      <div slot="header" class="clearfix">
        <!-- 面包屑导航 -->
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item><a href="/">素材管理</a></el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <image-list></image-list>
    </el-card>
  </div>
</template>

<script>
import ImageList from "./components/image-list.vue";

export default {
  name: "imageIndex",
  components: { ImageList },
  props: {},
  data() {
    return {};
  },
};
</script>
<style lang="less" scoped></style>
