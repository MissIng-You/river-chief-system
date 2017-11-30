import river from './../../api/river-service';

import {
    COMMON_LOAD_DOING,
    COMMON_LOAD_DONE,

    RIVER_INFO_SUCCESS,
    STATISTIC_INFO_SUCCESS,

} from './../mutation-types';

// initial state
const state = {
    queryModel:{
        RiverSystemName: '',
        RiverName: '',
        GeneralCode: '',
        CrossDistrictType: '',
        AreaCode: '',
        PageIndex: 1,
        PageSize: 10
    },
    riverInfoResult: null, //河流信息成功结果集
    riverInfoError: null,   //河流信息失败结果集

    riverStatisticResult: null, //河流统计信息成功结果集
    riverStatisticError: null,  //河流统计信息失败结果集
}

// getters
const getters = {
    riverInfoResult: state => state.riverInfoResult,
    riverInfoError: state => state.riverInfoError,

    riverStatisticResult: state => state.riverStatisticResult,
    riverStatisticError: state => state.riverStatisticError,
   
}

// actions
const actions = {
    //获取河流信息
    getRiverInfo({ dispatch, commit, state }, payload) {
        commit(COMMON_LOAD_DOING);
        let { params, $Message, $router, route } = payload;
        return river.getRiverInfo(params)
            .then(
            result => commit(RIVER_INFO_SUCCESS, { result: result.data, $Message, $router, route }),
            error => commit('COMMON_ERROR', { key: 'riverInfoError', value: error })
            );
    },

    //获取河流统计信息
    getRiverStatisticInfo({ dispatch, commit, state }, payload){
        let { params, $Message, $router, route } = payload;
        return river.getRiverStatisticInfo(params)
        .then(
            result => commit(STATISTIC_INFO_SUCCESS, { result: result.data, $Message, $router, route }),
            error => commit('COMMON_ERROR', { key: 'riverStatisticError', value: error})
        );
    }
}

// mutations
const mutations = {
    [RIVER_INFO_SUCCESS](state, { result, $Message, $router, route }){
        state.riverInfoResult = result;
        if(result.IsError){
            $Message.error({
                content: '河流信息获取失败',
                duration: 3
            });
        }
    },

    [STATISTIC_INFO_SUCCESS](state, { result, $Message, $router, route }){
        state.riverStatisticResult = result;
        if(result.IsError){
            $Message.error({
                content: '河流统计信息获取失败',
                duration: 3
            });
        }

    },

    [COMMON_LOAD_DOING](state){
        state.loading = true;
    },

    // 处理统一的错误信息
    ['COMMON_ERROR'](state, { key, value }) {
        console.log(`${key}: %o`, value);
        state[key] = value;
        // 跳转，处理统一错误提示
    },

    //更新查询字段
    ['UPDATE_MODEL'](state, {model, key, value}){
        state[model][key] = value;
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}