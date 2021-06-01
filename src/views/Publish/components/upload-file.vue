<template>
  <div class="upload-file-container">
    <!-- 选择框 -->
    <div class="upload-wrap" @click="onUploadWrap">
      <img
        :src="value ? value : publishImage"
        alt=""
        class="upload-img"
        ref="publish-cover"
      />
      <!-- 加号 -->
      <img src="./add.png" alt="" class="add-image" ref="addImage" />
    </div>
    <!-- 弹出层 -->
    <el-dialog
      title="选择图片"
      :visible.sync="uploadDialogVisible"
      append-to-body
      @opened="onOpen"
    >
      <el-tabs type="border-card" v-model="activeName">
        <el-tab-pane label="素材库" name="image">
          <!-- 素材库组件 -->
          <image-list
            :isShowAction="false"
            :isShowAdd="false"
            :isShowRow="6"
            :isShowPageSize="8"
            :isShowPreview="true"
            :isShowSelected="true"
            :isShowAlert="true"
            ref="imageList"
          ></image-list>
        </el-tab-pane>
        <el-tab-pane label="上传图片" class="cover-container" name="upload">
          <div class="cover-wrap" @click="$refs.uploadCover.click()">
            <div class="cover-wrap-border">
              <img ref="cover" alt="" class="cover-wrap-image" />
            </div>
            <el-tag class="cover-title">点击上传图片</el-tag>
          </div>
          <input type="file" hidden ref="uploadCover" @change="coverChange" />
        </el-tab-pane>
      </el-tabs>
      <span slot="footer" class="dialog-footer">
        <el-button @click="uploadDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onUploadCover">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getImgUrl } from "@/api/image.js";
import imageList from "@/views/Image/components/image-list.vue";
export default {
  name: "uploadFileIndex",
  components: { imageList },
  // props: ["coverImage"],
  props: ["value"],
  data() {
    return {
      uploadDialogVisible: false, //控制弹出层
      previewImage: "", //弹出框预览图片地址
      activeName: "image", //默认选项卡选中选项
      publishImage: "", //文件上传时的封面地址
    };
  },
  watch: {},
  computed: {},
  methods: {
    //点击选择框事件
    onUploadWrap() {
      this.uploadDialogVisible = true;
    },
    //input框上传文件
    coverChange() {
      const file = this.$refs["uploadCover"].files[0];
      const blob = window.URL.createObjectURL(file);
      //控制图片预览
      this.$refs["cover"].src = blob;
    },
    //确定提交文件
    async onUploadCover() {
      if (this.activeName === "upload") {
        const file = this.$refs.uploadCover.files[0];
        //上传图片
        if (!file) {
          this.$message("请选择图片");
          return;
        }
        const fd = new FormData();
        fd.append("image", file);
        //上传用户素材返回url
        const { data: res } = await getImgUrl(fd);
        this.publishImage = res.data.url;
        //关闭对话框
        this.uploadDialogVisible = false;
        this.$message({
          message: "上传图片成功",
          type: "success",
        });
        //向父组件传url
        // this.$emit("update-url", this.publishImage);
        this.$emit("input", this.publishImage);
        //隐藏加号元素
        this.$refs["addImage"].style = "display:none";
      } else if (this.activeName === "image") {
        //获取组件元素，通过refs方式
        const imageList = this.$refs["imageList"];
        const selected = imageList.selected;
        if (selected === null) {
          this.$message("请选择图片");
          return;
        }

        //关闭对话框
        this.uploadDialogVisible = false;
        //发送父组件图片地址
        this.$emit("input", imageList.imageList[selected].url);
        //隐藏加号元素
        this.$refs["addImage"].style = "display:none";
        //消息框
        this.$message({
          message: "上传图片成功",
          type: "success",
        });
      }
    },
    //对话框打开之后
    onOpen() {
      //src需要进行转码
      this.$refs["cover"].src =
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAACGCAIAAACwteQuAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAEXRFWHRTb2Z0d2FyZQBTbmlwYXN0ZV0Xzt0AAAIOSURBVHic7d2xalNRHMDhtOggWtopUIegixIER519CF/A93H3DXwEu7k7WUGKikuQCoEWpahYwTg5hoKVXL7k963ncPnD75w73OVuLRaLUWTbQw+Qyyohr4S8EvJKyCshr4S8EvJKyCshr4S8EvJKyCshr4S8EvJKyCshr4S8EvJKyCshr4S8EvJKyCshr4S8EvJKyCshr4S8EvJKyCshr4S8EvJKyCshr4S8EvJKyCshr4S8EvJKyCshr4S8EvJKyCshr4S8EvJKyCshb10Tnh8dPH928PHn0HOswLomPDue//g2n38deo4VWNeEG6SEvBLySsgrIa+EvBLySsi7MvQA/+r32ezdp9Nfy5a/n56PRqMv798cHS/bcnXv9t39Xf8Mb6l/EX374unLz5d8xuTRk8f3/ss0Q2ITXnQLP7w6nI32Hz64dWPZlnW5heyLdHtnMp1Oli6fnLw+nI327tyfjlc41CD8Q7jxSsgrIa+EvBLySsgrIa+EvHVNuHNzfO36eLw79BwrwH5gy1/regs3SAl5JeSVkFdCXgl5JeSVkFdCXgl5JeSVkFdCXgl5JeSVkFdCXgl5JeSVkFdCXgl5JeSVkFdCXgl5JeSVkFdCXgl5JeSVkFdCXgl5JeSVkFdCXgl5JeSVkFdCXgl5JeSVkFdCXgl5JeSVkFdCXgl5JeSVkFdCXgl5JeT9AZ52QCt/LHFUAAAAAElFTkSuQmCC";
    },
  },
  created() {},
  mounted() {
    //有id就隐藏元素
    if (this.$route.query.id) {
      //隐藏加号元素
      this.$refs["addImage"].style = "display:none";
    }
  },
};
</script>
<style lang="less" scoped>
.upload-file-container {
  .upload-wrap {
    width: 150px;
    height: 120px;
    border: 1px dotted #000;
    margin-right: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    .upload-img {
      height: 120px;
      max-width: 100%;
    }
  }
}
.cover-wrap-border {
  width: 150px;
  height: 120px;
  border: 1px dotted #000;
  margin-right: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  .cover-wrap-image {
    max-width: 100%;
    height: 100px;
  }
}
.cover-title {
  margin: 15px 0 0 25px;
}
.preview-image {
  max-width: 100%;
  height: 150px;
}
.cover-container {
  display: flex;
  justify-content: center;
}

.add-image {
  width: 100px;
  height: 100px;
}
</style>
