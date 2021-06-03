<template>
  <div class="error-container">
    <div class="img-wrapper">
      <img src="./404.jpg" alt="" />
    </div>
    <div class="btn-wrapper">
      <el-button class="back-btn" type="primary" @click="$router.push('/')"
        >点击返回首页</el-button
      >
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {},
  data() {
    return {};
  },
  watch: {},
  computed: {},
  methods: {},
  created() {},
  mounted() {},
};
</script>
<style lang="less" scoped>
.error-container {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background-color: #000000;
  height: 100%;
  .img-wrapper {
    display: flex;
    justify-content: center;
    img {
      max-width: 100%;
      // height: 100%;
      background-size: cover;
    }
  }
  .btn-wrapper {
    display: flex;
    justify-content: center;
    .back-btn {
      width: 33%;
      font-size: 16px;
    }
  }
}
</style>
