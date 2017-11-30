<style lang="sass" scoped>
    $em-index-padding: 20px;

    $white: #fff;
    $gray: #ccc;

    .em-index {
        .em-index-head, .em-index-search, .em-index-body {
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            align-items: center;
        }
        .em-index-head {
            justify-content: space-between;
            position: relative;
            padding: 5px 0;
            &::after {
                position: absolute;
                bottom: 0;
                display: block;
                content: "";
                width: 100%;
                height: 1px;
                background-color: $gray;
            }
            .title>.ivu-badge {
                margin-right: 15px;
            }
        }

        .em-index-search {
            justify-content: space-between;
            padding: 15px 0;
        }
        .em-index-body {
            align-items: flex-start;
            justify-content: flex-start;
            padding-right: 20px;
        }

        .condition {
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            align-items: flex-start;

            .input-md:not(:first-child), .input-lg:not(:first-child) {
                margin-left: 15px;
            }
        }
    }

    // .pager
    .pager-wrap {
      
      .pager-prev {
        left: 0;
      }
      .pager-next {
        right: 0;
      }
    }
    .pager-prev,
    .pager-next {
      z-index: 999;
      position: absolute;
      top: 50%;
      display: flex;
      align-items: center;
      justify-content: center;

      .prev, .next {
        width: 80px;
        height: 80px;
        font-size: 3.0em;
        line-height: 80px;
        text-align: center;
      }
    }
    
</style>

<template>
    <div class="em-index">

        <div class="em-index-head">
            <div class="title">
                <Badge :count="result && (result.UnSolveCount + result.SolveCount)">
                    <Button class="button-md" :type="getStateClasses(-1)" @click="filterState(-1)">全部问题</Button>
                </Badge>
                <Badge :count="result && result.SolveCount">
                    <Button class="button-md" :type="getStateClasses(3)" @click="filterState(3)">已解决问题</Button>
                </Badge>
                <Badge :count="result && result.UnSolveCount">
                    <Button class="button-md" :type="getStateClasses(2)" @click="filterState(2)">未解决问题</Button>
                </Badge>
            </div>
            <div class="tools">
                <Button class="button-md" type="ghost" :loading="addLoading" icon="ios-plus-empty" @click="showExceptionModel()">
                    <span v-if="!addLoading">创建问题</span>
                    <span v-else>创建中...</span>
                </Button>
            </div>
        </div>
        <div class="em-index-search">
            <div class="condition">
                <Input v-model="peopleName" @on-enter="getExceptions" icon="ios-search-outline" placeholder="上报人姓名" class="input-md"></Input>
                <Cascader placeholder="选择地区" class="input-lg" 
                    :data="rootAreas" :change-on-select="true" 
                    :load-data="getParentArea" :value="filterAreaCodes" 
                    @on-change="filterArea($event)">
                </Cascader>
                <Select placeholder="选择河流" class="input-md" 
                    :clearable="true" @on-change="filterRiver($event)">
                    <Option value="">全部河流</Option>
                    <Option v-for="(river, index) in riverDatas" :key="index" :value="river.Id">{{river.RiverName}}</Option>
                </Select>
                <DatePicker @on-change="filterDate" type="daterange" placeholder="选择日期" class="input-lg">
                </DatePicker>
            </div>
            <div class="tools">
                <Button class="button-md" type="primary" :loading="loading" icon="ios-search" @click="getExceptions()">
                    <span v-if="!loading">查询</span>
                    <span v-else>查询中...</span>
                </Button>
            </div>
        </div>
        <custom-scrollbar>
            <div class="em-index-body">
                <empty v-if="!datas || !datas.length" content="没有异常列表数据!" />
                <Row :gutter="20" style="width: 100%;">
                    <Col span="8" v-for="(item, index) in datas" :key="index">
                        <exception-item :item="item">
                            <Tooltip slot="tools" content="查看详情" placement="left" :disabled="mapDetailTootipDisabled">
                                <Button type="ghost" shape="circle" icon="map" @click="gotoMapDetail(item)"></Button>
                            </Tooltip>
                        </exception-item>
                    </Col>
                </Row>
            </div>
        </custom-scrollbar>
        <div v-if="datas && datas.length" class="pager-wrap">
          <div class="pager-prev">
            <Button class="prev" type="primary" shape="circle" icon="chevron-left" @click="getPrevPager()"></Button>
          </div>
          <div class="pager-next">
            <Button class="next" type="primary" shape="circle" icon="chevron-right" @click="getNextPager()"></Button>
          </div>
        </div>
        <add-exception :show="showAddModel" @on-refresh="handleRefresh" @on-cancel="handleCancel"></add-exception>
    </div>
