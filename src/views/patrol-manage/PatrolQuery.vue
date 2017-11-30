<style lang="sass" scoped>
.pm-query{
    .pm-query-search{
        padding:10px;
        .query-content{
            display:flex;
            flex-direction:row;
            flex-wrap:wrap;
            align-items:center;
            justify-content: space-between;
        }

    }
    .pm-query-body{
        padding: 0 10px 0 10px; 
        .page {
            margin: 20px 0px 20px 0px;
            float: right;
        }
    }
}
.pm-query-search{
  .condition{
    .item-wrap{
        display:flex;
        flex-direction:row;
        align-items:center;
        padding:10px 10px 10px 0;
    }
    .label{
        width:80px;
    }
    .input{
        width:220px;
    }
  }
}
</style>
<template>
    <div class="pm-query">
        <div class="pm-query-search">
            <h3> 查询条件设置</h3>
            <div class="query-content">
                <div class="condition">
                    <Row>
                        <Col class="item-wrap" span="8">
                            <span class="label">行政区划</span>
                            <Cascader class="input" placeholder="行政区划" :data="rootAreas" :change-on-select="true" :load-data="getChildAreasData" :value="areaCodes" @on-change="filterAreas" :clearable="false"></Cascader>
                        </Col>
                        <Col class="item-wrap" span="8">
                            <span class="label">行政区级别</span>
                            <Select placeholder="行政区级别" value="-1" class="input" @on-change="filterAreaLevel($event)">
                                <Option value="-1">不限</Option>
                                <Option v-for="(level,index) in levels" :key="index" :value="level.value">{{level.label}}</Option>
                            </Select>
                        </Col>
                        <Col class="item-wrap" span="8">
                            <span class="label">河段状态</span>
                            <Select placeholder="河段状态" value="-1" class="input" @on-change="filterReachState($event)">
                                <Option value="-1">不限</Option>
                                <Option value="2">有异常</Option>
                                <Option value="1">无异常</Option>
                            </Select>
                        </Col>
                    </Row>
                    <Row>
                        <Col class="item-wrap" span="8">
                            <span class="label">河长姓名</span>
                            <Input v-model="peopleName" icon="ios-search-outline" placeholder="请输入河长姓名" class="input"></Input>
                        </Col>
                        <Col class="item-wrap" span="8">
                            <span class="label">河流名称</span>
                            <Input v-model="riverName" icon="ios-search-outline" placeholder="请输入河流名称" class="input"></Input>
                        </Col>
                        <Col class="item-wrap" span="8">
                            <span class="label">当期巡检状态</span>
                            <Select placeholder="当期巡检状态" value="-1" class="input" @on-change="filterPollingState($event)">
                                <Option value="-1">不限</Option>
                                <Option value="1">已巡检</Option>
                                <Option value="2">未巡检</Option>
                            </Select>
                        </Col>
                    </Row>
                </div>
                <div class="search">
                    <Button class="button-md" type="primary" :loading="loading" icon="ios-search" @click="getPatrolInfo()">
                        <span v-if="!loading">查询</span>
                        <span v-else>查询中...</span>
                    </Button>
                </div>
            </div>
        </div>
        <div class="pm-query-body" style="min-height: 580px;">
            <empty v-if="!datas || !datas.length" content="没有巡河列表数据!" />
            <Table  v-show="datas && datas.length" border stripe :columns="dataColumnName" :data="datas"></Table>
            <div  v-show="datas && datas.length" class="page">
                <Page :total="totalCount" :page-size="pageSize" @on-change="changePage" @on-page-size-change="selectSize" show-elevator show-sizer show-total></Page>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import auth from "../../util/auth";

// 映射Vuex模型字段
function createPatrolField(fieldName) {
  return {
    get() {
      return this.patrolModel[fieldName];
    },
    set(value) {
      this.$store.commit("patrol/UPDATE_PATROL_MODEL", {
        key: [fieldName],
        value
      });
    }
  };
}

