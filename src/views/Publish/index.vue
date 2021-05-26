<template>
  <div class="publish-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <!-- 面包屑导航 -->
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item
            ><a href="/">{{
              $route.query.id ? "修改文章" : "发布文章"
            }}</a></el-breadcrumb-item
          >
        </el-breadcrumb>
      </div>
      <el-form
        ref="publishForm"
        :model="article"
        label-width="60px"
        :rules="publishRules"
      >
        <el-form-item label="标题" prop="title">
          <el-input
            v-model="article.title"
            placeholder="请输入>=5个字，<=30个字的标题"
          ></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <!-- 富文本编辑器 -->
          <el-tiptap
            v-model="article.content"
            :extensions="extensions"
            lang="zh"
            height="400px"
            placeholder="请输入文章内容"
          />
        </el-form-item>
        <el-form-item label="封面">
          <el-radio-group v-model="article.cover.type">
            <el-radio :label="1">单面</el-radio>
            <el-radio :label="3">三面</el-radio>
            <el-radio :label="0">无图</el-radio>
            <el-radio :label="-1">自动</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="频道" prop="channel_id">
          <el-select v-model="article.channel_id" placeholder="请选择频道">
            <el-option
              :label="channel.name"
              :value="channel.id"
              v-for="channel in channelList"
              :key="channel.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onPublish(false)">{{
            $route.query.id ? "确定" : "发布"
          }}</el-button>
          <el-button @click="onPublish(true)">存入草稿</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import {
  getChannel,
  publishArticle,
  getAssignArticle,
  updateAssignArticle,
} from "@/api/article";
import {
  // 需要的 extensions
  ElementTiptap,
  Doc,
  Text,
  Paragraph,
  Heading,
  Bold,
  Underline,
  Italic,
  Strike,
  ListItem,
  BulletList,
  OrderedList,
  TodoItem,
  TodoList,
  Image,
  Fullscreen,
  HorizontalRule,
  Preview,
  TextColor,
} from "element-tiptap";
// import element-tiptap 样式
import "element-tiptap/lib/index.css";
import { getImgUrl } from "@/api/image.js";
export default {
  name: "publishIndex",
  components: {
    "el-tiptap": ElementTiptap,
  },
  props: {},
  data() {
    return {
      article: {
        title: "", //文章标题
        content: "", //文章内容
        cover: {
          type: 0, //封面类型-1:自动，0-无图，1-1张，3-3张
          images: [],
        },
        channel_id: null, //文章所属频道id
      },
      channelList: [], //频道列表
      // 编辑器的 extensions
      // 它们将会按照你声明的顺序被添加到菜单栏和气泡菜单中
      extensions: [
        new Doc(),
        new Text(),
        new Paragraph(),
        new Heading({ level: 5 }),
        new Bold({ bubble: true }), // 在气泡菜单中渲染菜单按钮
        new Underline({ bubble: true, menubar: false }), // 在气泡菜单而不在菜单栏中渲染菜单按钮
        new Italic(),
        new Image({
          async uploadRequest(file) {
            //将文件对象转为formdata
            let fd = new FormData();
            fd.append("image", file);
            //请求线上的url地址，最终返回
            const { data: res } = await getImgUrl(fd);
            return res.data.url;
          },
        }),
        new Strike(),
        new HorizontalRule(),
        new ListItem(),
        new BulletList(),
        new OrderedList(),
        new TodoItem(),
        new TodoList(),
        new Fullscreen(),
        new Preview(),
        new TextColor(),
      ],
      //表单验证对象
      publishRules: {
        title: [
          {
            required: true,
            message: "请输入文章标题",
            trigger: "blur",
          },
          {
            min: 5,
            max: 30,
            message: "长度在 5 到 30 个字符",
            trigger: "blur",
          },
        ],
        content: [
          {
            validator(rule, value, callback) {
              if (value === "<p></p>" || value === "") {
                callback(new Error("请输入文章内容"));
              } else {
                callback();
              }
            },
          },
        ],
        channel_id: [
          {
            required: true,
            message: "请选择文章频道",
          },
        ],
      },
    };
  },
  watch: {},
  computed: {},
  methods: {
    //发布文章或者修改文章，根据是否有route参数中的id来判断
    onPublish(draft) {
      this.$refs["publishForm"].validate(async (valid) => {
        if (!valid) {
          return;
        }
        const articleId = this.$route.query.id;
        if (articleId) {
          //修改文章的操作
          await updateAssignArticle(articleId, this.article, draft);
          this.$message({
            message: "修改成功",
            type: "success",
          });
          this.$router.push("/article");
        } else {
          await publishArticle(this.article, draft);
          this.$message({
            message: "发布成功",
            type: "success",
          });
          this.article.title = "";
          this.article.content = "";
          this.$router.push("/article");
        }
      });
    },
    //频道初始化加载
    async loadChannel() {
      const { data: res } = await getChannel();
      this.channelList = res.data.channels;
    },
    //获取指定文章的详情
    async loadAssignArticle() {
      const { data: res } = await getAssignArticle(this.$route.query.id);
      this.article = res.data;
    },
  },
  created() {
    this.loadChannel();
    if (this.$route.query.id) {
      this.loadAssignArticle();
    }
  },
  mounted() {},
};
</script>
<style lang="less" scoped></style>
