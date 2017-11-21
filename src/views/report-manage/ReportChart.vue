<style lang="sass" scoped>
    .patrol-chart {
        background-color: #fff;

        .pc-header {
            display: flex;
            align-items: center;
            justify-content: flex-start;
        }

        .pc-search {
            padding: 0 10px 10px;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .pc-content {
            background-color: #f2f2f2;
            padding: 10px;
        }
    }

    // .input-wrap
    .input-wrap {
        display:flex;
        align-items:center;
        justify-content: flex-start;
        padding:10px 10px 10px 0;
        .label {
            width:80px;
        }
        .input{
            width:220px;
        }
    }

    // .pc-header
    .pc-header {
        .pc-title {
            padding: 10px;
            margin-right: 10px;
            font-size: 1.2em;
            font-weight: bold;
        }
    }

    // .pc-search
    .pc-search {
        .condition {
            width: 80%;
        }
        .tools {
            display: flex;
            align-items: center;
            justify-content: center;
        }
    }

    // .pc-statistics
    .pc-statistics {
        padding: 10px;
        border-bottom: 1px solid #e0e0e0;
        line-height: 2;
        font-size: 1.2em;
        display: flex;
        align-items: center;
        justify-content: flex-start;


        .content-header,
        .content-chart {
            width: 150px;
            position: relative;
            &::after {
                position: absolute;
                right: 0;
                content: "";
                width: 1px;
                height: 100px;
                background-color: #e0e0e0;
            }
        }

        .content-header {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: space-between;

            .header-mask {
                background-color: #189fd9;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                color: #fff;
                font-size: 20px;
                line-height: 40px;
                text-align: center;
            }
        }
        .content-chart {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        }
        .content-desc {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            justify-content: flex-start;
            padding-left: 50px;
        }
    }

    // .pc-charts
    .pc-charts {
        padding: 10px;

        .chart-item {
            display: flex;
            align-item: center;
            justify-content: center;
        }
    }

</style>
<template>
    <div class="patrol-chart">
        <div class="pc-header">
            <h3 class="pc-title">查询条件设置</h3>
            <div class="input-wrap" :span="isSpace ? 12 : 18">
                <span class="label">统计维度</span>
                <RadioGroup v-model="phaseType" @on-change="initData">
                    <Radio label="time">
                        <span>时间分布</span>
                    </Radio>
                    <Radio label="space">
                        <span>空间分布</span>
                    </Radio>
                </RadioGroup>
            </div>
        </div>

        <div class="pc-search">
            <Row class="condition">
                <Col class="input-wrap" span="8">
                    <span class="label">行政区划</span>
                    <Cascader placeholder="行政区划" class="input" :value="areaCodes"
                        :data="rootAreas" :load-data="getChildAreasData"
                        @on-change="filterAreas" :change-on-select="true" :clearable="false">
                    </Cascader>
                </Col>
                <Col v-show="isSpace" class="input-wrap" span="8">
                    <span class="label">行政区级</span>
                    <Select placeholder="行政区级" class="input" :value="areaLevel" @on-change="filterLevel">
                        <Option v-for="(level, index) in levels" :value="level.value" :key="index">{{level.label}}</Option>
                    </Select>
                </Col>
                <Col class="input-wrap" :span="isSpace ? 8 : 16">
                    <span class="label">统计周期</span>
                    <div v-show="isTime" class="time-wrap">
                        <Select placeholder="开始周期" class="input" :value="startPhase" v-model="startPhase" @on-change="filterStartPhases">
                            <Option v-for="(item, index) in phases" :value="item.PhaseSign" :key="index">{{item.PhaseDescription}}</Option>
                        </Select>
                        <span>至</span>
                        <Select placeholder="结束周期" class="input" :value="endPhase" v-model="endPhase" @on-change="filterEndPhases">
                            <Option v-for="(item, index) in phases" :value="item.PhaseSign" :key="index">{{item.PhaseDescription}}</Option>
                        </Select>
                    </div>
                    <div v-show="isSpace" class="space-wrap">
                        <Select placeholder="统计周期" class="input" :value="phaseNo" v-model="phaseNo" >
                            <Option v-for="(level, index) in phases" :value="level.PhaseSign" :key="index">{{level.PhaseDescription}}</Option>
                        </Select>
                    </div>
                </Col>

                <Col class="input-wrap" span="8">
                    <span class="label">所属水系</span>
                    <Select placeholder="水系" class="input" value="-1" @on-change="filterRiverSystems">
                        <Option value="-1">全部水系</Option>
                        <Option v-for="(item, index) in riverSystems" :value="item.Id" :key="index">{{item.RiverSystemName}}</Option>
                    </Select>
                </Col>
                <Col class="input-wrap" span="8">
                    <span class="label">干支流级别</span>
                    <Select placeholder="干支流级别" class="input" value="-1" @on-change="filterBranches">
                        <Option value="-1">全部级别</Option>
                        <Option v-for="(item, index) in branches" :value="item.value" :key="index">{{item.label}}</Option>
                    </Select>
                </Col>
                <Col class="input-wrap" span="8">
                    <span class="label">河流名称</span>
                    <Select placeholder="选择/输入河流名称" filterable class="input" value="-1" @on-change="filterRivers">
                        <Option value="-1">全部河流</Option>
                        <Option v-for="(item, index) in rivers" :value="item.Id" :key="item.Id">{{item.RiverName}}</Option>
                    </Select>
                </Col>
            </Row>
            <div class="tools">
                <Button class="button-md" type="primary" icon="ios-search" :loading="loading" @click="getPhaseReport()">
                    <span v-if="!loading">查询</span>
                    <span v-else>查询中...</span>
                </Button>
            </div>
        </div>

        <div class="pc-content">
            <div class="pc-statistics">
                <div class="content-header">
                    <div class="header-mask">
                        <Icon type="ios-pulse-strong"></Icon>
                    </div>
                    <p>{{getLevelName}}</p>
                    <p>巡河出勤统计</p>
                </div>
                <div v-show="patrolChart.zone && patrolChart.zone.length" v-if="isSpace" class="content-chart">
                    <report-chart-item :size="'small'" :item="{total: patrolChart.allReach, solve: patrolChart.patrolReach}"></report-chart-item>
                </div>
                <div class="content-desc">
                    <p>
                        <span>{{selectAreaNames}}</span>
                        <span>| {{getRiverSystemName}} |</span>
                        <span>{{getRiverName}}（{{patrolChart.allRivers}}条）</span>
                    </p>
                    <p>{{getPhaseName}}</p>
                    <p v-if="isSpace">
                        <span>{{getLevelName}}总共{{patrolChart.allReach}}条，</span>
                        <span>在本周期内完成巡河总共{{patrolChart.patrolReach}}条，</span>
                        <span>巡河完成率：{{patrolChart.completePercent}}</span>
                    </p>
                    <p v-if="isTime">
                        <span>{{getLevelName}}总共{{patrolChart.allReach}}条</span>
                    </p>
                </div>
            </div>
            <Row class="pc-charts">
                <empty v-if="!patrolChart.zone || !patrolChart.zone.length" content="没有巡检统计数据!" />
                <Col span="6" class="chart-item" v-for="(item, index) in patrolChart.zone" :key="index">
                    <report-chart-item :item="{title: item.AreaName, subtitle: item.PhaseDescription || getPhaseName, total: item.ObjectCount, solve: item.CompleteInspectCount}"></report-chart-item>
                </Col>
            </Row>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import auth from "../../util/auth";
import ReportChartItem from "./ReportChartItem";

// 创建巡检模块下模型字段
function createModelField(modelName, fieldName) {
  return {
    get() {
      return this[modelName][fieldName];
    },
    set(value) {
      this.$store.commit("patrol/UPDATE_MODEL", {
        model: modelName,
        key: fieldName,
        value: value !== '-1' ? value : '',  // 处理全部情况下“-1”转换为"";
      });
    }
  };
}

export default {
  name: "PatrolChart",
  components: {
    ReportChartItem
  },
  computed: {
    ...mapGetters("patrol", [
      "chartResult",
      "chartError",
      "phaseResult",
      "phaseError",
      "riverSystemResult",
      "riverSystemError",
      "riverResult",
      "riverError",
      "childAreaResult",
      "childAreaError"
    ]),
    ...mapState("patrol", ["chartModel", "parentAreaModel"]),

    // 自定义类型 “time” 表示按照时间搜索， “space” 表示按照空间搜索
    phaseType: createModelField("chartModel", "PhaseType"),

    pageIndex: createModelField("chartModel", "PageIndex"),
    pageSize: createModelField("chartModel", "PageSize"),

    areaCode: createModelField("chartModel", "AreaCode"),
    areaLevel: createModelField("chartModel", "AreaLevel"),
    phaseNo: createModelField("chartModel", 'PhaseNo'),
    startPhase: createModelField("chartModel", "StartPhase"),
    endPhase: createModelField("chartModel", "EndPhase"),
    riverSystemId: createModelField("chartModel", "RiverSystemId"),
    branchLevel: createModelField("chartModel", "BranchLevel"),
    riverId: createModelField("chartModel", "RiverId"),
    riverName: createModelField("chartModel", "RiverName"),

    isSpace() {
      return this.phaseType === "space";
    },
    isTime() {
      return this.phaseType === "time";
    },
    // 获取筛选行政级别名称
    getLevelName() {
        let level = this.areaLevel;
        let filterLevels = this.levels.filter(item => item.value === level);
        let name = filterLevels && filterLevels.length && filterLevels[0].label || '';
        return `${name}河段`;
    },

    // 获取筛选河流名称
    getRiverName() {
        let river = this.riverId;
        let filterRiver = this.rivers.filter(item => item.Id === river);
        let name = filterRiver && filterRiver.length && filterRiver[0].RiverName || '全部河流';
        return name;
    },

    // 获取筛选水系名称
    getRiverSystemName() {
        let river = this.riverSystemId;
        let filterRiver = this.riverSystems.filter(item => item.Id === river);
        let name = filterRiver && filterRiver.length && filterRiver[0].RiverSystemName || '全部水系';
        return name;
    },

    // 获取统计周期名称
    getPhaseName() {
        const filterPhase = (phaseNo) => {
            let filterPhases = this.phases.filter(item => item.PhaseSign === phaseNo);
            let name = (filterPhases && filterPhases.length && filterPhases[0].PhaseDescription) || '';
            return name;
        };

        if(this.isSpace) {
            return filterPhase(this.phaseNo);
        } else {
            return `${filterPhase(this.startPhase)} - ${filterPhase(this.endPhase)}`;
        }
    },
  },

  mounted() {
    // 初始化基础数据
    this.initData()
  },
  data() {
    return {
      loading: false,

      selectAreaNames: '',  // 保存选中的行政区划名称集

      rootAreas: [],        // 根行政区划信息
      areaCodes: [undefined],        // 保存选中的行政区编码

      levels: [],       // 保存行政区级别
      phases: [],       // 保存周期集合
      riverSystems: [], // 保存水系信息
      branches: [],      // 保存干支流信息
      rivers: [],       // 保存河流信息

      totalRiverCount: 0, // 保存总河流条数

      patrolChart: {
        allRivers: 0,
        allReach: 0,
        patrolReach: 0,
        completePercent: '0%',
        zone: []
      }
    };
  },
  methods: {

    // 初始化基础数据
    initData() {
        // 获取当前登录用户根节点行政区信息
        this.getRootAreas();

        // 获取行政区级别
        this.getAreaLevels(this.areaLevel);

        // 获取水系信息
        this.getRiverSystems();

        // 获取干支流级别信息
        this.getBranches();

        // 获取巡检周期
        this.getPhases();

        // 获取巡检统计报表信息
        this.getPhaseReport();
    },

    // 获取当前登录用户根节点行政区信息
    getRootAreas() {
        let peopleInfo = auth.getPeopleInfo();
        if (!peopleInfo || !peopleInfo.AreaCode || !peopleInfo.AreaLevel) return;
        this.rootAreas = [{
            value: peopleInfo.AreaCode,
            label: peopleInfo.AreaName,
            level: peopleInfo.AreaLevel,
            disabled: false,
            loading: peopleInfo.AreaLevel < 5 ? false : true,
            children: []
        }];

        // 更新Code 和 Level 以便查询行政区信息及行政区级别
        this.areaCode = peopleInfo.AreaCode;
        this.areaLevel = peopleInfo.AreaLevel;

        this.$set(this.areaCodes, '0', peopleInfo.AreaCode);
        this.selectAreaNames = peopleInfo.AreaName;
    },

    // 获取行政区级别
    getAreaLevels(level) {
        const levels = [{
            value: 1,
            label: '省级'
        }, {
            value: 2,
            label: '市级'
        }, {
            value: 3,
            label: '县级'
        }, {
            value: 4,
            label: '乡镇'
        }, {
            value: 5,
            label: '村组'
        }];
        this.levels = levels.filter(item => item.value >= level) || [];
    },

    // 获取巡检周期信息
    getPhases() {
      let { dispatch, commit, state } = this.$store;
      let { route } = state;
      this.loading = true;
      dispatch("patrol/getPhases", {
        params: this.areaLevel,
        $Message: this.$Message,
        $router: this.$router,
        route: route
      }).then(() => {
        this.loading = false;

        this.phases = this.phaseResult.Data;
      });
    },

    // 获取水系信息
    getRiverSystems() {
      let { dispatch, commit, state } = this.$store;
      let { route } = state;
      this.loading = true;
      dispatch("patrol/getRiverSystems", {
        params: null,
        $Message: this.$Message,
        $router: this.$router,
        route: route
      }).then(() => {
        this.loading = false;

        this.riverSystems = this.riverSystemResult.Data;
      });
    },

    // 获取干支流信息
    getBranches() {
        const branches = [{
            value: 1,
            label: 'Ⅰ 级'
        }, {
            value: 2,
            label: 'Ⅱ 级'
        }, {
            value: 3,
            label: 'Ⅲ 级'
        }, {
            value: 4,
            label: 'Ⅳ 级'
        }];
        this.branches = branches;
    },

    // 获取河流信息
    getRivers() {
      let { dispatch, commit, state } = this.$store;
      let { route } = state;
      let riverModel = {
          RiverId: this.riverId,
          RiverSystemId: this.riverSystemId,
          BranchLevel: this.branchLevel,
          PageIndex: 1,
          PageSize: 0       // PageSize 传入0表示不分页
      };
      this.loading = true;
      dispatch("patrol/getRivers", {
        params: riverModel,
        $Message: this.$Message,
        $router: this.$router,
        route: route
      }).then(() => {
        this.loading = false;

        this.rivers = this.riverResult.PageData;
      });
    },

    // 过滤行政区划
    filterAreas(areaCodes, items) {
      if(!areaCodes || !areaCodes.length) return;
      let lastCode = areaCodes[areaCodes.length - 1];
      let lastItem = items[items.length - 1];

    //   if(this.areaCode === lastItem.value) return;

      this.areaCode = lastCode;
    
      this.selectAreaNames = items.map(item => item.label).join(' ');

      if(this.isSpace) {
        //   this.phaseNo = 1;
          this.areaLevel = lastItem.level;
          this.getAreaLevels(lastItem.level);
      } else {
          // 重置时间维度的周期值
          this.startPhase = 1,
          this.endPhase = 1;
          this.filterLevel(lastItem.level);
      }

      this.getRivers();
    },

    // 过滤行政区划级别
    filterLevel(level) {
    //   if(!level || this.areaLevel === level) return;
      this.areaLevel = level;
      this.getPhases();
    },

    // 过滤统计周期(开始周期)
    filterStartPhases(val) {
        if(this.isSpace) return;

        if(this.startPhase > this.endPhase) {
            this.endPhase = this.startPhase;
        }
    },

    // 过滤统计周期(开始周期)
    filterEndPhases(val) {
        if(this.isSpace) return;

        if(this.endPhase < this.startPhase) {
            this.startPhase = this.endPhase;
        }
    },

    // 过滤水系信息
    filterRiverSystems(val) {
    //   if(!val || this.riverSystemId === val) return;
      this.riverSystemId = val;

      this.getRivers();
    },

    // 过滤干支流信息
    filterBranches(val) {
    //   if(!val || this.branchLevel === val) return;
      this.branchLevel = val;

      this.getRivers();
    },

    // 过滤河流信息
    filterRivers(val) {
    //   if(!val || this.riverId === val) return;
      this.riverId = val;
    },

    // 获取巡检统计报表信息
    getPhaseReport() {
      let { dispatch, commit, state } = this.$store;
      let { route } = state;
      this.loading = true;
      dispatch("patrol/getPhaseReport", {
        params: this.chartModel,
        $Message: this.$Message,
        $router: this.$router,
        route: route
      }).then(() => {
        this.loading = false;

        if(!this.chartResult || !this.chartResult.PageData) return;
        let pageData = this.chartResult.PageData;

        this.patrolChart.zone = pageData || [];
        this.patrolChart.allRivers = this.chartResult.RiverCount || 0;

        // 统计图表综合信息
        this.calculateChartInfo(this.chartResult);
      });
    },

    // 统计图表综合信息
    calculateChartInfo(result) {
        if(!result || !result.PageData) return;
        let charts = result && result.PageData;

        // 处理按照时间维度统计
        if(this.phaseType === 'time') {
            this.patrolChart.allReach = +(charts && charts.length && charts[0].ObjectCount) || 0;
            return;
        }

        let total = 0;
        let solve = 0;
        charts.forEach(item => {
            total += (+item.ObjectCount);
            solve += (+item.CompleteInspectCount);
        });

        this.patrolChart.allReach = total;
        this.patrolChart.patrolReach = solve;
        this.patrolChart.completePercent = `${total ? (solve / total * 100) : 0}%`;
    },

    // 获取行政区划级联控件子级别数据
    getChildAreasData(item, callback) {
      let that = this;
      item.loading = true;
      setTimeout(() => {
        that.getChildArea(item.value, areaDatas => {
          item.loading = false;
          item.children = areaDatas ? areaDatas : null;
          item.disabled = !(areaDatas && areaDatas.length);

          // 更新行政区划Code 和 Level
          that.areaCode = item.value;
          that.areaLevel = item.level;

          callback && callback();
        });
      }, 16);
    },

    // 获取行政区划子级列表
    getChildArea(areaCode, callback) {
      let { dispatch, commit, state } = this.$store;
      dispatch("patrol/getChildArea", {
        params: areaCode || this.areaCode,
        $Message: this.$Message,
        $router: this.$router,
        route: state.route
      }).then(() => {
        let areaData = this.childAreaResult.Data;
        let areaDataMap =
          areaData &&
          areaData.map(item => {
            let areaMap = {
              value: item.AreaCode,
              label: item.AreaName,
              level: item.AreaLevel,
              disabled: false,
              children: []
            };
            item.AreaLevel < 4 && (areaMap.loading = false);
            return areaMap;
          });

        callback && callback.call(null, areaDataMap);
      });
    },
  }
};
</script>