export default {
  name: "PatrolQuery",
  components: {},

  data() {
    return {
      loading: false,
      rootAreas: [], //根行政区划信息
      areaCodes: [], //保存选中的行政区
      childAreaDatas: [],
      areaLevelByChief: '',
      levels:[], //保存行政区级别

      // 总记录数，总页数
      totalCount: 0,
      totalPage: 1,
      // 保存PatrolInfos
      datas: [],

      dataColumnName: [
        {
          title: "行政区",
          key: "AreaName",
          align: "center",
          render:(handler,params) => {
            let item = params && params.row;
            let areaLevelName = item.AreaLevel=='1'?'省':item.AreaLevel=='2'?'市':item.AreaLevel=='3'?'区县':item.AreaLevel=='4'?'乡镇':item.AreaLevel=='5'?'村':'';
            return '('+areaLevelName+') '+item.AreaName;
          }
        },
        {
          title: "管辖河段",
          key: "ObjectName",
          align: "center",
        },
        {
          title: "河段异常",
          key: "ObjectUnSolvedExceptionCount",
          align: "center",
          render:(handler, params) => {
          let item = params && params.row;
          let reachException = item.ObjectUnSolvedExceptionCount==0?'无':item.ObjectUnSolvedExceptionCount;
          return reachException;
          }
        },
        {
          title: "河长姓名",
          key: "PeopleNameList",
          align: "center",
          render: (handler, params) => {
            let item = params && params.row;
            let length = item && item.PeopleNameList && item.PeopleNameList.length;
            let peoples = item && item.PeopleNameList && item.PeopleNameList.join(',');
            return length < 2 
              ? peoples 
              : handler(
                  "Poptip",
                  {
                    props: {
                      trigger: "hover",
                      content: peoples
                    },
                    style: {
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      width: "100%"
                    }
                  },
                  peoples
                );
          }
        },
        {
          title: "例行巡河周期",
          key: "PhaseDescription",
          align: "center"
        },
        {
          title: "当期巡河出勤",
          key: "InspectionCount",
          align: "center",
          render:(handler, params) => {
            let item = params && params.row;
            return item.InspectionCount+'次';
          }
        },
        {
          title: "当年巡河次数统计",
          key: "YearTotalCount",
          align: "center",
          render:(handler, params) => {
            let item = params && params.row;
            return item.YearTotalCount+'次';
          }
        },
        {
          title: "巡河报告",
          key: "patrolReport",
          align: "center",
          render: (h, params) => {
            return h(
              "a",
              {
                on: {
                  click: () => {
                    this.patrolDetail(params.row);
                  }
                }
              },
              "本河段巡查报告"
            );
          }
        }
      ],
      
    };
  },
  computed: {
    ...mapState("patrol", ["patrolModel"]),

    ...mapGetters("patrol", [
      "childAreaResult",
      "childAreaError",
      "patrolInfoResult",
      "patrolInfoError"
    ]),
    pageIndex: createPatrolField('PageIndex'),
    pageSize: createPatrolField('PageSize'),
    peopleName: createPatrolField("PeopleName"),
    riverName: createPatrolField("RiverName"),
    areaCode: createPatrolField("AreaCode"),
    areaLevel: createPatrolField("AreaLevel"),
    reachState: createPatrolField("ObjectExceptionState"),
    pollingState: createPatrolField("InspectionState")
  },

  beforeMount() {
  },

  mounted() {
    //获取当前登录用户根节点行政区信息
    this.getRootAreas();

    //获取巡河管理查询数据
    this.getPatrolInfo();

    //获取行政区级别
    this.getAreaLevels(this.areaLevelByChief);
  },

  methods: {

    //获取当前登录用户根节点行政区信息
    getRootAreas(){
      let peopleInfo = auth.getPeopleInfo();
      if(!peopleInfo || !peopleInfo.AreaCode || !peopleInfo.AreaLevel) return;
      this.rootAreas = [{
        value: peopleInfo.AreaCode,
        label: peopleInfo.AreaName,
        level: peopleInfo.AreaLevel,
        disabled: false,
        loading: peopleInfo.AreaLevel < 4 ?false : true,
        children: []
      }];

      //更新Code 和 Level以便查询行政区信息
      this.areaCode = peopleInfo.AreaCode;
      //this.areaLevel = peopleInfo.AreaLevel;
      this.areaLevelByChief = peopleInfo.AreaLevel;
      this.areaCodes = [peopleInfo.AreaCode];
    },

    //获取行政区级别
    getAreaLevels(level){
      //console.log('level is ...',level);
      const levels = [{
        value: 1,
        label: '省级'
      },{
        value: 2,
        label: '市级'
      },{
        value: 3,
        label: '县级'
      },{
        value: 4,
        label: "乡镇"
      },{
        value: 5,
        label: "村组"
      }];
      this.levels = levels.filter(item => item.value >= level) || [];
    },

    //获取行政区划级联控件子级别数据
    getChildAreasData(item, callback){
      let that = this;
      item.loading = true;
      setTimeout(() => {
        that.getChildArea(item.value, areaDatas => {
          item.loading = false;
          item.children = areaDatas ? areaDatas : null;
          item.disabled = !(areaDatas && areaDatas.length);

          //更新行政区Code和Level
          that.areaCode = item.value;
          //that.areaLevel = item.level;
          this.areaLevelByChief = item.level;
          callback && callback();
        });
      },16);

    },

    //获取行政区划子级列表
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

    //过滤行政区划
    filterAreas(areaCodes, items){
      if(!areaCodes || !areaCodes.length) return;
      let lastCode = areaCodes[areaCodes.length - 1];
      let lastItem = items[items.length - 1];
      this.areaCode = lastCode;
      this.getAreaLevels(lastItem.level);
      //this.getPatrolInfo();
    },

    //获取行政区级别
    filterAreaLevel(areaLevel) {
      this.areaLevel = areaLevel=="-1"?'':areaLevel;
    },

    //获取河段状态
    filterReachState(reachState) {
      this.reachState =reachState == "-1" ? '' :reachState;
    },

    //获取巡检状态
    filterPollingState(pollingState) {
      this.pollingState = pollingState=="-1" ? '' : pollingState;
    },

    //获取巡河数据
    getPatrolInfo() {
      let { dispatch, commit, state } = this.$store;
      let { route } = state;
      this.loading = true;
      //console.log("查询model is ....", this.patrolModel);
      dispatch("patrol/getPatrolInfo", {
        params: this.patrolModel,
        $Message: this.$Message,
        $router: this.$router,
        route: state.route
      }).then(() => {
        this.loading = false;

        this.datas = this.patrolInfoResult && this.patrolInfoResult.PageData || [];
        //console.log(this.patrolInfoResult)
        this.getPages(this.patrolInfoResult);
      });
    },

    //查询页面详情页面
    patrolDetail(item) {
      if(!item || !item.ObjectId || !item.ObjectName) return;
      this.$router.push({
        path: "/patrolmanage/patroldetail",
        query: {
          ObjectId: item.ObjectId,
          ObjectName: item.ObjectName
        }
      });
    },

    //分页
    getPages(result) {
      if(!result || !result.TotalCount || !result.TotalPage) return;
      // this.pageIndex = result.PageIndex;
      this.pageSize =  result.PageSize;
      this.totalCount = result.TotalCount;
      this.totalPage = result.TotalPage;
    },

    // 选择页数
    changePage(index) {
      let that = this;
      that.pageIndex = index;
      that.$nextTick(() => {
        that.getPatrolInfo();
      })
    },

    // 选择每页显示条目
    selectSize(index) {
      index != null && (this.pageSize = index);
      this.getPatrolInfo();
    }
  }
};
</script>


