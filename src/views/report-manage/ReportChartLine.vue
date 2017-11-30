<style lang="sass" scoped>
    $chart-normal: 220px;
    $chart-small: 120px;
    $chart-offset: 50px;

    .chart-wrap {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        .line {
          height: 450px;
        }
    }
</style>

<template>
    <div class="chart-wrap">
        <div ref="chartLine" style="width: 100%;" class="line"></div>
    </div>
</template>
<script>
import echarts from "echarts";

// 判断对象数据类型
function toType(obj) {
  let toString = Object.prototype.toString;
  return toString.call(obj);
}

export default {
  name: "ReportChartLine",
  props: {
    item: {
      type: Object,
      default: () => {}
    },
    size: {
        type: String,
        default: 'normal'
    }
  },
  computed: {
    // getPercent() {
    //   let item = this.item;
    //   if (!item || !item.total || !item.solve) return 0;
    //   let percent = item.solve / item.total * 100;
    //   return `${percent}%`;
    // }
  },
  mounted() {
    window.setTimeout(this.init, 1000);
  },
  updated() {
    window.setTimeout(this.init, 1000);
  },
  methods: {
    // 初始化Chart图表
    _initChart(chart, data) {
      // let complate = data && data.solve;
      // let uncomplate = data && (data.total - data.solve);
      let subtitle = data && data.subtitle;

      let myChart = echarts.init(chart);

      myChart.setOption({
        title: {
          title: "",
          subtext: '上报统计',
          subtextStyle: {
            fontSize: 20,
            color: "#000"
          },
          x: "center",
          y: "0"
        },
        tooltip: {
          trigger: "axis"
        },
        legend: {
          x: '71%',
          y: 35,
          data:['公众上报提交量', '公众上报受理量']
        },
        grid: {
          top: '20%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['2017年10月1日','2017年10月2日','2017年10月3日','2017年10月4日','2017年10月5日','2017年10月6日','2017年10月7日']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name:'公众上报提交量',
            type:'line',
            data:[100, 300, 290, 400, 120, 234,178]
          },
          {
            name:'公众上报受理量',
            type:'line',
            data:[211, 300, 200, 100, 438, 120, 119]
          },
        ]
      });
    },

    // 绘图
    init() {
      let chart = this.$refs.chartLine;
      let tempChart = chart;

      // if (toType(chart) === "[Object Array]") {
      //   console.log(chart);
      //   tempChart = chart && chart.length && chart[0];
      // }

      this._initChart(tempChart, this.item);
    }
  }
};
</script>