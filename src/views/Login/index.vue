<template>
  <div class="login-container">
    <el-form :model="user" class="login-form" ref="userRef" :rules="userRule">
      <el-form-item prop="mobile">
        <el-input
          v-model="user.mobile"
          placeholder="请输入手机号"
          prefix-icon="el-icon-phone"
        ></el-input>
      </el-form-item>
      <el-form-item prop="code">
        <el-input
          v-model="user.code"
          placeholder="请输入验证码"
          prefix-icon="el-icon-more"
        ></el-input>
      </el-form-item>
      <el-form-item prop="agree">
        <el-checkbox v-model="user.agree"
          >我已阅读并同意用户协议和隐私条款</el-checkbox
        >
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="onLogin"
          class="login-btn"
          :loading="loginLoading"
          >登录</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { login } from "@/api/user.js";
import { setItem } from "@/utils/storage.js";
export default {
  name: "loginIndex",
  components: {},
  props: {},
  data() {
    return {
      user: {
        mobile: "13911111111",
        code: "246810",
        agree: false,
      },
      loginLoading: false,
      userRule: {
        mobile: [
          { required: true, message: "请输入手机号", trigger: "change" },
          {
            pattern: /^1[3|5|7|8|9]\d{9}$/,
            message: "请输入正确的号码格式",
            trigger: "change",
          },
        ],
        code: [
          { required: true, message: "验证码不能为空", trigger: "change" },
          { pattern: /^\d{6}$/, message: "请输入正确的验证码格式" },
        ],
        agree: [
          {
            //自定义验证规则
            validator: (rule, value, callback) => {
              if (value) {
                callback();
              } else {
                callback(new Error("请勾选用户协议"));
              }
            },
            trigger: "change",
          },
        ],
      },
    };
  },
  watch: {},
  computed: {},
  methods: {
    onLogin() {
      //表单验证
      this.$refs["userRef"].validate((valid) => {
        if (!valid) {
          return;
        }
        this.login();
      });
    },
    //发送登录请求
    async login() {
      //设置Loading状态
      this.loginLoading = true;
      //登录请求
      try {
        const { data: res } = await login(this.user);
        this.$message({
          message: "登录成功",
          type: "success",
        });
        setItem("user", res.data);
        this.$router.push({
          name: "home",
        });
      } catch (error) {
        this.$message.error("手机号或者验证码输入错误");
      }
      this.loginLoading = false;
    },
  },
  created() {},
  mounted() {},
};
</script>
<style lang="less" scoped>
.login-container {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: url("./login_bg.jpg") no-repeat;
  background-size: cover;
  .login-form {
    padding: 50px;
    background-color: #fff;
    min-width: 300px;
    .login-btn {
      width: 100%;
    }
  }
}
</style>
