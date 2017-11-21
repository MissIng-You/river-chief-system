<style lang="sass" scoped>
    .patrol-detail {
        .detail-header {
            border-bottom: 2px solid #57a3f3;
            overflow: hidden;
            margin-bottom: 10px;
            display: flex;
            padding-bottom: 5px;
            align-items: center;
            font-size: 14px;

            .back {
                width: 100px;
                height: 24px;
                text-align: center;
                line-height: 24px;
                background-color: #6b6b6b;
                color: #fff;
                margin-right: 10px;
                cursor: pointer;
            }
            .patrol-reach {
                color: #57a3f3;
            }
        }
        .detail-search {
            padding: 0 10px 0 10px;
            display: flex;
            align-items: center;

            .condition {
                font-size: 16px;
                font-weight: 600;
                margin-right: 10px;
            }
            .space {
                margin-right:10px;                 
            }
            .column-space {
                margin-right: 20px;
                width: 200px;
            }
        }
        .detail-content {
            padding: 10px;
        }
    }
</style>


<template>
    <div class="patrol-detail">
        <div class="detail-header">
            <div class="back" @click="goBack()">
                <span>返回上一层</span>
            </div>
            <div>
                <span>巡河管理>></span>
                <span class="patrol-reach" type="primary">巡检河段：</span>
                <span class="patrol-reach">{{patrolReach}}</span>
            </div>
        </div>
        <div class="detail-search">
            <span class="condition">查询条件设置</span>
            <span class="space">巡河人员</span>
            <Select placeholder="巡河人员" value="-1" class="column-space" @on-change="filterPollingPeople($event)">
                <Option value="-1">全部人员</Option>
                <Option v-for="(item,index) in this.pollingPeople" :key="index" :value="item.PeopleId">{{item.PeopleName}}</Option>
                <!-- <Option value="">有异常</Option>
                <Option value="">无异常</Option> -->
            </Select>
            <span class="space">时间范围</span>
            <DatePicker format="yyyy年MM月dd日" class="column-space" type="daterange" placeholder="选择日期" @on-change="filterDateDuration($event)">
            </DatePicker>
            <span class="space">是否上报异常</span>
            <Select placeholder="异常状态" value="-1" class="column-space" @on-change="filterExceptionState($event)">
                <Option value="-1">不限</Option>
                <Option value="是">是</Option>
                <Option value="否">否</Option>
            </Select>
            <Button class="button-md" type="primary" icon="ios-search" @click="getInspectionRecordListByObject()">
                <!-- <span>查询</span> -->
                <span v-if="!loading">查询</span>
                <span v-else>查询中...</span>
            </Button>
        </div>
        <div class="detail-content">
            <empty v-if="!pollingRecords || !pollingRecords.length" content="没有巡河列表数据!" />
            <Table v-show="pollingRecords && pollingRecords.length" border stripe :columns="type" :data="pollingRecords"></Table>
        </div>
        <problem-detail
          :show="openDetail" 
          :patrolDetailData="patrolDetailData" 
          :termList="termList" 
          @showModel="toCancle" 
          :count="{reportCount: reportCount, normalCount: normalCount, patrolTime: patrolTime}">
        </problem-detail>
    </div>
</template>
<script>
import { mapGetters, mapState } from "vuex";
import ProblemDetail from "./ProblemDetail";
import moment from "moment";

//映射巡河模型对象
function createPatrolField(fieldName) {
  return {
    get() {
      return this.pollingModel[fieldName];
    },
    set(value) {
      this.$store.commit("patrol/UPDATE_POLLING_MODEL", {
        key: [fieldName],
        value
      });
    }
  };
}