</template>
<script>
import { mapGetters, mapState } from "vuex";
import ExceptionItem from "./ExceptionItem";
// import CreateProblem from "./CreateProblem";
import CustomScrollbar from "../shared/CustomScrollbar";
import auth from "../../util/auth";

const AddException = () => import(/* webpackChunkName: "add-exception" */'./AddException.vue');

// 创建双向绑定字段
function createField(moduleName, context) {
  context = context || this;
  moduleName = moduleName || "noModule";

  return function(fieldName, mutationName) {
    let model = context;
    let isExist = true;
    let fields = fieldName.split(".");
    fields.forEach(item => {
      if (item in model) {
        model = model[item];
      } else {
        isExist = false;
        console.log("error: %o", item);
        return false;
      }
    });
    return {
      get() {
        return isExist ? model : "";
      },
      set(val) {
        context.$store.commit(`${moduleName}/${mutationName}`, val);
      }
    };
  };
}

// 创建巡检模块下模型字段
function createModelField(modelName, fieldName) {
  return {
    get() {
      return this[modelName][fieldName];
    },
    set(value) {
      this.$store.commit("exception/UPDATE_MODEL", {
        model: modelName,
        key: fieldName,
        value: value !== '-1' ? value : '',  // 处理全部情况下“-1”转换为"";
      });
    }
  };
}


