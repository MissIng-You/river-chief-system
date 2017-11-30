<style lang="sass">
// reset .ivu-switch .x-large theme
.ivu-switch-checked.ivu-switch-xlarge {
  &::after {
    left: 37px;
  }
}
.ivu-switch.ivu-switch-xlarge {
  width: 60px;
}
.ivu-table-cell{
  padding:0;
}


// new .ivu-spin-wrap
.ivu-spin-wrap {
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>

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
                            <Cascader class="input" :placeholder="defaultAreaName" :data="rootAreas" :change-on-select="true" :load-data="getChildAreasData" :value="areaCodes" @on-change="filterAreas" :clearable="false"></Cascader>
                        </Col>
                        <Col class="item-wrap" span="8">
                            <span class="label">上报时间</span>
                            <DatePicker class="input" type="daterange" placeholder="选择日期" @on-change="filterDate"></DatePicker>
                        </Col>
                        <Col class="item-wrap" span="8">
                            <span class="label">公众上报编码</span>
                            <Input v-model="reportCode" icon="ios-search-outline" placeholder="输入条目编码" class="input"></Input>
                        </Col>
                    </Row>
                    <Row>
                        <Col class="item-wrap" span="8">
                            <span class="label">所属水系</span>
                            <Select placeholder="所属水系" value="-1" class="input" @on-change="filterRiverSystems">
                                <Option value="-1">不限</Option>
                                <Option v-for="(item, index) in riverSystems" :key="index" :value="item.Id">{{item.RiverSystemName}}</Option>
                            </Select>
                        </Col>
                        <Col class="item-wrap" span="8">
                            <span class="label">干支流级别</span>
                            <Select placeholder="干支流级别" value="-1" class="input" @on-change="filterBranches">
                                <Option value="-1">不限</Option>
                                <Option v-for="(item,index) in branches" :key="index" :value="item.value">{{item.label}}</Option>                         
                            </Select>
                        </Col>
                        <Col class="item-wrap" span="8">
                            <span class="label">河流名称</span>
                            <Select placeholder="河流名称" filterable value="-1" class="input" @on-change="filterRivers">
                                <Option value="-1">不限</Option>
                                <Option v-for="(item, index) in rivers" :value="item.Id" :key="item.Id">{{item.RiverName}}</Option> 
                            </Select>
                        </Col>
                    </Row>
                    <Row>
                      <Col class="item-wrap" span="8">
                            <span class="label">上报者名称</span>
                            <Input v-model="reportorName" icon="ios-search-outline" placeholder="输入上报者名称" class="input"></Input>
                      </Col>
                      <Col class="item-wrap" span="8">
                          <span class="label">内部可视状态</span>
                          <Select placeholder="内部可视状态" value="-1" class="input" @on-change="filterIntVisibleState">
                                <Option value="-1">不限</Option>
                                <Option value="1">可视</Option>
                                <Option value="0">屏蔽</Option> 
                          </Select>
                      </Col>
                      <Col class="item-wrap" span="8">
                          <span class="label">公众可视状态</span>                      
                          <Select placeholder="公众可视状态" value="-1" class="input" @on-change="filterExtVisibleState">
                                <Option value="-1">不限</Option>
                                <Option value="1">可视</Option>
                                <Option value="0">屏蔽</Option> 
                          </Select>
                      </Col>                      
                    </Row>
                </div>
                <div class="search">
                    <Button class="button-md" type="primary" :loading="loading" icon="ios-search" @click="getReportInfo()">
                        <span v-if="!loading">查询</span>
                        <span v-else>查询中...</span>
                    </Button>
                </div>
            </div>
        </div>
        <div class="pm-query-body" style="min-height: 660px;">
            <empty v-if="!reportDatas || !reportDatas.length" content="没有公众上报列表数据!" />
            <Table v-show="reportDatas && reportDatas.length" border stripe :columns="dataColumnName" :data="reportDatas" width="100%"></Table>
            <div v-show="reportDatas && reportDatas.length" class="page">
                <Page placement="top" :total="totalCount" :page-size="pageSize" @on-change="changePage" @on-page-size-change="selectSize" show-elevator show-sizer show-total></Page>
            </div>
        </div>
        <report-detail :show="openDetail" :replyState="replyState" @showModel="toCancle"></report-detail>
        <delete-confirm :show="delConfirm" :query="reportId" @on-cancel="onCancel" @on-refresh="getReportInfo"></delete-confirm>
    </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import auth from "../../util/auth";

import ReportDetail from "./ReportDetail";
import DeleteConfirm from "./DeleteConfirm";

// 映射Vuex模型字段
function createModelField(modelName, fieldName){
  return {
    get(){
      return this[modelName][fieldName];
    },
    set(value){
      this.$store.commit("report/UPDATE_MODEL",{
        model: modelName,
        key: fieldName,
        value: value !== '-1' ? value : '', //处理全部情况下"-1"转换为""
      });
    }
  };
}

export default {
  name: "ReportQuery",
  components: {
    ReportDetail,
    DeleteConfirm,
  },

  data() {
    return {
      loading: false,

      stateLoading: false,    // 保存内部、外部状态Loading

      rootAreas: [],    //根行政区划信息
      areaCodes: [],    //保存选中的行政区
      childAreaDatas: [],
      defaultAreaName: '', //保存登录者所在的行政区划名称

      replyState: 0, //回复状态

      branches:[],      //保存干支流信息
      riverSystems: [], //保存水系信息
      rivers: [],       //保存河流信息

      // 总记录数，总页数
      totalCount: 0,
      totalPage: 1,
      // 保存PatrolInfos
      reportDatas: [],

      delConfirm: false,  //删除是否显示
      reportId:'',

      updateResult: '',

      openDetail: false,

      dataColumnName: [
        {
          title: "公众上报编号",
          key: "Id",
          align: "center",
          width: 130,
          fixed: 'left',          
        },
        {
          title: "上报画面",
          key: "FileList",
          align: "center",
          width: 120, 
          fixed: 'left',         
          render:(handler, params) =>{
            let item = params && params.row;
            let imgs = item && item.FileList;
            let len = imgs && imgs.length;
            let url = len > 0 ? imgs[0].FileUrl : '';
            return len == 0 ? '' : handler('img',
            {
              attrs:{
                src:url,
              },
              style:{
                width: '75px',
                height: '50px'
              }
            },
            '');
          }
        },{
          title: "问题类型",
          key: "QuestionType",
          align: "center",
          width: 120,          
          render:(handler, params) =>{
            let item = params && params.row;
            let question = item && item.QuestionDescribe.split(';');
            let questionType = question.length>1 ? question[0] : '';
            return questionType
          }
        },{
          title: "问题描述",
          key: "QuestionDescrible",
          align: "center",
          width: 120,          
          render:(handler,params) => {
            let item = params && params.row;
            let question = item && item.QuestionDescribe.split(';');
            let questionDesc = question.length >2 ? question[question.length-1] : '';         
            return handler(
                  "Poptip",
                  {
                    props: {
                      trigger: "hover",
                      content: questionDesc
                    },
                    style: {
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      width: "100%"
                    }
                  },
                  questionDesc
                );
          }
        },
        {
          title: "创建时间",
          key: "CreateTime",
          align: "center",
          width: 120,          
        },
        {
          title: "所属市",
          key: "CityName",
          align: "center",
          width: 120,          
        },
        {
          title: "所属区县",
          key: "ContryName",
          align: "center",
          width: 120,          
        },
        {
          title: "河流名称",
          key: "RiverName",
          align: "center",
          width: 120,          
        },
        {
          title: "上报人",
          key: "Nickname",
          align: "center",
          width: 120,          
        },{
          title: "是否回复",
          key: "State",
          align: "center",
          width: 120,          
          render:(handler, params) => {
            let item = params && params.row;
            let replyState = item && item.State;
            return replyState ==0 ? '未回复' : replyState == 100 ? '已回复' : '';
          }
        },{
          title: "内部可视状态",
          key: "CanLookState",
          align: "center",
          width: 120,
          fixed: 'right',         
          render: (handler, params) => {
            let item = params && params.row;
            let state = item && item.CanLookState;
            let reportId = item && item.Id;

            let nLookState = state === 1 || state === 3 ? 1 : 0;
            let gLookState = state ===2 || state ===3 ? 1 : 0;

            if(this.stateLoading && this.reportId === reportId) {
              return handler('Spin',
                {
                  'class': 'ivu-spin-xlarge',
                  props: {
                    fix: true,
                    size: 'large'
                  }
                }
              );
            }
            return handler('i-switch',
              {
                'class': 'ivu-switch-xlarge',
                props: {
                  value: state === 1 || state === 3 ? true : false,
                },
                on:{
                  'on-change':(value) =>{
                    nLookState = value ? 1 : 0;
                    this.updateReportCanLookState(nLookState,gLookState,item);
                  }
                },
              },
              [handler('span',{
                slot: 'open'
              }, '可视'),
              handler('span',{
                slot: 'close'
              }, '屏蔽')],
            );
          }
        },{
          title: "公众可视状态",
          key: "ExternalVisibleState",
          align: "center",
          width: 120,      
          fixed: 'right',          
          render: (handler, params) => {
            let item = params && params.row;
            let state = item && item.CanLookState;
            let reportId = item && item.Id;

            let nLookState = state === 1 || state === 3 ? 1 : 0;
            let gLookState = state ===2 || state ===3 ? 1 : 0;

            if(this.stateLoading && this.reportId === reportId) {
              return handler('Spin',
                {
                  'class': 'ivu-spin-xlarge',
                  props: {
                    fix: true,
                    size: 'large'
                  }
                }
              );
            }
            return handler('i-switch',
              {
                'class': 'ivu-switch-xlarge',
                props: {
                  value: state ===2 || state ===3 ? true : false,
                },
                on:{
                  'on-change':(value) =>{
                    gLookState = value ? 1 : 0;
                    this.updateReportCanLookState(nLookState,gLookState,item);
                  }
                },
              },
              [handler('span',{
                slot: 'open'
              }, '可视'),
              handler('span',{
                slot: 'close'
              }, '屏蔽')],
            );
          }
        },{
          title: "操作",
          key: "Operation",
          align: "center",
          width: 120,    
          fixed: 'right',                
          render: (handler, params) => {
            let item = params && params.row;
            let reportId = item && item.Id;
            return handler('div',[
              handler('span',{
                style:{
                  cursor: 'pointer'
                },
                on:{
                  click:() => {
                    this.showReportDetail(params.index)
                  }
                }
              },[
                handler('Icon',{
                props:{
                  type: 'eye',
                  size: '21',
                  color: '#2d8cf0'
                },
                style:{
                  'padding': '6px'
                },
                on:{

                }
              },''),
              ]),
              handler('span',{
                style:{
                  cursor: 'pointer'
                },
                on:{
                  click:() => {
                    this.showConfirm(reportId);
                  }
                }
              },
              [
                handler('Icon',{
                  props:{
                    type: 'ios-trash',
                    size: '21',
                    color: '#f06900'
                  },
                  style:{
                    padding: '6px'
                  },
                })
              ]),
            ]);
          }
        }
      ],
    };
  },
  computed: {
    ...mapState("report", ["queryModel",]),
    ...mapGetters("common", ["childAreaResult","riverSystemResult","riverResult",]),
    ...mapGetters('report',["reportInfoResult","updateStateResult",]),
    
    areaCode: createModelField("queryModel","AreaCode"),
    beginTime: createModelField("queryModel","StartTime"),
    endTime: createModelField("queryModel","EndTime"),
    riverSystemId: createModelField("queryModel","RiverSystemId"),
    branchLevel: createModelField("queryModel","BranchLevel"),
    riverId: createModelField("queryModel","RiverId"),
    reportorName: createModelField("queryModel","NickName"),
    reportCode: createModelField("queryModel","ReportId"),
    internalVisibleState: createModelField("queryModel","NCanLookState"),
    externalVisibleState: createModelField("queryModel","GCanLookState"),
    pageIndex: createModelField("queryModel","PageIndex"),
    pageSize: createModelField("queryModel","PageSize"),
  },

  beforeMount() {},

  mounted() {
    //获取当前登录用户根节点行政区信息
    this.getRootAreas();


    //获取干支流级别信息
    this.getBranches();

    //获取水系信息
    this.getRiverSystems();

    //获取公众上报信息
    this.getReportInfo();
  },

  methods: {
    //获取当前登录用户根节点行政区信息
    getRootAreas() {
      let peopleInfo = auth.getPeopleInfo();
      if (!peopleInfo || !peopleInfo.AreaCode || !peopleInfo.AreaLevel) return;
      this.rootAreas = [
        {
          value: peopleInfo.AreaCode,
          label: peopleInfo.AreaName,
          level: peopleInfo.AreaLevel,
          disabled: false,
          loading: peopleInfo.AreaLevel < 4 ? false : true,
          children: []
        }
      ];

      //更新Code 和 Level以便查询行政区信息
      this.areaCode = peopleInfo.AreaCode;
      this.defaultAreaName = peopleInfo.AreaName;
      this.areaCodes = [peopleInfo.AreaCode];
    },

    //获取行政区划级联控件子级别数据
    getChildAreasData(item, callback) {
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
          callback && callback();
        });
      }, 16);
    },

    //获取行政区划子级列表
    getChildArea(areaCode, callback) {
      let { dispatch, commit, state } = this.$store;
      dispatch("common/getChildArea", {
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

    //获取干支流信息
    getBranches(){
      const branches = [{
        value: 1,
        label: 'Ⅰ 级'
      },{
        value: 2,
        label: 'Ⅱ 级'
      },{
        value: 3,
        label: 'Ⅲ 级'
      },{
        value:4,
        label: 'Ⅳ 级'
      }];
      this.branches = branches;
    },

    //获取水系信息
    getRiverSystems() {
      let { dispatch, commit, state } = this.$store;
      let { route } = state;
      this.loading = true;
      dispatch("common/getRiverSystems", {
        params: null,
        $Message: this.$Message,
        $router: this.$router,
        route: route
      }).then(() => {
        this.loading = false;
        this.riverSystems = this.riverSystemResult.Data;
      });
    },

    //获取河流信息
    getRivers(){
      let { dispatch, commit, state } = this.$store;
      let { route } = state;
      let riverModel = {
        RiverId: this.riverId,
        RiverSystemId: this.riverSystemId,
        BranchLevel: this.branchLevel,
        PageIndex: 1,
        PageSize: 0       //PageSize为0表示不分页
      };
      this.loading = true;
      dispatch("common/getRivers",{
        params: riverModel,
        $Message: this.$Message,
        $router: this.$router,
        route: route
      }).then(() => {
        this.loading = false;
        this.rivers = this.riverResult.PageData;
      });
    },

    //过滤行政区划
    filterAreas(areaCodes, items) {
      if (!areaCodes || !areaCodes.length) return;
      let lastCode = areaCodes[areaCodes.length - 1];
      let lastItem = items[items.length - 1];
      this.areaCode = lastCode;
    },

    //过滤时间
    filterDate(dateRange){
      if(!dateRange || dateRange.length !== 2) return;
      this.beginTime = dateRange[0] ? dateRange[0] : null;
      this.endTime = dateRange[1] ? dateRange[1] : null;
    },

    //过滤水系
    filterRiverSystems(val){
      this.riverSystemId = val;
      this.riverId = '';  //清空上次河流名称选择的id,否则下一次选择水系，没有河流名称
      this.getRivers();
    },

    //过滤干支流级别
    filterBranches(val){
      this.branchLevel = val;
      this.getRivers();
    },

    //过滤河流名称
    filterRivers(val){
      this.riverId = val;
    },

    //过滤内部可视状态
    filterIntVisibleState(val){
      this.internalVisibleState = val;
    },

    //过滤公众可视状态
    filterExtVisibleState(val){
      this.externalVisibleState = val;
    },

    //获取公众上报信息
    getReportInfo() {
      let { dispatch, commit, state } = this.$store;
      let { route } = state;
      this.loading = true;
      dispatch("report/getReportInfo", {
        params: this.queryModel,
        $Message: this.$Message,
        $router: this.$router,
        route: state.route
      }).then(() => {
        this.loading = false;
        this.reportDatas = this.reportInfoResult.PageData;
        this.getPages(this.reportInfoResult);
      });
    },

    //分页
    getPages(result){
      if(!result || !result.TotalCount || !result.TotalPage) return;
      this.totalCount = result.TotalCount;
      this.totalPage = result.TotalPage;
      this.pageSize = result.PageSize;
    },

    // 选择页数
    changePage(index) {
      let that = this;
      that.pageIndex = index;
      this.$nextTick(() => {
        that.getReportInfo();
      })
    },

    // 选择每页显示条目
    selectSize(index) {
      index != null && (this.pageSize = index);
      this.getReportInfo();
    },

    //是否删除
    showConfirm(reportId) {
      this.reportId = reportId;
      this.delConfirm = !this.delConfirm;
    },

    //更新弹出删除后模态框的显示状态
    onCancel(delConfirm) {
      this.delConfirm = delConfirm;
    },

    //更新CanLookState根据id
    updateReportCanLookState(nState, gState, row){
      let val = nState+''+gState+'';
      let lookState = val==='00' ? 0 : val === '10' ? 1 : val === '01' ? 2 : 3;
      let id = row && row.Id;
     
      let { dispatch, commit, state } = this.$store;
      let { route } = state;

      this.stateLoading = true;
      this.reportId = id;

      dispatch("report/updateReportCanLookState",{
        params: {Id: id, CanLookState: lookState},
        $Message : this.$Message,
        $router: this.$router,
        route: state.route
      }).then(() => {
        let that = this;
        row.CanLookState = lookState;      // 更新Table Row,避免脏数据
        let interval = setTimeout(() => {
          that.stateLoading = false;
          clearTimeout(interval);
        }, 1000);
      });
    },
    cancelException(show) {
      this.openDetail = show ? show : false;
    },
    showReportDetail(index) {
      this.openDetail = !this.openDetail;
      this.replyState = this.reportDatas[index].State
    },
    toCancle(openDetail) {
      this.openDetail = openDetail;
    }, 
  }
};
</script>


