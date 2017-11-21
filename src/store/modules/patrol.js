import patrol from './../../api/patrol-service';
import {
    PATROL_CHILD_AREA_SUCCESS,
    PATROL_CHILD_AREA_FAILURE,

    PATROL_CHILD_AREA_STATE,

    PATROL_INFO_SUCCESS,
    PATROL_INFO_FAILURE,

    POLLING_PEOPLE_SUCCESS,
    POLLING_PEOPLE_FAILURE,

    POLLING_RECORD_SUCCESS,
    POLLING_RECORD_FAILURE,

    POLLING_RIVER_LIST_SUCCESS,
    POLLING_RIVER_LIST_FAILURE,

    PATROL_CHART_SUCCESS,
    PATROL_CHART_FAILURE,

    PATROL_PHASES_SUCCESS,
    PATROL_PHASES_FAILURE,

    PATROL_RIVER_SYSTEM_SUCCESS,
    PATROL_RIVER_SYSTEM_FAILURE,

    PATROL_RIVER_SUCCESS,
    PATROL_RIVER_FAILURE,

    PATROL_TRACK_SUCCESS,
    PATROL_TRACK_FAILURE,

    POLLING_GET_PATROL_FULL_DETAIL_SUCCESS,
    POLLING_GET_PATROL_FULL_DETAIL_FAILURE,

    COMMON_LOAD_DOING,
    COMMON_LOAD_DONE
} from './../mutation-types';

// initial state
const state = {
    loading: false,   // 是否正在登录状态
    result: null,   // 成功结果集
    error: null,    // 失败结果集

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
    },
    chartResult: null,
    chartError: null,

    phaseResult: null,
    phaseError: null,

    riverSystemResult: null,
    riverSystemError: null,

    riverResult: null,
    riverError: null,

    // 巡检轨迹
    trackResult: null,
    trackError: null,

    childAreaResult: null,  //子集地区成功结果集
    childAreaError: null,  //子集地区失败结果集

    patrolInfoResult: null, //巡河河段成功结果集
    patrolInfoError: null, //巡河河段失败结果集

    pollingPeopleResult: null, //巡河人员成功结果集
    pollingPeopleError: null, //巡河人员失败结果集

    pollingRecordsResult: null, //巡河记录成功结果集
    pollingRecordsError: null, //巡河记录失败结果集

    patrolFullDetailResult: null, //巡检异常详情成功结果集
    patrolFullDetailError: null, //巡检异常详情失败结果集
 

    patrolModel: {
        AreaCode: '510000000000',
        AreaLevel: '',
        ObjectExceptionState: 0, //巡检周期异常状态,0-全部，1-无异常，2-有异常
        PeopleName: '',
        RiverName: '',
        InspectionState:0, //巡检状态: 0-全部，1-已巡检，2-未巡检
        PageIndex: 1,
        PageSize: 10
    },

    pollingModel: {
        ObjectId: '',
        PeopleId: '',
        StartTime: '',
        EndTime: '',
        ExceptionTotalState: ''
    },

    parentAreaModel: '510000000000',
}

// getters
const getters = {
    loading: state => state.loading,
    result: state => state.result,
    error: state => state.error,

    childAreaResult: state => state.childAreaResult,
    childAreaError: state => state.childAreaError,

    patrolInfoResult: state => state.patrolInfoResult,
    patrolInfoError: state => state.patrolInfoError,

    pollingPeopleResult: state => state.pollingPeopleResult,
    pollingPeopleError: state => state.pollingPeopleError,

    pollingRecordsResult: state => state.pollingRecordsResult,
    pollingRecordsError: state => state.pollingRecordsError,

    chartResult : state => state.chartResult,
    chartError: state => state.chartError,

    phaseResult : state => state.phaseResult,
    phaseError: state => state.chartError,

    riverSystemResult: state => state.riverSystemResult,
    riverSystemError: state => state.riverSystemError,

    riverResult: state => state.riverResult,
    riverError: state => state.riverError,

    trackResult: state => state.trackResult,
    trackError: state => state.trackError,

    patrolFullDetailResult: state => state.patrolFullDetailResult,
    patrolFullDetailError: state => state.patrolFullDetailError,
}