export default {
  name: "patrolDetail",
  components: {
    ProblemDetail
  },

  computed: {
    ...mapState("patrol",["pollingModel", "patrolFullDetailResult", "patrolFullDetailError"]),
    ...mapGetters("patrol", ["pollingPeopleResult", "pollingRecordsResult"]),

    objectId:  createPatrolField('ObjectId'),
    peopleId: createPatrolField('PeopleId'),
    startTime: createPatrolField('StartTime'),
    endTime: createPatrolField('EndTime'),
    exceptionTotalState: createPatrolField('ExceptionTotalState')
  },

  beforeMount() {
    this.initQuery();
    this.getPollingPeople();
    this.getInspectionRecordListByObject();
    //this.getInspectionRecordListByObj();
  },
  data() {
    return {
      loading: false,
      addLoading: false,
      patrolReach: this.$store.state.route.query.ObjectName,
      openDetail: false,
      comment: true,
      scrollHeight: "100",
      onSiteInspection: '',
      reportCount: 0,
      normalCount: 0,
      patrolTime: '',
      type: [
        {
          title: "巡检周期",
          key: "PhaseDescription",
          align: "center"
        },
        {
          title: "巡河报告编码",
          key: "RecordCode",
          align: "center"
        },
        {
          title: "巡河报告日期",
          key: "EndTime",
          align: "center"
        },
        {
          title: "巡河人员",
          key: "PeopleName",
          align: "center"
        },
        {
          title: "本次巡查上报异常数量",
          key: "ExceptionTotalCount",
          align: "center",
          render: (handler, params) => {
            let item =  params && params.row;
            return item.ExceptionTotalCount==0?'无异常':item.ExceptionTotalCount+'次';
          }
        },
        {
          title: "巡河历时",
          key: "patrolDuration",
          align: "center",
          render:(handler, params) => {
            let format = 'YYYY-MM-DD HH:mm:ss';
            let item = params && params.row;

            let startTime = item && item.StartTime;
            let endTime = item && item.EndTime;

            if(!endTime) return '正在巡河中...';

            let timespan = moment(endTime,format).diff(moment(startTime,format));
            return moment.utc(timespan).format("HH时mm分ss秒");
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
                    this.showDetail(params.index);
                  }
                }
              },
              "查看详情"
            );
          }
        }
      ],
      pollingPeople: [],
      pollingRecords: [],
      patrolDetailData: {},
      termList: []
    };
  },
  methods: {
    //重置查询条件
    setCondition(){
      this.objectId = '';
      this.peopleId = '';
      this.startTime ='';
      this.endTime = '';
      this.exceptionTotalState = '';
    },
    initQuery() {
      this.query = this.$store.state.route.query;
      this.objectId = this.query.ObjectId
    },
    //返回上一页
    goBack() {
      this.setCondition();
      this.$router.go(-1);
    },
    cancelException(show) {
      this.openDetail = show ? show : false;
    },
    showDetail(index) {
      this.openDetail = !this.openDetail;
      this.onSiteInspection = this.pollingRecords[index].Id;
      this.getPatrolFullDetail(this.pollingRecords[index].Id);
    },

    //获取巡检人员
    getPollingPeople() {
      let { dispatch, commit, state } = this.$store;
      let { route } = state;
      this.loading = true;
      dispatch("patrol/getPollingPeople", {
        params: this.query.ObjectId,
        $Message: this.$Message,
        $router: this.$router,
        route: state.route
      }).then(() => {
        this.loading = false;
        this.pollingPeople = this.pollingPeopleResult.Data;
      });
    },

    //获取巡检记录分页列表根据巡检对象id
    getInspectionRecordListByObject() {
      let { dispatch, comment, state } = this.$store;
      let { route } = state;
      this.loading = true;
      dispatch("patrol/getInspectionRecordListByObject", {
        params: this.pollingModel,
        $Message: this.$Message,
        $router: this.$router,
        route: state.route
      }).then(() => {
        this.loading = false;
        this.pollingRecords = this.pollingRecordsResult.PageData;
      });
    },

    //选择巡河人员时
    filterPollingPeople(pollingPeople){
      this.peopleId=pollingPeople == "-1" ? '' : pollingPeople;
      //this.getInspectionRecordListByObject();
    },

    //选择时间范围时
    filterDateDuration(time){
      let st = time && time[0];
      let et = time && time[1];
      this.startTime = st&&st.replace('年','-').replace('月','-').replace('日','');
      this.endTime = st&&et.replace('年','-').replace('月','-').replace('日','');
      //this.getInspectionRecordListByObject();
    },

    //选择是否异常时
    filterExceptionState(exceptionState){
      this.exceptionTotalState = exceptionState=="-1"?'0':exceptionState=="是"?'1':exceptionState=="否"?'2':'';
      //this.getInspectionRecordListByObject();
    },
	// 获取巡检异常详情
    getPatrolFullDetail(inspection) {
      this.termList = [];

      let { dispatch, commit, state } = this.$store;
      this.patrolDetailData = {};
      dispatch('patrol/getPatrolFullDetail', {
        params: inspection,
        $Message: this.$Message,
        $router: this.$router,
        route: state.route
      }).then(() => {
        this.patrolDetailData = this.patrolFullDetailResult.Data;
        let patrolTermList = this.patrolDetailData.InspectionItemList;
        let patrolInfoList = this.patrolDetailData.ReportInfoList;

        this.reportCount = patrolInfoList.length;
        this.normalCount = patrolInfoList.length - this.patrolDetailData.ExceptionTotalCount;
        
        let format = 'YYYY-MM-DD HH:mm:ss';
        let startTime = this.patrolDetailData.StartTime;
        let endTime = this.patrolDetailData.EndTime;
        let timespan = moment(endTime,format).diff(moment(startTime,format));
        this.patrolTime = moment.utc(timespan).format("HH时mm分ss秒");

        
        for(let index = 0; index < patrolTermList.length; index++) {
          let term = {name: patrolTermList[index].ItemName, value: 0, color: 'gray', childTerm: [] };
          term.childTerm =patrolTermList[index].SonInspectionItemList;
          let count = 0;
          for(let i = 0; i < patrolInfoList.length; i++) {
            if(term.name == patrolInfoList[i].MainInspectionItemName && patrolInfoList[i].ReportType == 2) {
              count ++;
              term.color = 'danger';
            }
            else if(term.name == patrolInfoList[i].MainInspectionItemName && patrolInfoList[i].ReportType == 1){
              term.color = 'primary'
            }
            term.value = count;
          };
          this.termList.push(term)
        };
        console.log(this.termList)
      });     
    },  
    toCancle(openDetail) {
      this.openDetail = openDetail;
    },  
  }
};
</script>