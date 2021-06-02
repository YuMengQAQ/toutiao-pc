/**
 * Vue CLI 的配置文件
 * 这里可以自定义 VueCLI 内部的 webpack 配置
 */

// 该配置文件必须导出一个对象（Node 中的模块语法）
module.exports = {
  // 自定义 VueCLI 中的 webpack 配置
  configureWebpack: {
    // 告诉 webpack 使用 script 标签加载的那个资源，而不是去 node_moudles 中打包处理
    externals: {
      // 属性名：你加载的那个包名
      // 属性值：script 标签暴露的全局变量，注意，写到字符串中！！！
      // 'element-ui': 'ELEMENT'
      'vue': "Vue",
      "element-ui": "ELEMENT",
      'echarts': "echarts",
    },
  },
};
