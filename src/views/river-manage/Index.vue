<<style>
.ivu-table-cell{
  padding:0;
}
</style>

<style lang="sass" scoped>
    .river-manage{
      .rm-header{
         border-bottom: 2px solid #57a3f3;
          padding: 0 10px 0 10px;

        .river-manage{
            font-weight: 900;
            color: #57a3f3;
            font-size: 14px;
            line-height: 32px;
        }
      }

      .rm-info{
        margin-top: 15px;
        padding: 5px 15px;
        display: flex;
        align-items: center;

        .separator{
          margin-left: 4px;
          margin-right: 12px;
          width: 1px;
          height: 25px;
          background-color: #cac5c5;
        }

        .info{
          border-radius:10px;
          padding: 5px 10px;
          background-color: #e1e2df;
          margin-right: 8px;
        }

        .font{
          font-size: 15px;
        }
      }

      .rm-search{
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        align-items: center;
        justify-content: space-between;
        border: 0.9px solid #cccaca;
        padding: 10px 30px;
        margin-top: 15px;
        margin-bottom: 10px;
      }

      .page{
        float: right;
        margin-top: 5px;
      }
    }

    .rm-search{
      .item-wrap{
        display: flex;
        flex-direction: row;
        align-items: center;
        padding: 10px;

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
    <div class="river-manage">
      <div class="rm-header">
        <span class="river-manage">河流河长</span>
      </div>
      <div class="rm-info">
        <div class="div">
          <span class="info">河流 : <span class="font">{{statisticData.RiverCount}}</span>条</span>
        </div>
        <div class="separator"></div>
        <div class="div">
          <span class="info">市级河段 : <span class="font">{{statisticData.ReachCityCount}}</span></span>
          <span class="info">区县河段 : <span class="font">{{statisticData.ReachCountyCount}}</span></span>
          <span class="info">乡镇河段 : <span class="font">{{statisticData.ReachTownCount}}</span></span>
          <span class="info">村级河段 : <span class="font">{{statisticData.ReachVillageCount}}</span></span>
        </div>
        <div class="separator"></div>
        <div class="div">
          <span class="info">河长人数 : {{statisticData.RiverChiefCount}}</span>                               
        </div>
      </div>
      <div class="rm-search">
        <div class="condition">
          <Row>
            <Col class="item-wrap" span="8">
              <span class="label">水系</span>
              <Select class="input" value="-1" @on-change="filterRiverSystem">
                <Option value="-1">全部水系</Option>
                <Option v-for="(item, index) in riverSystems" :key="index" :value="item.Id">{{item.RiverSystemName}}</Option>
              </Select>
            </Col>
            <Col class="item-wrap" span="8">
              <span class="label">河流名称</span>
              <Select class="input" value="-1" @on-change="filterRivers">
                <Option value="-1">全部河流</Option>
                <Option v-for="(item, index) in rivers" :key="item.Id" :value="item.Id">{{item.RiverName}}</Option>
              </Select>
            </Col>
            <Col class="item-wrap" span="8">
              <span class="label">普查代码</span>
              <Input v-model="generalCode" class="input" placeholder="输入普查代码"></Input>
            </Col>                            
          </Row>
          <Row>
            <Col class="item-wrap" span="8">
              <span class="label">跨区类型</span>
              <Select class="input" value="-1" @on-change="filterCrossType">
                <Option value="-1">不限</Option>
                <Option v-for="(item, index) in crossTypes" :key="index" :value="item.value">{{item.label}}</Option>
              </Select>
            </Col>        
            <Col class="item-wrap" span="8">
              <span class="label">行政区划</span>
              <Cascader class="input" placeholder="行政区划" :data="rootAreas" :value="areaCodes" :load-data="getChildAreasData" :change-on-select="true" @on-change="filterAreas" :clearable="false"></Cascader>
            </Col>
          </Row>
        </div>
        <div class="search">
           <Button class="button-md" type="primary" :loading="loading" icon="ios-search" @click="getRiverInfo">
              <span v-if="!loading">查询</span>
              <span v-else>查询中...</span>
          </Button>
        </div>
      </div>
      <div class="rm-body">
        <empty v-if="!riverData || !riverData.length" content="没有巡河列表数据!" />
        <Table v-show="riverData && riverData.length" border stripe :columns="dataColumnName" :data="riverData"></Table>
        <div v-show="riverData && riverData.length" class="page">
          <Page :total="totalCount" :page-size="pageSize" @on-change="changePage" @on-page-size-change="selectSize" placement="top" show-elevator show-sizer show-total></Page>
        </div>
      </div>
   </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import auth from "../../util/auth";

function createModelField(modelName, fieldName){
  return{
    get(){
      return this[modelName][fieldName];
    },
    set(value){
      this.$store.commit("river/UPDATE_MODEL",{
        model: modelName,
        key: fieldName,
        value: value!== '-1' ? value : '',  //处理全部情况下'-1'转化为''
      });
    }
  }
}

export default {
  name: "RiverManage",

  data(){
    return{
      loading: false,

      riverSystems: [],  //保存水系信息
      rivers: [],        //保存河流信息
      crossTypes: [],    //保存跨区类型信息

      rootAreas: [],     //保存根行政区划
      areaCodes: [],     //保存选中的行政区

      riverData:[],      //保存河流信息
      statisticData: [], //保存统计信息

      riverSystemId: '',
      riverId: '',
      
      //总记录，总页数
      totalCount: 0, 
      totalPage: 1,

      dataColumnName:[
        {
          title: '水系',
          key: 'RiverSystemName',
          align: 'center',
          width: 80
        },
        {
          title: '河流名称',
          key: 'RiverName',
          align: 'center',
          width: 80
        },
        {
          title: '河流级别',
          key: 'RiverLevel',
          align: 'center',
          width: 80,
          render: (handler, params) => {
            let item = params && params.row;
            let val = item && item.RiverLevel;
            let label = val === 1 ? '省级' : val === 2 ? '市级' : val === 3 ? '县级' : val === 4 ? '乡镇' : val === 5 ? '村组' : '';
            return label;
          }
        },
        {
          title: '别名',
          key: 'OtherName',
          align: 'center',
          width: 100
        },
        {
          title: '普查代码',
          key: 'GeneralCode',
          align: 'center',
          width: 100
        },
        {
          title: '河流干支流级别',
          key: 'BranchLevel',
          align: 'center',
          width: 60
        },
        {
          title: '岸别',
          key: 'bankType',
          align: 'center',
          width: 60          
        },
        {
          title: '河流长度（km）',
          key: 'RiverLength',
          align: 'center',
          width: 60,
          render: (handler, params) => {
            let item = params && params.row;
            let val =  item && item.RiverLength && item.RiverLength/1000;
            return val.toFixed(2);
          }         
        },
        {
          title: '河流面积（km2）',
          key: 'DrainageArea',
          align: 'center',
          width: 60,
          render: (handler, params) => {
            let item = params && params.row;
            let val =  item && item.DrainageArea && item.DrainageArea/1000000;
            return val.toFixed(2);
          }            
        },
        {
          title: '河口流量（m3/s）',
          key: 'RiverDischarge',
          align: 'center',
          width: 60,
          render: (handler, params) => {
            let item = params && params.row;
            let val =  item && item.RiverDischarge && item.RiverDischarge/1;
            return val.toFixed(2);
          }        
        },
        {
          title: '省',
          key: 'ThroughProvince',
          align: 'center'
        },
        {
          title: '市(州)',
          key: 'ThroughCity',
          align: 'center'
        },
        {
          title: '区(县)',
          key: 'ThroughCounty',
          align: 'center'
        },
        {
          title: '乡(镇)',
          key: 'ThroughTown',
          align: 'center'
        },
        {
          title: '村',
          key: 'ThroughVillage',
          align: 'center'
        },
        {
          title: '跨区类型',
          key: 'CrossDistrictType',
          align: 'center',
          render: (handler, params) => {
            let item = params && params.row;
            return item.CrossDistrictType == 1 ? '跨省': item.CrossDistrictType == 2 ? '跨市': item.CrossDistrictType == 3 ? '跨县' : item.CrossDistrictType == 4 ? '跨乡' : item.CrossDistrictType == 5 ? '乡内' : item.CrossDistrictType == 0 ? '未知' : '';
          }
        },
        {
          title: '管理',
          key: 'operate',
          align: 'center',
          //width: 120,
          render: (handler,params) => {
            return handler('div',[
              handler('span',{
                style:{
                  cursor: 'pointer',
                  //'margin-right': '10px'
                },
                on:{
                  click:() => {
                    this.openRiverDetail(params.row);
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
                },
              },''),
              ]),
              //  handler('span',{
              //   style:{
              //     cursor: 'pointer',
              //     'margin-right': '10px'                  
              //   },
              //   on:{
              //     click:() => {
              //     }
              //   }
              // },
              // [
              //   handler('Icon',{
              //     props:{
              //       type: 'edit',
              //       size: '18',
              //       color: '#cc9a07'
              //     },
              //     style:{
              //     },
              //   })
              // ]),
              // handler('span',{
              //   style:{
              //     cursor: 'pointer',                
              //   },
              //   on:{
              //     click:() => {
              //     }
              //   }
              // },
              // [
              //   handler('Icon',{
              //     props:{
              //       type: 'ios-trash',
              //       size: '21',
              //       color: '#f06900'
              //     },
              //     style:{
              //     },
              //   })
              // ])
            ]);
          }
        }
        ],
    }
  },

  computed: {
    ...mapState("river",["queryModel"]),
    ...mapGetters("common",["riverSystemResult","riverResult","childAreaResult"]),
    ...mapGetters("river",["riverInfoResult","riverStatisticResult"]),

    riverSystemName: createModelField("queryModel","RiverSystemName"),
    riverName: createModelField("queryModel","RiverName"),
    generalCode: createModelField("queryModel","GeneralCode"),
    crossDistrictType: createModelField("queryModel","CrossDistrictType"),
    areaCode: createModelField("queryModel","AreaCode"),
    pageIndex: createModelField("queryModel","PageIndex"),
    pageSize: createModelField("queryModel","PageSize")
  },

  beforeMount(){

  },

  mounted(){
    //获取当前用户根节点行政信息
    this.getRootAreas();

    //获取水系信息
    this.getRiverSystems();

    //获取跨区信息
    this.getCrossType();

    //获取河流信息
    this.getRiverInfo();

    //获取河流统计信息
    this.getRiverStatisticInfo();
  },

  methods:{
    //获取根行政区划信息
    getRootAreas(){
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
      this.areaCode = peopleInfo.AreaCode;
      this.areaCodes = [peopleInfo.AreaCode];
    },

    //获取行政区划级联空间子级别数据
    getChildAreasData(item, callback){
      item.loading = true;
      setTimeout(() => {
        this.getChildArea(item.value, areaDatas => {
          item.loading = false;
          item.children = areaDatas ? areaDatas : null;
          item.disabled = !(areaDatas && areaDatas.length);

          this.areaCode = item.value;
          callback && callback();
        });
      },16);
    },

    //获取行政区划子级列表
    getChildArea(areaCode, callback){
      let { dispatch, commit, state } = this.$store;
      dispatch("common/getChildArea",{
        params: areaCode || this.areaCode,
        $Message: this.$Message,
        $router: this.$router,
        route: state.route
      }).then(() => {
        let areaData = this.childAreaResult.Data;
        let areaDataMap = areaData && areaData.map(item => {
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

    //获取水系信息
    getRiverSystems(){
      let { dispatch, commit, state } = this.$store;
      let {route} = state;
      this.loading = true;
      dispatch("common/getRiverSystems",{
        params: null,
        $Message: this.$Message,
        $router: this.$router,
        route: route
      }).then(() => {
        this.loading = false
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
        BranchLevel: null,
        PageIndex: 1,
        PageSize: 0
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

    //获取跨区类型信息
    getCrossType(){
      const crossTypes = [
        {
          value: '1',
          label: '跨省'
        },
        {
          value: '2',
          label: '跨市'
        },
        {
          value: '3',
          label: '跨区(县)'
        },
        {
          value: '4',
          label: '跨乡(镇)'
        },
        {
          value: '5',
          label: '乡镇'
        }
      ];
      this.crossTypes = crossTypes;
    },

    //获取河流信息
    getRiverInfo(){
      let { dispatch, commit, state } = this.$store;
      let { route } = state;
      this.loading = true;
      dispatch("river/getRiverInfo",{
        params: this.queryModel,
        $Message: this.$Message,
        $router: this.$router,
        route: route
      }).then(() => {
        this.loading = false;
        this.riverData = this.riverInfoResult.PageData;
        this.getPages(this.riverInfoResult);
      });
    },

    //获取河流统计信息
    getRiverStatisticInfo(){
      let { dispatch, commit, state } = this.$store;
      let { route } = state;
      dispatch("river/getRiverStatisticInfo",{
        params: null,
        $Message: this.$Message,
        $router: this.$router,
        route: route
      }).then(() => {
        this.statisticData = this.riverStatisticResult.Data;
      });
    },

    //过滤水系
    filterRiverSystem(val){
      this.riverSystemId = val;
      let item = this.riverSystems.filter(item => item.Id===val); 
      this.riverSystemName = item && item.length && item[0].RiverSystemName || ''; 
      this.riverId = '';
      this.getRivers();
    },

    //过滤行政区划
    filterAreas(areaCodes, items){
      if(!areaCodes || !areaCodes.length) return;
      let lastCode = areaCodes[areaCodes.length - 1];
      this.areaCode = lastCode;
    },

    //过滤河流信息
    filterRivers(val){
      this.riverId = val;
      let item = this.rivers.filter(item => item.Id===val);
      this.riverName = item && item.length && item[0].RiverName || '';
    },

    //过滤跨区类型
    filterCrossType(val){
      this.crossDistrictType = val;
    },

    //分页
    getPages(result){
      if ( !result || !result.TotalCount || !result.TotalPage ) return;
      this.pageSize = result.PageSize;
      this.totalCount = result.TotalCount;
      this.totalPage = result.TotalPage;
    },

    //选择页数
    changePage(index){
      let that = this;
      that.pageIndex = index;
      that.$nextTick(() => {
        this.getRiverInfo();
      });
    },

    //选择每页显示条数
    selectSize(size){
      index != null &&(this.pageSize = size);
      this.getRiverInfo();
    },

    //打开河流详细页面
    openRiverDetail(item){
      if (!item) return;
      this.$router.push({
        path:"/rivermanage/RiverDetail",
      });
    }

  }
}
</script>

