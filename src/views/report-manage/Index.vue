<style lang="sass" scoped>
    .patrol-manage {
        .pm-header {
            border-bottom: 2px solid #57a3f3;
            overflow: hidden;
            padding: 0 10px 0 10px;

            .patrol-manage {
                font-weight: 900;
                color: #57a3f3;
                font-size: 14px;
                line-height: 32px;
             
            }
             .branch {
                float: right;
                cursor: pointer;

                .branch-triangle {
                    display: block;
                    width: 0;
                    height: 0;
                    border-bottom: 32px solid #e0e0e0;
                    border-left: 20px solid transparent;
                    float: left;
                    border-top-right-radius: 2px;
                }
                .branch-content {
                    display: block;
                    border-top: 1px solid #e0e0e0;
                    border-right: 1px solid #e0e0e0;
                    padding: 5px 25px 5px 10px;
                    float: left;
                    font-size: 14px;
                    background-color: #e0e0e0;
                    border-top-right-radius: 5px;
                    border-top-left-radius: 2px;
                }
                .branch-triangle-select {
                    @extend .branch-triangle;
                    border-bottom: 32px solid #57a3f3;
                }
                .branch-content-select {
                    @extend .branch-content;
                    background-color: #57a3f3;
                    border-top: 1px solid #57a3f3;
                    border-right: 1px solid #57a3f3;
                    color: #fff;
                }
            }
        }
        .pm-body {

        }
    }
</style>
<template>
    <div class="patrol-manage">
        <div class="pm-header">
            <span class="patrol-manage">巡河管理</span>
            <div class="branch" @click="toggleChart">
                <span v-bind:class="[ showChart ? 'branch-triangle-select' : 'branch-triangle' ]"></span>
                <span v-bind:class="[ showChart ? 'branch-content-select' : 'branch-content' ]">查询</span>
            </div>
            <div class="branch" @click="toggleChart">
                <span v-bind:class="[ !showChart ? 'branch-triangle-select' : 'branch-triangle' ]"></span>
                <span v-bind:class="[ !showChart ? 'branch-content-select' : 'branch-content' ]">统计</span>
            </div>
        </div>
        <custom-scrollbar>
            <div class="pm-body">
                <report-chart v-if="!showChart"></report-chart>
                <report-query v-if="showChart"></report-query>
            </div>
        </custom-scrollbar>
    </div>
</template>

<script>

import { mapGetters, mapState } from 'vuex';
import ReportQuery from './ReportQuery';
import ReportChart from './ReportChart';
import CustomScrollbar from '../shared/CustomScrollbar';

export default {
    name: 'ReportManage',
    components: {
        ReportChart,
        ReportQuery,
        CustomScrollbar
    },
    computed: {
        ...mapGetters('patrol', {
            result: 'result',
            childAreaResult: 'childAreaResult',
            childAreaError: 'childAreaError'
        }),
        ...mapState('patrol', {
            parentAreaModel: 'parentAreaModel',
        }),
    },
    beforeMount() {

    },
    created(){

    },
    data() {
        return {
            showChart: true,       // 显示图表信息
            loading: false,
            addLoading: false,
            childAreaDatas: [],
            selectPage: 10,

            // 初始化信息总条数
            dataCount: 0,
            // 每页显示多少条
            pageSize: 10,
            patrolData: [],
            pageIndex: 0,

            // 行政区划编码
            areaCode: '',
            selectAreaCodes: [],
        }
    },
    methods: {
        toggleChart() {
            this.showChart = !this.showChart
        },
        getChildArea(areaCode, callback) {
            let { dispatch, commit, state } = this.$store;

            dispatch('patrol/getChildArea', {
                params: areaCode || this.parentAreaModel,
                $Message: this.$Message,
                $router: this.$router,
                route: state.route
            }).then(() => {
                let areaData = this.childAreaResult.Data;
                let areaDataMap = areaData && areaData.map(item => {
                    let areaMap = {
                        value: item.AreaCode,
                        label: item.AreaName,
                        disabled: false,
                        children: []
                    };
                    item.AreaLevel < 4 && (areaMap.loading = false);
                    return areaMap;
                });
                callback && callback.call(null, areaDataMap);
            });
        },
        selectArea(areaCode, selectDatas) {
            this.riverAreaCode = areaCode[areaCode.length - 1];
            let { commit } = this.$store;
            commit('patrol/PATROL_CHILD_AREA_STATE', this.riverAreaCode);
        },
        getReportInfo() {
            this.loading = true;
        },
    },
}
</script>
