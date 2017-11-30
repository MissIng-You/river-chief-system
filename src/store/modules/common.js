import common from './../../api/common-service';
import auth from './../../util/auth';
import {

  COMMON_LOAD_DOING,
  COMMON_LOAD_DONE,

  COMMON_CHILD_AREA_SUCCESS,
  COMMON_CHILD_AREA_FAILURE,
  COMMON_CHILD_AREA_STATE,

  COMMON_RIVER_SYSTEM_SUCCESS,
  COMMON_RIVER_SYSTEM_FAILURE,

  COMMON_RIVER_SUCCESS,
  COMMON_RIVER_FAILURE,

  USER_PEOPLE_SUCCESS,
} from './../mutation-types';

// initial state
const state = {
  loading: false,   // 是否正在登录状态
  parentAreaModel: '510000000000',

  result: null,   // 成功结果集
  error: null,    // 失败结果集

  uploadResult: null,
  uploadError: null,

  peopleResult: null,
  peopleError: null,

  riverSystemResult: null,   //水系列表成功结果集
  riverSystemError: null,   //水系列表失败结果集

  riverResult: null,   //河流列表成功结果集
  riverError: null,   //河流列表失败结果集

  childAreaResult: null,  //子集地区成功结果集
  childAreaError: null,  //子集地区失败结果集

}

// getters
const getters = {
  loading: state => state.loading,
  result: state => state.result,
  error: state => state.error,
  uploadResult: state => state.uploadResult,
  uploadError: state => state.uploadError,

  peopleResult: state => state.peopleResult,
  peopleError: state => state.peopleError,

  riverSystemResult: state => state.riverSystemResult,
  riverSystemError: state => state.riverSystemError,

  riverResult: state => state.riverResult,
  riverError: state => state.riverError,
  childAreaResult: state => state.childAreaResult,
  childAreaError: state => state.childAreaError,
}

// 公用错误处理
const commonError = ($Message, result, content) => {
  if (result && result.IsError) {
    $Message.error({
      content: result.Message || content || '服务端异常，请联系管理员',
      duration: 3
    });
    console.log(`${content}: %o`, result);
  }
}

// actions
const actions = {
  // 文件上传方法
  upload({ dispatch, commit, state }, payload) {
    commit(COMMON_LOAD_DOING);
    let { params, $Message, $router, route } = payload;
    return common.upload(params)
      .then(
      result => commit('UPLOAD_SUCCESS', { result: result.data, $Message, $router, route }),
      error => commit('COMMON_ERROR', { key: 'uploadError', value: error })
      );
  },

  // 获取登录用户的人员信息
  getPeopleInfo({ dispatch, commit, state }, payload) {
    let { params, $Message, $router, route } = payload;
    return common.getPeopleInfo(params)
      .then(
      result => commit(USER_PEOPLE_SUCCESS, { result: result.data, $Message, $router, route }),
      error => commit('COMMON_ERROR', { key: 'peopleError', value: error })
      );
  },

  // 获取子集地区
  getChildArea({ dispatch, commit, state }, payload) {
    commit(COMMON_LOAD_DOING);
    let { params, $Message, $router, route } = payload;
    return common.getChildArea(params)
      .then(
      result => commit(COMMON_CHILD_AREA_SUCCESS, { result: result.data, $Message, $router, route }),
      error => commit(COMMON_CHILD_AREA_FAILURE, error)
      );
  },

  // 获取水系列表信息
  getRiverSystems({ dispatch, commit, state }, payload) {
    commit(COMMON_LOAD_DOING);
    let { params, $Message, $router, route } = payload;
    return common.getRiverSystems(params)
      .then(
      result => commit(COMMON_RIVER_SYSTEM_SUCCESS, { result: result.data, $Message, $router, route }),
      error => commit(COMMON_RIVER_SYSTEM_FAILURE, error)
      );
  },

  // 获取河流列表信息
  getRivers({ dispatch, commit, state }, payload) {
    commit(COMMON_LOAD_DOING);
    let { params, $Message, $router, route } = payload;
    return common.getRivers(params)
      .then(
      result => commit(COMMON_RIVER_SUCCESS, { result: result.data, $Message, $router, route }),
      error => commit(COMMON_RIVER_FAILURE, error)
      );
  },

}

// mutations
const mutations = {
  ['UPLOAD_SUCCESS'](state, { result, $Message, $router, route }) {
    state.uploadSuccess = result;
    commonError($Message, result, '上传文件失败!');
  },

  [USER_PEOPLE_SUCCESS](state, { result, $Message, $router, route }) {
    state.peopleResult = result;
    let { Data: data, Message: message, IsError: isError } = result;
    auth.setPeopleInfo(data || null);
    commonError($Message, result, '获取人员信息异常!');
  },

  [COMMON_CHILD_AREA_SUCCESS](state, { result, $Message, $router, route }) {
    state.childAreaResult = result;
    commonError($Message, result, '子集地区信息获取失败!');
  },

  [COMMON_RIVER_SYSTEM_SUCCESS](state, { result, $Message, $router, route }) {
    state.riverSystemResult = result;
    commonError($Message, result, '水系信息获取失败!');
  },

  [COMMON_RIVER_SUCCESS](state, { result, $Message, $router, route }) {
    state.riverResult = result;
    commonError($Message, result, '河流信息获取失败!');
  },


  [COMMON_CHILD_AREA_FAILURE](state, error) {
    console.log(`${PATROL_CHILD_AREA_FAILURE}: %o`, error);
    state.childAreaResult = error;
  },

  [COMMON_RIVER_SYSTEM_FAILURE](state, error) {
    console.log(`${PATROL_RIVER_SYSTEM_FAILURE}: %o`, error);
    state.riverSystemError = error;
  },

  [COMMON_RIVER_FAILURE](state, error) {
    console.log(`${PATROL_RIVER_FAILURE}: %o`, error);
    state.riverError = error;
  },

  [COMMON_CHILD_AREA_STATE](state, patrolAreaCode) {
    if (patrolAreaCode != '') {
      state.riverModel = patrolAreaCode;
    }
    else {
      state.riverModel = '513300000000';
    }
  },

  [COMMON_LOAD_DOING](state) {
    state.loading = true;
  },

  [COMMON_LOAD_DONE](state) {
    state.loading = false;
  },

  // 处理统一的错误信息
  ['COMMON_ERROR'](state, { key, value }) {
    console.log(`${key}: %o`, value);
    state[key] = value;

    // 跳转，处理统一错误提示
  },

  // 更新查询模型字段
  ['UPDATE_MODEL'](state, { model, key, value }) {
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