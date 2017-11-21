<style lang="sass" scoped>
 .em-model{
         $gray:#969ba0;
         $fontSize:9px;
         $normalColor:#44b8b7;
         $abnormalColor:#f06900;

         overflow:visible;

        .em-model-header {
            display:flex;
            align-items:center;

            .river-info {
                display:inline-block;
            }

            .patrol-report-code {
                margin-left:8px;
                color:$gray;
            }

            button {
                margin-left:8px;
                font-size:10px;
                padding:3px;
            }
        }
        .em-model-body {

            .patrol-report-detail {
                    color:$gray;
                    &>span {
                        margin-right:16px;
                    }
                    .patrol-normal-item {
                        color:$normalColor;
                    }
                    .patrol-abnormal-item {
                        color:$abnormalColor;
                    }
                }
            .patrol-item {
                margin-top:15px;

                .patrol-term {
                    line-height: 24px;
                }
                .blank {
                    display: inline-block;
                    margin-right: -18px;
                }
                .item-tooltip {
                    margin-right:11px; 
                    margin-bottom: 10px;           
                }
                span{
                    color:$gray;
                }
                .pop-content {
                    border:1px solid #cfcfd6;
                    padding:5px 10px;
                    border-radius:5px;
                    margin:5px;
                    background-color:#fff;
                }
        
                .btn-river,.btn-waterbody,.btn-pollutant {
                    padding:2px 15px;
                    font-size:10px;
                    background-color:#fff;
                }
                .btn-river-primary {
                    border:1px solid $normalColor;
                    color:$normalColor;
                    padding:2px 15px;
                    font-size:10px;
                    background-color:#fff;
                 }
                 .btn-river-danger {
                    border:1px solid $abnormalColor;
                    color:$abnormalColor;
                    padding:2px 15px;
                    font-size:10px;
                    background-color:#fff;
                 }
                 .btn-river-gray {
                    border:1px solid $gray;
                    color:$gray;
                    padding:2px 15px;
                    font-size:10px;
                    background-color:#fff;
                 }
                .btn-waterbody {
                    border:1px solid $abnormalColor;
                    color:$abnormalColor;
                }
            }     
        }
        .problem-content {
            width: 100%;
            // height: 400px;
            // overflow: scroll; 
            background-color: #f2f2f2;
            margin-top: 20px;
        }
        .river-badge-item {
            position: relative;
            .badge-count {
                background-color: #ed3f14;
                color: #fff !important;
                width: 20px;
                height: 20px;
                font-size: 12px;
                text-align: center;
                line-height: 20px;
                border-radius: 50%;
                position: absolute;
                z-index: 100;
                top: -10px;
                right: -10px;    
            }
        }

        .river-item {
            position: relative;
            display: inline-block;
            margin-right: 11px;
            .badge-count {
                background-color: #ed3f14;
                color: #fff !important;
                width: 20px;
                height: 20px;
                font-size: 12px;
                text-align: center;
                line-height: 20px;
                border-radius: 50%;
                position: absolute;
                z-index: 100;
                top: -10px;
                right: -10px;    
            }
        }
    }
    

</style>

<style lang="sass">
.item-tooltip {
    .ivu-tooltip-inner{
        min-width:0;
        max-width: 1000px;
    }
    &>span{
        background-color:#fff;
    }
}
.ivu-modal-wrap{
    overflow:visible;
}
</style>

