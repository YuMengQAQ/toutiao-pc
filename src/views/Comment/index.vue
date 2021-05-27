<template>
  <div class="comment-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <!-- 面包屑导航 -->
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item><a href="/">评论管理</a></el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <!-- 评论渲染列表 -->
      <el-table
        :data="commentList"
        style="width: 100%"
        stripe
        class="table-list"
        v-loading="loading"
      >
        <el-table-column prop="title" label="标题"> </el-table-column>
        <el-table-column prop="total_comment_count" label="总评论数">
        </el-table-column>
        <el-table-column prop="fans_comment_count" label="粉丝评论数">
        </el-table-column>
        <el-table-column prop="address" label="评论状态">
          <template slot-scope="scope">
            {{ scope.row.comment_status ? "正常" : "关闭" }}
          </template>
        </el-table-column>
        <el-table-column prop="address" label="操作">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.comment_status"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :disabled="scope.row.statusLoading"
              @change="onStatusChange(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :page-sizes="[10, 15, 20, 30]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount"
        :disabled="loading"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import { getComment, updateComment } from "@/api/comment";
export default {
  name: "commentIndex",
  components: {},
  props: {},
  data() {
    return {
      tableData: [
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄",
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1519 弄",
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄",
        },
      ],
      commentList: [], //评论列表
      currentPage: 1, //当前点击页码
      totalCount: 0, //总条数
      pageSize: 10, //每页条数
      loading: false,
    };
  },
  watch: {},
  computed: {},
  methods: {
    async loadComment(page = 1) {
      //防止数据紊乱
      this.currentPage = page;
      //开启加载状态
      this.loading = true;
      const { data: res } = await getComment({
        page,
        per_page: this.pageSize,
        response_type: "comment",
      });
      this.totalCount = res.data.total_count;
      const results = res.data.results;
      results.forEach((result) => {
        result.statusLoading = false;
      });
      this.commentList = results;
      this.loading = false;
    },
    async onStatusChange(scope) {
      scope.statusLoading = true;
      await updateComment(
        { article_id: scope.id.toString() },
        { allow_comment: scope.comment_status }
      );
      this.$message({
        message: scope.comment_status ? "开启成功" : "关闭成功",
        type: "success",
      });
      scope.statusLoading = false;
    },
    //根据每页大小进行分页
    handleSizeChange(val) {
      this.pageSize = val;
      this.loadComment();
    },
    //分页
    handleCurrentChange(page) {
      this.loadComment(page);
    },
  },
  created() {
    this.loadComment();
  },
  mounted() {},
};
</script>
<style lang="less" scoped>
.comment-container {
  .table-list {
    margin-bottom: 20px;
  }
}
</style>
