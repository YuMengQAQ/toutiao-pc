<template>
  <div class="article-container">
    <el-card class="filter-card">
      <div slot="header" class="clearfix">
        <!-- 面包屑导航 -->
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item><a href="/">内容管理</a></el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <!-- 数据筛选 -->
      <el-form ref="form" :model="form" label-width="40px" size="mini">
        <el-form-item label="状态">
          <el-radio-group v-model="status">
            <el-radio :label="null">全部</el-radio>
            <el-radio :label="0">草稿</el-radio>
            <el-radio :label="1">待审核</el-radio>
            <el-radio :label="2">审核通过</el-radio>
            <el-radio :label="3">审核失败</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="频道">
          <el-select v-model="channelId" placeholder="请选择频道">
            <el-option label="全部" :value="null"></el-option>
            <el-option
              :label="channel.name"
              :value="channel.id"
              v-for="channel in channelList"
              :key="channel.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="日期">
          <el-date-picker
            v-model="rangeDate"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            unlink-panels
            :picker-options="pickerOptions"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="loadArticle()">查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="table-card">
      <div slot="header" class="clearfix">
        <span>根据筛选条件共查询到{{ articleList.total_count }}条结果：</span>
      </div>
      <!-- 数据列表 -->
      <el-table
        :data="tableData"
        style="width: 100%"
        stripe
        size="mini"
        v-loading="tableLoading"
      >
        <el-table-column label="封面">
          <template slot-scope="scope">
            <el-image
              style="width: 50px; height: 50px"
              :src="scope.row.cover.images[0]"
              fit="cover"
              lazy
            >
              <div slot="placeholder" class="image-slot">
                加载中<span class="dot">...</span>
              </div>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="标题"> </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-tag :type="articleStatus[scope.row.status].type">{{
              articleStatus[scope.row.status].text
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="pubdate" label="发布时间"> </el-table-column>
        <el-table-column prop="address" label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              circle
              @click="$router.push('/publish?id=' + scope.row.id.toString())"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              circle
              @click="onDelete(scope.row.id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 分页器 -->
    <el-pagination
      layout="prev, pager, next"
      :total="totalCount"
      background
      @current-change="loadArticle"
      :page-size="pageSize"
      :disabled="tableLoading"
      :current-page="page"
    />
  </div>
</template>

<script>
import { getArticle, getChannel, deleteArticle } from "@/api/article.js";
export default {
  name: "articleIndex",
  components: {},
  props: {},
  data() {
    return {
      form: {},
      tableData: [],
      //文章详情
      articleList: [],
      //文章状态码数据优化处理
      articleStatus: [
        { type: "", text: "草稿", status: "0" },
        { type: "warning", text: "待审核", status: "1" },
        { type: "success", text: "审核通过", status: "2" },
        { type: "danger", text: "审核失败", status: "3" },
        { type: "info", text: "已删除", status: "4" },
      ],
      //文章总页数
      totalCount: 0,
      //文章每页条数
      pageSize: 20,
      //文章的状态
      status: null,
      //频道列表
      channelList: [],
      //频道Id
      channelId: null,
      //日期时间
      rangeDate: null,
      //日期快捷键数据
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
      //表格加载状态
      tableLoading: false,
      //当前页码
      page: 1,
    };
  },
  watch: {},
  computed: {},
  methods: {
    onSearch() {
      this.loadArticle();
    },
    async loadArticle(page = 1) {
      this.tableLoading = true;
      const { data: res } = await getArticle({
        page,
        per_page: this.pageSize,
        status: this.status,
        channel_id: this.channelId,
        begin_pubdate: this.rangeDate ? this.rangeDate[0] : null,
        end_pubdate: this.rangeDate ? this.rangeDate[1] : null,
      });
      this.articleList = res.data;
      this.tableData = res.data.results;
      this.totalCount = res.data.total_count - 50;
      this.tableLoading = false;
    },
    async loadChannel() {
      const { data: res } = await getChannel();
      this.channelList = res.data.channels;
    },
    //删除文章
    onDelete(articleId) {
      this.$confirm("此操作将永久删除该文章, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          //删除文章
          await deleteArticle(articleId.toString());
          this.$message({
            type: "success",
            message: "删除成功!",
          });
          this.loadArticle(this.page);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
  created() {
    this.loadArticle();
    this.loadChannel();
  },
  mounted() {},
};
</script>
<style lang="less" scoped>
.article-container {
  .filter-card {
    margin-bottom: 30px;
  }
  .table-card {
    margin-bottom: 20px;
  }
}
</style>
