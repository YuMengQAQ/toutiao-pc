<template>
  <div class="baidu-map-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span class="container-title">成都市天气</span>
      </div>
      <!-- 天气地图相关 -->
      <div id="container" ref="container"></div>
      <div class="info">
        <h4>预报天气</h4>
        <hr />
        <p id="forecast"></p>
      </div>
    </el-card>
  </div>
</template>
<script>
export default {
  name: "baiduMapIndex",
  components: {},
  props: {},
  data() {
    return {};
  },
  watch: {},
  computed: {},
  methods: {
    //天气预报相关逻辑
    loadWeather() {
      var map = new AMap.Map("container", {
        resizeEnable: true,
        //经纬度
        center: [104.065735, 30.659462],
        zoom: 12,
      });
      AMap.plugin("AMap.Weather", function() {
        var weather = new AMap.Weather();
        //查询实时天气信息, 查询的城市到行政级别的城市，如朝阳区、杭州市
        weather.getLive("成都市", function(err, data) {
          if (!err) {
            var str = [];
            str.push("<h4 >实时天气" + "</h4><hr>");
            str.push("<p>城市/区：" + data.city + "</p>");
            str.push("<p>天气：" + data.weather + "</p>");
            str.push("<p>温度：" + data.temperature + "℃</p>");
            str.push("<p>风向：" + data.windDirection + "</p>");
            str.push("<p>风力：" + data.windPower + " 级</p>");
            str.push("<p>空气湿度：" + data.humidity + "</p>");
            str.push("<p>发布时间：" + data.reportTime + "</p>");
            var marker = new AMap.Marker({
              map: map,
              position: map.getCenter(),
            });
            var infoWin = new AMap.InfoWindow({
              content:
                '<div class="info" style="position:inherit;margin-bottom:0;">' +
                str.join("") +
                '</div><div class="sharp"></div>',
              isCustom: true,
              offset: new AMap.Pixel(0, -37),
            });
            infoWin.open(map, marker.getPosition());
            marker.on("mouseover", function() {
              infoWin.open(map, marker.getPosition());
            });
          }
        });
        //未来4天天气预报
        weather.getForecast("成都市", function(err, data) {
          if (err) {
            return;
          }
          var str = [];
          for (var i = 0, dayWeather; i < data.forecasts.length; i++) {
            dayWeather = data.forecasts[i];
            str.push(
              dayWeather.date +
                ' <span class="weather">' +
                dayWeather.dayWeather +
                "</span> " +
                dayWeather.nightTemp +
                "~" +
                dayWeather.dayTemp +
                "℃"
            );
          }
          document.getElementById("forecast").innerHTML = str.join("<br>");
        });
      });
    },
  },
  created() {},
  mounted() {
    this.loadWeather();
  },
};
</script>
<style lang="less" scoped>
.baidu-map-container {
  font-size: 12px;
}
#container {
  // width: 1000px;
  height: 700px;
}
.weather {
  width: 5rem;
  display: inline-block;
  padding-left: 0.5rem;
}
.sharp {
  height: 1rem;
  width: 1rem;
  background-color: white;
  transform: rotateZ(45deg);
  box-shadow: 2px 2px 3px rgba(114, 124, 245, 0.5);
  position: inherit;
  margin-left: 10.5rem;
  margin-top: -6px;
}
.info {
  top: 13.5rem;
  right: 3.5rem;
}

.container-title {
  font-size: 16px;
}
</style>
