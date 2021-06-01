<template>
  <div class="fans-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <!-- 面包屑导航 -->
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item><a href="/">粉丝管理</a></el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <!-- 粉丝管理和粉丝统计 -->
      <div class="nav-bar-btn">
        <el-radio-group v-model="collect" @change="onCurrentChange">
          <el-radio-button :label="false">粉丝管理</el-radio-button>
          <el-radio-button :label="true">粉丝统计</el-radio-button>
        </el-radio-group>
      </div>
      <!-- 粉丝统计组件 -->
      <div class="fans-info" v-if="collect">
        <fans-info></fans-info>
      </div>
      <!-- 粉丝列表 -->
      <div class="fans-list" v-else>
        <el-row :gutter="10">
          <el-col
            :sm="12"
            :md="6"
            :lg="3"
            v-for="(fan, index) in fansList"
            :key="index"
            class="fans-item"
          >
            <!-- 头像组件 -->
            <el-avatar
              :size="100"
              :src="fan.photo"
              fit="cover"
              class="fans-avatar"
            ></el-avatar>
            <div class="fans-title">{{ fan.name }}</div>
            <el-button type="primary" class="collect-btn" size="mini"
              >+ 关注</el-button
            >
          </el-col>
        </el-row>
        <!-- 分页器 -->
        <el-pagination
          layout="prev, pager, next"
          :total="totalCount"
          :page-size="pageSize"
          background
          @current-change="onPageChange"
        >
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getFansList, getFansData } from "@/api/fans.js";
import FansInfo from "./components/fans-info.vue";
export default {
  name: "fansIndex",
  components: { FansInfo },
  props: {},

  data() {
    return {
      collect: false,
      pageSize: 20, //每页的条数,
      fansList: [], //粉丝列表
      totalCount: 1,
    };
  },
  watch: {},
  computed: {},
  methods: {
    //粉丝管理和粉丝统计切换
    async onCurrentChange() {
      if (this.collect) {
        //发送粉丝统计数据
        // const { data: res } = await getFansData();
        // console.log(res);
        return;
      }
      //发送粉丝管理数据
      await this.loadFansList();
    },
    async loadFansList(page = 1) {
      const { data: res } = await getFansList({
        page,
        per_page: this.pageSize,
      });
      this.fansList = res.data.results;
      this.totalCount = res.data.total_count;
    },
    //点击页码跳转
    onPageChange(page) {
      this.loadFansList(page);
    },
  },
  created() {
    this.loadFansList();
  },
  mounted() {},
};
</script>
<style lang="less" scoped>
.fans-container {
  .fans-list {
    padding-top: 20px;
    .fans-item {
      .fans-avatar {
        padding-left: 15px;
      }
      .fans-title {
        font-size: 14px;
        padding-left: 25px;
        // text-align: center;
      }
      .collect-btn {
        margin: 15px 0 20px 20px;
      }
    }
  }
  .fans-info {
    padding-top: 20px;
  }
}
</style>
