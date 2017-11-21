<style lang="sass" scoped>
    $chart-normal: 220px;
    $chart-small: 120px;
    $chart-offset: 50px;

    .chart-wrap {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        .title {
            font-size: 1.5em;
            font-weight: bold;
            line-height: 1.5;
            letter-spacing: 2px;
        }

        .desc {
            color: #999;
        }

        /* chart theme */
        &.chart-normal {
            width: $chart-normal;
            height: $chart-normal;
            .pie {
                width: $chart-normal - $chart-offset;
                height: $chart-normal - $chart-offset;
            }
        }
        &.chart-small {
            width: $chart-small;
            height: $chart-small;
            .pie {
                width: $chart-small - $chart-offset / 5;
                height: $chart-small - $chart-offset / 5;
            }
        }
    }
</style>

<template>
    <div :class="getPieSize">
        <h2 v-if="showTitle" class="title">{{item.title}}</h2>
        <p v-if="showTitle" class="desc">河段{{item.total}}段，已完成巡检{{item.solve}}段，完成率{{getPercent}}</p>
        <div ref="chart" class="pie"></div>
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
  name: "PatrolChartItem",
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
    getPieSize() {
        let sizeClass = this.size;
        return `chart-wrap chart-${sizeClass}`;
    },
    showTitle() {
        let item = this.item;
        return item && item.title;
    },
    getPercent() {
      let item = this.item;
      if (!item || !item.total || !item.solve) return 0;
      let percent = item.solve / item.total * 100;
      return `${percent}%`;
    }
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
      let complate = data && data.solve;
      let uncomplate = data && (data.total - data.solve);
      let subtitle = data && data.subtitle;

      let myChart = echarts.init(chart);

      myChart.setOption({
        title: {
          title: "",
          subtext: subtitle,
          subtextStyle: {
            fontSize: 14,
            color: "#858585"
          },
          x: "center",
          y: "115"
        },
        tooltip: {
          trigger: "item"
        },
        color: ["#71b6e9", "#fea263"],
        series: [
          {
            type: "pie",
            radius: "60%",
            center: ["50%", "40%"],
            data: [
              { value: complate, name: "已完成巡河" },
              { value: uncomplate, name: "未完成巡河" }
            ],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            },
            label: {
              normal: {
                show: false
              }
            }
          }
        ]
      });
    },

    // 绘图
    init() {
      let chart = this.$refs.chart;
      let tempChart = chart;

      if (toType(chart) === "[Object Array]") {
        console.log(chart);
        tempChart = chart && chart.length && chart[0];
      }

      this._initChart(tempChart, this.item);
    }
  }
};
</script>