export default {
  name: "ExceptionList",
  components: {
    ExceptionItem,
    CustomScrollbar,
    AddException,
  },
  computed: {
    ...mapGetters("exception", [
      "result",
      "error",
      "riverResult",
      "riverError",
      "childAreaResult",
      "childAreaError"
    ]),

    ...mapGetters('common', ['peopleResult']),

    ...mapState("exception", ["model", "parentAreaModel", "riverModel"]),

    pageIndex: createModelField("model", "PageIndex"),
    pageSize: createModelField("model", "PageSize"),

    state: createModelField("model", "State"),
    peopleName: createModelField("model", "PeopleName"),
    riverId: createModelField("model", "RiverId"),
    areaCode: createModelField('model', "AreaCode"),
    beginTime: createModelField("model", "SearchStartTime"),
    endTime: createModelField("model", "SearchEndTime"),
  },
  beforeMount() {
    
    // this.getChildArea(null, areaDatas => {
    //   this.childAreaDatas = areaDatas;
    // });
    this.getRiversByArea();
  },
  mounted(){
    //获取当前登录用户根节点行政区信息
    // this.getPeopleInfo();
    this.getRootAreas();
    this.getExceptions();
  },
  data() {
    return {
      mapDetailTootipDisabled: false,
      loading: false,
      addLoading: false,
      datas: [],
      //childAreaDatas: [],
      riverDatas: [],
      riverAreaCode: "",
      showAddModel: false,      // 显示添加模态框
      totalPage: 0,     // 保存总页数

      filterAreaCodes: [],
      rootAreas:[]
    };
  },
  methods: {
    //获取当前登录用户根节点行政区信息
    getRootAreas(){
      let peopleInfo = auth.getPeopleInfo();
      if (!peopleInfo || !peopleInfo.AreaCode || !peopleInfo.AreaLevel) return;
      
      let tempArea = {
        value: peopleInfo.AreaCode,
        label: peopleInfo.AreaName,
        level: peopleInfo.AreaLevel,
        disabled:false,
        children: []
      };
      // 只允许加载到乡镇级别
      if(peopleInfo.AreaLevel < 4) tempArea.loading = false;
      this.rootAreas = [tempArea];

      this.areaCode = peopleInfo.AreaCode;
    },
    // 处理刷新功能
    handleRefresh(show) {
      this.showAddModel = show;
      this.getExceptions();
    },

    // 处理取消
    handleCancel(show) {
      this.showAddModel = show;
    },

    getCarouselArrow(value) {
      return value && value.length > 1 ? "hover" : "never";
    },
    getPollingSonItem(value) {
      return (value && value.split("|")) || [];
    },
    getTagColor(index) {
      let colors = ["blue", "yellow", "red", "green"];
      return colors[index % 4];
    },
    getStateClasses(state) {
      const stateColors = {
        "-1": "primary",
        "2": "warning",
        "3": "success"
      };
      if(!this.state && state === -1) return stateColors["-1"];
      return this.state === state ? stateColors[state] : 'default';
    },

    // 显示异常模态框
    showExceptionModel() {
      this.showAddModel = true;
    },

    // 过滤状态信息
    filterState(exState) {
      this.state = exState === -1 ? '' : exState;
      this.pageIndex = 1;   // 过滤条件时，重置为第一页
      this.getExceptions();
    },

    // 过滤时间
    filterDate(dateRange) {
      if (!dateRange || dateRange.length !== 2) return;
      this.beginTime = dateRange[0] ? dateRange[0] : null;
      this.endTime = dateRange[1] ? dateRange[1] : null;
      this.getExceptions();
    },

    // 过滤河流
    filterRiver(riverId) {
      let { commit } = this.$store;
      commit("exception/UPDATE_RIVER_ID", riverId);
      this.getExceptions();
    },

    // 过滤区域
    filterArea(areaCode, selectDatas) {
      let lastestAreaCode = areaCode[areaCode.length - 1];
      let { commit } = this.$store;
      commit("exception/UPDATE_AREA_CODE", lastestAreaCode);
      this.getRiversByArea();
      this.getExceptions();
    },

    // 获取上一页
    getPrevPager() {
      if(this.pageIndex <= 1) {
        return this.$Message.info({
          content: '前面没有页面啦...',
          duration: 1
        });
      };
      this.pageIndex -= 1;
      this.getExceptions();
    },

    // 获取下一页
    getNextPager() {
      if(this.pageIndex >= this.totalPage) {
        return this.$Message.info({
          content: '已是最后一页啦...',
          duration: 1
        });
      }
      this.pageIndex += 1;
      this.getExceptions();
    },

    // 获取异常信息
    getExceptions() {
      let { dispatch, commit, state } = this.$store;
      let { route } = state;
      this.loading = true;
      dispatch("exception/getExceptions", {
        params: this.model,
        $Message: this.$Message,
        $router: this.$router,
        route: route
      }).then(() => {
        this.loading = false;
        this.datas = this.result && this.result.PageData;
        this.totalPage = this.result && this.result.TotalPage;
      });
    },

    // 获取行政区划主项
    getParentArea(item, callback) {
      let that = this;
      item.loading = true;
      setTimeout(() => {
        that.getChildArea(item.value, areaDatas => {
          item.children = areaDatas ? areaDatas : null;
          item.loading = false;
          item.disabled = !(areaDatas && areaDatas.length);

          let { commit } = this.$store;
          commit("exception/UPDATE_AREA_CODE", item.value);
          this.getRiversByArea();
          this.getExceptions();

          callback && callback();
        });
      }, 500);
      this.loading = true;
    },

    // 获取新增区划子项
    getChildArea(areaCode, callback) {
      let { dispatch, commit, state } = this.$store;

      dispatch("exception/getChildArea", {
        params: areaCode || this.parentAreaModel,
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
              disabled: false,
              children: []
            };
            // 只过滤到乡镇级别
            item.AreaLevel < 4 && (areaMap.loading = false);
            return areaMap;
          });

        callback && callback.call(null, areaDataMap);
      });
    },

    // 获取河流信息
    getRiversByArea() {
      let { dispatch, commit, state } = this.$store;
      let { route } = state;
      this.loading = true;
      dispatch("exception/getRiversByArea", {
        params: this.riverModel,
        $Message: this.$Message,
        $router: this.$router,
        route: state.route
      }).then(() => {
        this.loading = false;
        this.riverDatas = this.riverResult.Data;
      });
    },

    // 跳转到地图详情页面
    gotoMapDetail(item) {
      this.mapDetailTootipDisabled = true;
      this.$router.push({
        path: "/exceptionmanage/mapdetail",
        query: { id: item.Id, lat: item.Lat, lng: item.Lng }
      });
    },

    // // 获取登录用户的人员信息
    // getPeopleInfo() {
    //     let { dispatch, commit, state } = this.$store;
    //     let { route } = state;
    //     dispatch("common/getPeopleInfo", {
    //         params: null,
    //         $Message: this.$Message,
    //         $router: this.$router,
    //         route: route
    //     }).then(() => {
    //         console.log('peopleInfo:%o', this.peopleResult);
    //     });
    // }

    
  }
};
</script>