// actions
const actions = {
    getChildArea({ dispatch, commit, state }, payload) {
        commit(COMMON_LOAD_DOING);
        let { params, $Message, $router, route } = payload;
        return patrol.getChildArea(params)
            .then(
                result => commit(PATROL_CHILD_AREA_SUCCESS, { result: result.data, $Message, $router, route }),
                error => commit(PATROL_CHILD_AREA_FAILURE, error)
            );
    },

    //获取巡河河段信息
    getPatrolInfo({ dispatch, commit, state }, payload) {
        commit(COMMON_LOAD_DOING);
        let { params, $Message, $router, route } = payload;
        return patrol.getPatrolInfo(params)
            .then(
            result => commit(PATROL_INFO_SUCCESS, { result: result.data, $Message, $router, route }),
            error => commit(PATROL_INFO_FAILURE, error)
            );
    },

    //获取巡检人员
    getPollingPeople({ dispatch, commit, state }, payload) {
        commit(COMMON_LOAD_DOING);
        let { params, $Message, $router, route } = payload;
        return patrol.getPollingPeople(params)
            .then(
            result => commit(POLLING_PEOPLE_SUCCESS, { result: result.data, $Message, $router, route }),
            error => commit(POLLING_PEOPLE_FAILURE, error)
            );
    },

    //获取巡检记录分页列表，根据巡检对象id
    getInspectionRecordListByObject({ dispatch, commit, state }, payload) {
        commit(COMMON_LOAD_DOING);
        let { params, $Message, $router, route } = payload;
        return patrol.getInspectionRecordListByObject(params).
            then(
            result => commit(POLLING_RECORD_SUCCESS, { result: result.data, $Message, $router, route }),
            error => commit(POLLING_RECORD_FAILURE, error)
            );
    },

    // 获取巡检统计报表信息
    getPhaseReport({ dispatch, commit, state }, payload) {
        commit(COMMON_LOAD_DOING);
        let { params, $Message, $router, route } = payload;
        let {PhaseType, PhaseNo, StartPhase, EndPhase} = params;
        let phaseReportPromise = null;

        if(PhaseType === 'space') {
            phaseReportPromise = patrol.getPhaseReport(params);
        } else {
            phaseReportPromise = patrol.getPhasesReportOfTime(params);
        }
        
        return phaseReportPromise
            .then(
                result => commit(PATROL_CHART_SUCCESS, { result: result.data, $Message, $router, route }),
                error => commit(PATROL_CHART_FAILURE, error)
            );
    },

    // 获取巡检统计报表信息
    getPhases({ dispatch, commit, state }, payload) {
        commit(COMMON_LOAD_DOING);
        let { params, $Message, $router, route } = payload;
        return patrol.getPhases(params)
            .then(
                result => commit(PATROL_PHASES_SUCCESS, { result: result.data, $Message, $router, route }),
                error => commit(PATROL_PHASES_FAILURE, error)
            );
    },

    // 获取水系列表信息
    getRiverSystems({ dispatch, commit, state }, payload) {
        commit(COMMON_LOAD_DOING);
        let { params, $Message, $router, route } = payload;
        return patrol.getRiverSystems(params)
            .then(
                result => commit(PATROL_RIVER_SYSTEM_SUCCESS, { result: result.data, $Message, $router, route }),
                error => commit(PATROL_RIVER_SYSTEM_FAILURE, error)
            );
    },

    // 获取河流列表信息
    getRivers({ dispatch, commit, state }, payload) {
        commit(COMMON_LOAD_DOING);
        let { params, $Message, $router, route } = payload;
        return patrol.getRivers(params)
            .then(
                result => commit(PATROL_RIVER_SUCCESS, { result: result.data, $Message, $router, route }),
                error => commit(PATROL_RIVER_FAILURE, error)
            );
    },

    // 获取巡检轨迹信息
    getPatrolTrack({ dispatch, commit, state }, payload) {
        commit(COMMON_LOAD_DOING);
        let { params, $Message, $router, route } = payload;
        return patrol.getPatrolTrack(params)
            .then(
                result => commit(PATROL_TRACK_SUCCESS, { result: result.data, $Message, $router, route }),
                error => commit(PATROL_TRACK_FAILURE, error)
            );
    },

    // 获取巡检所有详情信息
    getPatrolFullDetail({ dispatch, commit, state }, payload) {
        commit(COMMON_LOAD_DOING);
        let { params, $Message, $router, route } = payload;
        return patrol.getPatrolFullDetail(params)
            .then(
            result => commit(POLLING_GET_PATROL_FULL_DETAIL_SUCCESS, { result: result.data, $Message, $router, route }),
            error => commit(POLLING_GET_PATROL_FULL_DETAIL_FAILURE, error)
            );
    }
}