<template>
    <Modal :value="show" :closable="true" width="750" :styles="{top:'20px'}" class-name="em-model" @on-cancel="handleCancel()">
        <div class="em-model-header" slot="header">
            <h4 class="river-info">{{patrolDetailData.ObjectName}}</h4>
            <span class="patrol-report-code">(巡查报告编号 : {{patrolDetailData.RecordCode}})</span>
            <!-- <Button v-if="!isShowMap" type="gray" :loading="trackLoading" @click="getPatrolTrack()">
                <span v-if="!trackLoading">巡河轨迹</span>
                <span v-else>轨迹加载中...</span>
            </Button> -->
            <Button :type="getTrackClasses()" @click="getPatrolTrack()">
                <span>巡河轨迹</span>
            </Button>
        </div>
        <div v-if="!isShowMap" class="em-model-body">
            <div class="patrol-report-detail">
                <span>巡查人员 : {{patrolDetailData.PeopleName}}</span>
                <span>上报数量 : {{count.reportCount}}个
                    <span class="patrol-normal-item">({{count.normalCount}}</span>
                    正常 |
                    <span class="patrol-abnormal-item">{{patrolDetailData.ExceptionTotalCount}}</span>
                    异常)
                </span>
                <span>创建时间 : {{patrolDetailData.StartTime}}</span>
                <span>巡河时长 : {{count.patrolTime}}</span>
            </div>
            <div class="patrol-item">
                <Row>
                    <Col span="2">
                        <span class="patrol-term">巡查项目:</span>
                    </Col>
                    <Col span="22">
                        <Tooltip trigger="hover" class="item-tooltip" placement="top" v-for="(term,index) in termList" :key="index">
                            <div v-if="term.childTerm.length > 0" class="river-badge-item">
                                <i-button v-bind:class="[term.color === 'primary' ? 'btn-river-primary' : term.color === 'danger' ? 'btn-river-danger' : 'btn-river-gray']">{{term.name}}</i-button>
                                <span class="badge-count" v-if="term.value > 0">{{term.value}}</span>
                            </div>
                            <div slot="content" class="tooltip-content">
                                <span class="pop-content" v-for="(childTerm,index) in term.childTerm" :key="index">{{childTerm.ItemName}}</span>
                            </div>
                        </Tooltip>
                        <div class="blank"></div>
                        <div v-for="(term,index) in termList" :key="index" v-if="term.childTerm.length == 0" class="river-item">
                            <i-button v-bind:class="[term.color === 'primary' ? 'btn-river-primary' : term.color === 'danger' ? 'btn-river-danger' : 'btn-river-gray']">{{term.name}}</i-button>
                            <span class="badge-count" v-if="term.value > 0">{{term.value}}</span>
                        </div>
                    </Col>
                </Row> 
                <custom-scrollbar :height="ScrollHeigh" fixed>
                    <div class="problem-content">
                        <detail-list v-for="(item,index) in patrolDetailData.ReportInfoList" :key="index" :detail="item"></detail-list>
                    </div>
                </custom-scrollbar>
            </div>
        </div>
        <div v-if="isShowMap" class="em-model-body">
            <patrol-track-map :data="patrolDetailData"></patrol-track-map>
        </div>
        <div slot="footer"></div>
    </Modal>
</template>


<script>
import { mapGetters, mapState } from 'vuex';
import CustomScrollbar from "../shared/CustomScrollbar";
import DetailList from './DetailList';
import PatrolTrackMap from './PatrolTrackMap';

export default {
    name: 'ProblemDetail',
    components: {
        CustomScrollbar,
        DetailList,
        PatrolTrackMap,
    },
    props: {
        show: {
            type: Boolean,
            defalut: false
        },
        inspection: {
            type: String,
            default: '',
        },
        patrolDetailData: {
            type: Object,
            default: () => {}
        },
        termList: {
            type: Array,
            default: () => []
        },
        count: {
            type: Object,
            require: true,
            default: () => {}
        }
    },

    data() {
        return {
            trackType: 'default',
            trackLoading: false,    // 巡河轨迹Loading
            isShowMap: false,
            show$: this.show,
            riverListDatas: [],
            ScrollHeigh: 400
        }
    },
    computed: {
        ...mapGetters('patrol', {
            // result: 'result',
            // patrolFullDetailResult: 'patrolFullDetailResult', 
            // patrolFullDetailError: 'patrolFullDetailError', 
        }),
        ...mapState('exception', {
        }),
    },
    methods: {

        // 获取巡检轨迹样式
        getTrackClasses() {
            return this.isShowMap ? 'primary' : 'default';
        },

        // 获取巡河轨迹
        getPatrolTrack() {
            this.isShowMap = !this.isShowMap;
        },

        handleCancel() {
            this.show$ = false;
            this.isShowMap = false;
            this.$emit('showModel', false);
        },
    },
    watch: {
        show: function(val, oldVal) {
            this.show$ = val;
        }
    }
}
</script>