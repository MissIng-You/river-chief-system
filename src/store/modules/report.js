import report from './../../api/report-service';
import common from './../../store/modules/common';
import {
    COMMON_LOAD_DOING,
    COMMON_LOAD_DONE,

    REPORT_CHART_SUCCESS,
    REPORT_CHART_FAILURE,

    REPORT_INFO_SUCCESS,

    DEL_REPORT_RECORD_SUCCESS,
    UPDATE_REPORT_CANLOOKSTATE_SUCCESS,
} from './../mutation-types';

// initial state
const state = {
    queryModel: {
        AreaCode: '',
        StartTime: '',
        EndTime: '',
        RiverSystemId: '',
        BranchLevel: '',
        RiverId: '',
        NickName: '',
        ReportId: '',
        NCanLookState: '',
        GCanLookState: '',
        PageIndex: 1,
        PageSize: 10,
    },

    // 统计搜索模型
    chartModel: {
        PhaseType: 'time',      // 自定义类型 “time” 表示按照时间搜索， “space” 表示按照空间搜索
        AreaCode: '513331000000',
        AreaLevel: '',
        RiverSystemId: '',
        BranchLevel: '',
        RiverId: '',
        RiverName: '',
        PhaseNo: 1,
        StartPhase: 1,
        EndPhase: 1,
        PageIndex: 1,
        PageSize: 200,
        StartTime: '',
        EndTime: '',
        Unit: -1
    },

    reportInfoResult: null, //公众上报信息成功结果集
    reportInfoError: null,  //公众上报信息失败结果集

    chartResult: null,  // 上报统计报表成功结果集
    chartError: null,  // 上报统计报表失败结果集

    delRecordResult: null,  //公众上报信息删除成功结果集
    delRecordError: null,   //公众上报信息删除失败结果集

    updateStateResult: null, //公众上报可视状态更新成功结果集
    updateStateError: null, //公众上报可视状态更新失败结果集


}

// getters
const getters = {
    reportInfoResult: state => state.reportInfoResult,
    reportInfoError: state => state.reportInfoError,

    chartResult: state => state.chartResult,
    chartError: state => state.chartError,

    delRecordResult: state => state.delRecordResult,
    delRecordError: state => state.delRecordError,

    updateStateResult: state => state.updateStateResult,
    updateStateError: state => state.updateStateError,
}

// actions
const actions = {
    //获取上报信息
    getReportInfo({ dispatch, commit, state }, payload) {
        commit(COMMON_LOAD_DOING);
        let { params, $Message, $router, route } = payload;
        return report.getReportInfo(params)
            .then(
            result => commit(REPORT_INFO_SUCCESS, { result: result.data, $Message, $router, route }),
            error => commit('COMMON_ERROR', { key: 'reportInfoError', value: error })
            );
    },

    // 获取公众上报信息
    getPhaseReport({ dispatch, commit, state }, payload) {
        commit(COMMON_LOAD_DOING);
        let { params, $Message, $router, route } = payload;
        let { PhaseType } = params;
        let phaseReportPromise = null;

        if (PhaseType === 'space') {
            phaseReportPromise = report.getPhaseReport(params);
        } else {
            phaseReportPromise = report.getPhasesReportOfTime(params);
        }
        return phaseReportPromise
            .then(
            result => commit(REPORT_CHART_SUCCESS, { result: result.data, $Message, $router, route }),
            error => commit(REPORT_CHART_FAILURE, error)
            );
    },

    //删除公众上报记录
    delReportRecord({ dispatch, commit, state }, payload) {
        commit(COMMON_LOAD_DOING);
        let { params, $Message, $router, route } = payload;
        return report.delReportRecord(params)
            .then(
            result => commit(DEL_REPORT_RECORD_SUCCESS, { result: result.data, $Message, $router, route }),
            error => commit('COMMON_ERROR', { key: 'delRecordError', value: error })
            );
    },

    //更新可见状态
    updateReportCanLookState({ dispatch, commit, state }, payload) {
        // commit(COMMON_LOAD_DOING);
        let { params, $Message, $router, route } = payload;
        return report.updateReportCanLookState(params).then(
            result => commit(UPDATE_REPORT_CANLOOKSTATE_SUCCESS, {result: result.data, $Message, $router, route}),
            error => commit('COMMON_ERROR',{ key: 'updateStateError', value: error})
        );
    }

}

// mutations
const mutations = {
    // 更新查询模型字段
    ['UPDATE_MODEL'](state, { model, key, value }) {
        state[model][key] = value;
    },

    //删除后更新结果集
    ['UPDATE_REPORT_RESULT'](state, id){
        console.log("测试是否成功",id);
        state.reportInfoResult.PageData = [];

    },

    //更新公众上报信息字段
    [REPORT_INFO_SUCCESS](state, { result, $Message, $router, route }) {
        console.log("公众上报信息。。。。reportjs is ...", result);
        state.reportInfoResult = result;
        //common.commonError($Message, result, '上传文件失败!');
        if (result.IsError) {
            $Message.error({
                content: '公众上报信息获取失败。。。',
                duration: 3
            });
        }
    },

    //获取删除信息
    [DEL_REPORT_RECORD_SUCCESS](state, { result, $Message, $router, route }) {
        console.log("删除的result is。。。", result);
        state.delRecordResult = result;

        if (result && result.IsError) {
            $Message.error({
                content: result.Message || '公众上报信息删除失败',
                duration: 3
            });
        } else {
            $Message.success({
                content: '删除成功',
                duration: 3
            });
        }
    },

    //获取更新信息
    [UPDATE_REPORT_CANLOOKSTATE_SUCCESS](state, { result, $Message, $router, route }){
        console.log("更新的result is。。。", result);
        state.updateStateResult = result;
        
        if (result && result.IsError) {
            $Message.error({
                content: result.Message || '公众上报信息更新失败',
                duration: 3
            });
        } else {
            $Message.success({
                content: '更新状态成功',
                duration: 3
            });
        }
    },

    [REPORT_CHART_SUCCESS](state, { result, $Message, $router, route }) {
        console.log(`${REPORT_CHART_SUCCESS}: %o`, result);
        state.chartResult = result;
        if (result && result.IsError) {
            $Message.error({
                content: result.Message || '公众报表信息获取失败。。。',
                duration: 3
            });
        }
    },

    [REPORT_CHART_FAILURE](state, error) {
        console.log(`${REPORT_CHART_FAILURE}: %o`, error);
        state.chartError = error;
    },

    [COMMON_LOAD_DOING](state) {
        state.loading = true;
    },

    // 处理统一的错误信息
    ['COMMON_ERROR'](state, { key, value }) {
        console.log(`${key}: %o`, value);
        state[key] = value;
        // 跳转，处理统一错误提示
    },
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}