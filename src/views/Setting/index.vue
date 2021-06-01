<template>
  <div class="setting-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <!-- 面包屑导航 -->
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item><a href="/">个人设置</a></el-breadcrumb-item>
        </el-breadcrumb>
      </div>

      <el-row>
        <!-- 表单 -->
        <el-col :span="15">
          <el-form
            ref="userForm"
            :model="user"
            label-width="80px"
            :rules="userRules"
          >
            <el-form-item label="编号">
              {{ user.id }}
            </el-form-item>
            <el-form-item label="手机">
              {{ user.mobile }}
            </el-form-item>
            <el-form-item label="媒体名称" prop="name">
              <el-input v-model="user.name"></el-input>
            </el-form-item>

            <el-form-item label="媒体介绍" prop="intro">
              <el-input type="textarea" v-model="user.intro"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="user.email"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit" :loading="saveLoading"
                >保存</el-button
              >
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="5" :offset="4" class="avatar">
          <!-- 头像区 -->
          <label for="file" class="avatar-wrap">
            <el-avatar :size="150" fit="cover" :src="user.photo"></el-avatar>
            <el-tag class="avatar-title">点击修改头像</el-tag>
          </label>
          <input
            type="file"
            hidden
            id="file"
            ref="imgInput"
            @change="onUploadChange"
          />
        </el-col>
      </el-row>
    </el-card>
    <!-- 弹出层 -->
    <el-dialog
      title="提示"
      :visible.sync="imgDialogVisible"
      append-to-body
      @opened="onOpen"
      @closed="onClose"
    >
      <!-- 图片预览 -->
      <div class="preview-wrap">
        <img :src="previewImage" alt="" class="preview-image" id="image" />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="imgDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="onSuccessSumbit"
          :loading="sucessLoading"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import "cropperjs/dist/cropper.css";
import Cropper from "cropperjs";
import { getUserInfo, updateUserPhoto, updateUserInfo } from "@/api/user.js";
import globalBus from "@/utils/global-bus";
export default {
  name: "settingIndex",
  components: {},
  props: {},
  data() {
    return {
      user: {}, //用户信息
      imgDialogVisible: false, //控制弹出层显示或隐藏
      previewImage: "", //图片预览地址
      cropper: null, //裁切器实例
      sucessLoading: false, //图片上传按钮加载状态
      saveLoading: false, //保存加载状态
      //表单验证规则
      userRules: {
        name: [
          { required: true, message: "请输入媒体名称", trigger: "blur" },
          { min: 1, max: 7, message: "长度在 1 到 7 个字符", trigger: "blur" },
        ],
        intro: [
          {
            required: true,
            message: "请输入媒体介绍",
            trigger: "blur",
          },
        ],
        email: [
          { required: true, message: "请输入邮箱地址", trigger: "blur" },
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"],
          },
        ],
      },
    };
  },
  watch: {},
  computed: {},
  methods: {
    //更改用户信息
    onSubmit() {
      this.$refs["userForm"].validate(async (valid) => {
        if (!valid) {
          return;
        }
        this.saveLoading = true;
        const data = {
          name: this.user.name,
          intro: this.user.intro,
          email: this.user.email,
        };
        const { data: res } = await updateUserInfo(data);
        this.$message({
          message: "保存成功",
          type: "success",
        });
        //保存数据到vuex中
        // this.userInfo.name = res.data.name;
        //存储名字
        globalBus.$emit("updateName", res.data.name);
        this.saveLoading = false;
      });
    },
    //加载用户信息
    async loadUserInfo() {
      const { data: res } = await getUserInfo();
      this.user = res.data;
    },
    //图片上传事件
    onUploadChange() {
      //处理图片预览
      const file = this.$refs["imgInput"];
      const blob = window.URL.createObjectURL(file.files[0]);
      this.previewImage = blob;
      //显示弹出框
      this.imgDialogVisible = true;
      //防止用户传相同图片
      this.$refs["imgInput"].value = "";
    },
    //dialog打开动画结束后的回调
    onOpen() {
      //初始化裁切器
      const image = document.getElementById("image");
      // if (this.cropper) {
      //   //替换裁切图片
      //   this.cropper.replace(this.previewImage);
      //   return;
      // }
      this.cropper = new Cropper(image, {
        viewMode: 1,
        dragMode: "move",
        aspectRatio: 1,
        cropBoxMovable: false,
        cropBoxResizable: false,
        background: false,
        movable: true,
      });
    },
    //dialog关闭动画结束后的回调
    onClose() {
      //销毁裁切器
      this.cropper.destroy();
    },
    //弹出框确定提交
    onSuccessSumbit() {
      //开启成功的加载状态
      this.sucessLoading = true;
      this.cropper.getCroppedCanvas().toBlob(async (file) => {
        const fd = new FormData();
        fd.append("photo", file);
        //发送请求
        await updateUserPhoto(fd);
        //关闭对话框
        this.imgDialogVisible = false;
        this.$message({
          message: "更新头像成功",
          type: "success",
        });
        //更改用户地址
        this.user.photo = window.URL.createObjectURL(file);
        //通过事件总线存储这个预览图片
        globalBus.$emit("updateImg", this.previewImage);
        //关闭加载状态
        this.sucessLoading = false;
      });
    },
  },
  created() {
    this.loadUserInfo();
  },
  mounted() {},
};
</script>
<style lang="less" scoped>
.setting-container {
  .avatar-wrap {
    position: relative;

    .avatar-title {
      position: absolute;
      bottom: -40px;
      left: 30px;
    }
  }
}
.preview-wrap {
  .preview-image {
    display: block;
    max-width: 100%;
    height: 200px;
  }
}
</style>