// mutations
const mutations = {
    [PATROL_CHILD_AREA_SUCCESS](state, { result, $Message, $router, route }) {
        console.log(`${PATROL_CHILD_AREA_SUCCESS}: %o`, result);
        state.childAreaResult = result;
        if (result.IsError) {
            $Message.error({
                content: '子集地区信息获取失败。。。',
                duration: 3
            });
        }
    },

    [PATROL_CHART_SUCCESS](state, { result, $Message, $router, route }) {
        console.log(`${PATROL_CHART_SUCCESS}: %o`, result);
        state.chartResult = result;
        if (result && result.IsError) {
            $Message.error({
                content: result.Message || '巡检报表信息获取失败。。。',
                duration: 3
            });
        }
    },

    [PATROL_PHASES_SUCCESS](state, { result, $Message, $router, route }) {
        console.log(`${PATROL_PHASES_SUCCESS}: %o`, result);
        state.phaseResult = result;
        if (result && result.IsError) {
            $Message.error({
                content: '巡检周期信息获取失败。。。',
                duration: 3
            });
        }
    },

    [PATROL_RIVER_SYSTEM_SUCCESS](state, { result, $Message, $router, route }) {
        console.log(`${PATROL_RIVER_SYSTEM_SUCCESS}: %o`, result);
        state.riverSystemResult = result;
        if (result && result.IsError) {
            $Message.error({
                content: '水系信息获取失败。。。',
                duration: 3
            });
        }
    },

    [PATROL_RIVER_SUCCESS](state, { result, $Message, $router, route }) {
        console.log(`${PATROL_RIVER_SUCCESS}: %o`, result);
        state.riverResult = result;
        if (result && result.IsError) {
            $Message.error({
                content: '河流信息获取失败。。。',
                duration: 3
            });
        }
    },

    [PATROL_TRACK_SUCCESS](state, { result, $Message, $router, route }) {
        console.log(`${PATROL_TRACK_SUCCESS}: %o`, result);
        state.trackResult = result;
        if (result && result.IsError) {
            $Message.error({
                content: '巡检轨迹获取失败。。。',
                duration: 3
            });
        }
    },


    [PATROL_CHILD_AREA_FAILURE](state, error) {
        console.log(`${PATROL_CHILD_AREA_FAILURE}: %o`, error);
        state.childAreaResult = error;
    },

    [PATROL_CHART_FAILURE](state, error) {
        console.log(`${PATROL_CHART_FAILURE}: %o`, error);
        state.chartError = error;
    },

    [PATROL_PHASES_FAILURE](state, error) {
        console.log(`${PATROL_PHASES_FAILURE}: %o`, error);
        state.phaseError = error;
    },

    [PATROL_RIVER_SYSTEM_FAILURE](state, error) {
        console.log(`${PATROL_RIVER_SYSTEM_FAILURE}: %o`, error);
        state.riverSystemError = error;
    },

    [PATROL_RIVER_FAILURE](state, error) {
        console.log(`${PATROL_RIVER_FAILURE}: %o`, error);
        state.riverError = error;
    },

    [PATROL_TRACK_FAILURE](state, error) {
        console.log(`${PATROL_TRACK_FAILURE}: %o`, error);
        state.trackError = error;
    },

    [PATROL_CHILD_AREA_STATE](state, patrolAreaCode) {
        if (patrolAreaCode != '') {
            state.riverModel = patrolAreaCode;
        }
        else {
            state.riverModel = '513300000000';
        }
    },

    [PATROL_INFO_SUCCESS](state, { result, $Message, $router, route }) {
        console.log(`${PATROL_INFO_SUCCESS}:%o`, result);
        state.patrolInfoResult = result;

        if (result.IsError) {
            $Message.error({
                content: '河段信息获取失败。。。',
                duration: 3
            });
        }
    },

    [PATROL_INFO_FAILURE](state, error) {
        console.log(`${PATROL_INFO_FAILURE}: %o`, error);
        state.patrolInfoError = error;
    },

    //获取巡河人员，并更新巡河人员数据到state属性
    [POLLING_PEOPLE_SUCCESS](state, { result, $Message, $router, route }) {
        console.log(`${POLLING_PEOPLE_SUCCESS}:%o`, result);
        state.pollingPeopleResult = result;
        if (result.IsError) {
            $Message.error({
                content: '巡河人员获取失败。。。',
                duration: 3
            });
        }
    },

    //获取巡河人员失败时
    [POLLING_PEOPLE_FAILURE](state, error){
        console.log(`${POLLING_PEOPLE_FAILURE}: %o`,error);
        state.pollingPeopleError =  error;
    },

    //获取巡检记录成功
    [POLLING_RECORD_SUCCESS](state, { result, $Message, $router, route }) {
        console.log(`${POLLING_RECORD_SUCCESS}:%o`, result);
        state.pollingRecordsResult = result;

        if (result.IsError) {
            $Message.error({
                content: '巡检记录获取失败。。。',
                duration: 3
            });
        }
    },

    //获取巡检记录失败
    [POLLING_RECORD_FAILURE](state, { result, $Message, $router, route }) {
        console.log(`${POLLING_RECORD_FAILURE}:%o`, error);
        state.pollingRecordsError = error;
    },

    //获取巡检异常详情成功
    [POLLING_GET_PATROL_FULL_DETAIL_SUCCESS](state, { result, $Message, $router, route }) {
        console.log(`${POLLING_GET_PATROL_FULL_DETAIL_SUCCESS}:%o`, result);
        state.patrolFullDetailResult = result;

        if (result.IsError) {
            $Message.error({
                content: '巡检记录获取失败。。。',
                duration: 3
            });
        }
    },

    //获取巡检异常详情失败
    [POLLING_GET_PATROL_FULL_DETAIL_FAILURE](state, { result, $Message, $router, route }) {
        console.log(`${POLLING_GET_PATROL_FULL_DETAIL_FAILURE}:%o`, error);
        state.patrolFullDetailError = error;
    },

  

    [COMMON_LOAD_DOING](state) {
        state.loading = true;
    },

    [COMMON_LOAD_DONE](state) {
        state.loading = false;
    },

    // 更新巡河查询模型
    ['UPDATE_PATROL_MODEL'](state, {key, value}) {
        state.patrolModel[key] = value;
    },

    ['UPDATE_POLLING_MODEL'](state, {key, value}) {
        state.pollingModel[key] = value;
    },

    // 更新查询模型字段
    ['UPDATE_MODEL'] (state, {model, key, value}) {
        state[model][key] = value;
    },
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}