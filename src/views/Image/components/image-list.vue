<template>
  <div class="image-list-container">
    <!-- 全部和收藏按钮 -->
    <div class="nav-bar-btn">
      <el-radio-group v-model="collect" @change="onCurrentChange">
        <el-radio-button :label="false">全部</el-radio-button>
        <el-radio-button :label="true">收藏</el-radio-button>
      </el-radio-group>
      <el-button
        type="success"
        size="mini"
        @click="uploadDialogVisible = true"
        v-if="isShowAdd"
        >添加素材</el-button
      >
    </div>
    <!-- 素材列表 -->
    <div class="img-list">
      <el-row :gutter="10" v-loading="loading">
        <el-col
          :xs="12"
          :sm="6"
          :md="6"
          :lg="isShowRow"
          v-for="(image, index) in imageList"
          :key="index"
          class="img-col"
        >
          <el-image
            class="img-item"
            :src="image.url"
            fit="cover"
            style="width: 250px;height:130px"
            :previewSrcList="isShowPreview ? [] : [image.url]"
            @click.native="selected = index"
          >
          </el-image>
          <div
            class="selected"
            v-if="isShowSelected && selected === index"
          ></div>
          <!-- 图标层 -->
          <div class="icon-btn" v-if="isShowAction">
            <!-- 收藏按钮 -->
            <el-button
              :icon="
                image.is_collected ? 'el-icon-star-on' : 'el-icon-star-off'
              "
              @click="onCollect(image)"
              size="small"
              circle
              :loading="image.loading"
              type="warning"
            ></el-button>
            <!-- 删除按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              circle
              size="small"
              @click="onDelete(image)"
            ></el-button>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 上传图片弹出层 -->

    <el-dialog
      title="上传图片"
      :visible.sync="uploadDialogVisible"
      width="21%"
      append-to-body
    >
      <!-- 文件上传 -->
      <!-- action设置请求地址，name设置上传的字段名，设置上传的请求头部 -->
      <el-upload
        class="upload-demo"
        action="http://api-toutiao-web.itheima.net/mp/v1_0/user/images"
        :headers="upLoadHeader"
        name="image"
        drag
        :on-success="onUploadSuccess"
        multiple
        :show-file-list="false"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">
          只能上传jpg/png文件，且不超过500kb
        </div>
      </el-upload>
    </el-dialog>

    <!-- 分页 -->
    <el-pagination
      layout="prev, pager, next"
      :total="totalCount"
      :page-size="isShowPageSize"
      :current-page.sync="page"
      @current-change="onPageChange"
      :disabled="loading"
      background
      style="margin-bottom:20px"
    >
    </el-pagination>
    <el-alert title="点击头像勾选" type="warning" center v-if="isShowAlert">
    </el-alert>
  </div>
</template>

<script>
import { getImgInfo, collectImg, deleteImg } from "@/api/image.js";
import { getItem } from "@/utils/storage.js";

export default {
  name: "imageListIndex",
  components: {},
  props: {
    //控制收藏和删除按钮
    isShowAction: {
      type: Boolean,
      default: true,
    },
    //控制行
    isShowRow: {
      type: Number,
      default: 4,
    },
    //控制添加素材按钮
    isShowAdd: {
      type: Boolean,
      default: true,
    },
    //每页数量
    isShowPageSize: {
      type: Number,
      default: 18,
    },
    //控制大图预览
    isShowPreview: {
      type: [Array, Boolean],
      default: false,
    },
    //控制勾选图片显示
    isShowSelected: {
      type: Boolean,
      default: false,
    },
    //控制警告提醒
    isShowAlert: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    const user = getItem("user");
    return {
      collect: false,
      imageList: [],
      uploadDialogVisible: false, //上传图片对话框显示和隐藏
      //上传的请求头
      upLoadHeader: {
        Authorization: `Bearer ${user.token}`,
      },
      pageSize: 18, //每页数量
      totalCount: 0, //总页码数
      page: 1, //当前页码
      loading: false, //图片加载状态
      selected: null, //选中的图片索引
    };
  },
  watch: {},
  computed: {},
  methods: {
    async loadImg(page = 1) {
      //开启加载状态
      this.loading = true;
      //为了切换选项卡默认展示第一页
      this.page = page;
      const { data: res } = await getImgInfo({
        collect: this.collect,
        page,
        per_page: this.isShowPageSize,
      });
      const results = res.data.results;
      results.forEach((img) => {
        img.loading = false;
        img.deleteLoading = false;
      });
      this.totalCount = res.data.total_count;
      this.imageList = results;
      this.loading = false;
    },
    //按钮切换
    onCurrentChange() {
      this.loadImg();
    },
    //上传成功
    onUploadSuccess() {
      this.uploadDialogVisible = false;
      this.$message({
        message: "上传成功",
        type: "success",
      });
      this.loadImg();
    },
    //分页
    onPageChange(page) {
      this.loadImg(page);
      //分页的时候清空索引
      this.selected = null;
    },
    //收藏图片素材
    async onCollect(image) {
      //开启加载状态
      image.loading = true;
      //收藏取反
      await collectImg(image.id, { collect: !image.is_collected });
      //取消加载状态
      image.loading = false;
      if (image.is_collected) {
        this.$message({
          message: "取消收藏成功",
          type: "success",
        });
      } else {
        this.$message({
          message: "收藏成功",
          type: "success",
        });
      }
      //强制刷新视图
      this.$nextTick(() => {
        this.loadImg(this.page);
      });
    },
    //删除
    onDelete(image) {
      //提示框
      this.$confirm("此操作将永久删除该图片, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          image.deleteLoading = true;
          await deleteImg(image.id);
          image.deleteLoading = false;
          this.$message({
            message: "删除成功",
            type: "success",
          });
          //强制刷新视图
          this.$nextTick(() => {
            this.loadImg(this.page);
          });
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
    this.loadImg();
  },
  mounted() {},
};
</script>
<style lang="less" scoped>
.image-list-container {
  .nav-bar-btn {
    padding-bottom: 20px;
    display: flex;
    justify-content: space-between;
  }
  .img-list {
    margin-bottom: 20px;
    .img-col {
      position: relative;

      .img-item {
        padding-bottom: 20px;
      }
      .icon-btn {
        height: 40px;
        position: absolute;
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        font-size: 20px;
        bottom: 24px;
        left: 5px;
        right: 3px;
        background-color: rgba(204, 204, 204, 0.5);
      }
    }
  }
}
.selected {
  position: absolute;
  left: 50px;
  right: 0;
  top: 0;
  bottom: 0;
  width: 150px;
  height: 120px;
  background: url("./selected.png") no-repeat;
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
  // padding-left: 25px;
}
</style>
