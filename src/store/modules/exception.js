import exception from './../../api/exception-service';
import {
  EXCEPTION_LIST_SUCCESS,
  EXCEPTION_LIST_FAILURE,
  EXCEPTION_FILTER_STATE,
  EXCEPTION_DETAIL_SUCCESS,
  EXCEPTION_DETAIL_FAILURE,
  EXCEPTION_ADD_SUCCESS,
  EXCEPTION_ADD_FAILURE,
  EXCEPTION_SOLVE_SUCCESS,
  EXCEPTION_SOLVE_FAILURE,

  EXCEPTION_POLLING_ITEM_SUCCESS,
  EXCEPTION_POLLING_ITEM_FAILURE,

  EXCEPTION_RIVER_SUCCESS,
  EXCEPTION_RIVER_FAILURE,

  EXCEPTION_REACH_SUCCESS,
  EXCEPTION_REACH_FAILURE,

  EXCEPTION_CHILD_AREA_SUCCESS,
  EXCEPTION_CHILD_AREA_FAILURE,

  EXCEPTION_GET_ROOT_AREA_CODE_STATE,
  EXCEPTION_RIVER_STATE,
  EXCEPTION_REACH_STATE,
  EXCEPTION_CHILD_AREA_STATE,
  EXCEPTION_POLLING_ITEM_STATE,
  EXCEPTION_ADD_EXCEPTION_STATE,
  
  COMMON_LOAD_DOING,
  COMMON_LOAD_DONE
} from './../mutation-types';

// initial state
const state = {
  loading: false,   // 是否正在登录状态
  model: {       // 用户模型
    RiverId: '',
    AreaCode: '',
    PeopleName: '',
    ReportType: 2,       // "2"表示异常项，"1"表示正常项
    State: undefined,  // “1”正常、“2”未解决、“3”已解决
    PollingMainItem: '',
    SearchStartTime: '',
    SearchEndTime: '',
    PageIndex:1,
    PageSize: 9,
  },
  result: null,   // 成功结果集
  error: null,    // 失败结果集
  detailResult: null,   // 异常详情成功结果集
  detailError: null,    // 异常详情失败结果集

  addResult: null,  //添加异常成功结果集
  addError: null,  //添加异常失败结果集

  pollingItemResult: null,  //巡查项成功结果集
  pollingItemError: null,  //巡查项成功结果集

  riverResult: null,  //河流信息成功结果集
  riverError: null,  //河流信息失败结果集

  reachResult: null,  //河段信息成功结果集
  reachError: null,  //河段信息失败结果集

  childAreaResult: null,  //子集地区成功结果集
  childAreaError: null,  //子集地区失败结果集

  riverModel: '513300000000',  //河流信息模型
  parentAreaModel: '513300000000',

  reachModel: {     //河段信息模型
    RiverBaseInfoId: '',
    AreaCode: ''
  },

  pollingItemModel: '',   //巡查项信息模型

  solveModel: {   // 解决模型
    ReportInfoId: '',
    SolveInfo: '',
    IsSolved: 1,
    SolveExceptionsFileList: []
  },
  solveResult: null,
  solveError: null,
}

// getters
const getters = {
  loading: state => state.loading,
  result: state => state.result,
  error: state => state.error,

  detailResult: state => state.detailResult,
  detailError: state => state.detailError,

  addResult: state => state.addResult,
  addError: state => state.addError,

  pollingItemResult: state => state.pollingItemResult,
  pollingItemError: state => state.pollingItemError,

  solveResult: state => state.solveResult,
  solveError: state => state.solveError,

  riverResult: state =>state.riverResult,
  riverError: state =>state.riverError,

  reachResult: state =>state.reachResult,
  reachError: state =>state.reachError,
  
  childAreaResult: state =>state.childAreaResult,
  childAreaError: state =>state.childAreaError,
}

// actions
const actions = {
  getExceptions ({ dispatch, commit, state }, payload) {
    commit(COMMON_LOAD_DOING);
    let {params, $Message, $router, route} = payload;
    return exception.getExceptions(params)
      .then(
        result => commit(EXCEPTION_LIST_SUCCESS, {result: result.data, $Message, $router, route}),
        error => commit(EXCEPTION_LIST_FAILURE, error)
      );
  },
  getDetails ({dispatch, commit, state}, payload) {
    commit(COMMON_LOAD_DOING);
    let {params, $Message, $router, route} = payload;
    return exception.getDetails(params)
      .then(
        result => commit(EXCEPTION_DETAIL_SUCCESS, {result: result.data, $Message, $router, route}),
        error => commit(EXCEPTION_DETAIL_FAILURE, error)
      );
  },

  solveException ({dispatch, commit, state}, payload) {
    commit(COMMON_LOAD_DOING);
    let {params, $Message, $router, route} = payload;
    return exception.solveException(params)
      .then(
        result => commit(EXCEPTION_SOLVE_SUCCESS, {result, $Message, $router, route}),
        error => commit(EXCEPTION_SOLVE_FAILURE, error)
      );
  },

  getRiversByArea ({dispatch, commit, state}, payload) {
    commit(COMMON_LOAD_DOING);
    let {params, $Message, $router, route} = payload;
    return exception.getRiversByArea(params)
      .then(
        result => commit(EXCEPTION_RIVER_SUCCESS, {result: result.data, $Message, $router, route}),
        error => commit(EXCEPTION_RIVER_FAILURE, error)
      );
  },

  getReach ({dispatch, commit, state}, payload) {
    commit(COMMON_LOAD_DOING);
    let {params, $Message, $router, route} = payload;
    return exception.getReach(params)
      .then(
        result => commit(EXCEPTION_REACH_SUCCESS, {result: result.data, $Message, $router, route}),
        error => commit(EXCEPTION_REACH_FAILURE, error)
      );
  },

  getChildArea ({dispatch, commit, state}, payload) {
    commit(COMMON_LOAD_DOING);
    let {params, $Message, $router, route} = payload;
    return exception.getChildArea(params)
      .then(
        result => commit(EXCEPTION_CHILD_AREA_SUCCESS, {result: result.data, $Message, $router, route}),
        error => commit(EXCEPTION_CHILD_AREA_FAILURE, error)
      );
  },

  getPolingItem ({dispatch, commit, state}, payload) {
    commit(COMMON_LOAD_DOING);
    let {params, $Message, $router, route} = payload;
    return exception.getPolingItem(params)
      .then(
        result => commit(EXCEPTION_POLLING_ITEM_SUCCESS, {result: result.data, $Message, $router, route}),
        error => commit(EXCEPTION_POLLING_ITEM_SUCCESS, error)
      );
  },

  addException ({dispatch, commit, state}, payload) {
    commit(COMMON_LOAD_DOING);
    let {params, $Message, $router, route} = payload;
    return exception.addException(params)
      .then(
        result => commit(EXCEPTION_ADD_SUCCESS, {result: result.data, $Message, $router, route}),
        error => commit(EXCEPTION_ADD_FAILURE, error)
      );
  },
}

// mutations
const mutations = {
  [EXCEPTION_LIST_SUCCESS] (state, {result, $Message, $router, route}) {
    console.log(`${EXCEPTION_LIST_SUCCESS}: %o`, result);
    state.result = result;

    if (result.IsError) {
      $Message.error({
          content: '异常列表获取失败。。。',
          duration: 3
      });
    }
  },

  [EXCEPTION_DETAIL_SUCCESS] (state, {result, $Message, $router, route}) {
    console.log(`${EXCEPTION_DETAIL_SUCCESS}: %o`, result);
    state.detailResult = result;
    state.solveModel.ReportInfoId = result.Data && result.Data.Id;

    if (result.IsError) {
      $Message.error({
          content: '异常详情获取失败。。。',
          duration: 3
      });
    }
  },

  [EXCEPTION_SOLVE_SUCCESS] (state, {result, $Message, $router, route}) {
    console.log(`${EXCEPTION_SOLVE_SUCCESS}: %o`, result);
    state.solveResult = result;

    if (result && result.IsError) {
      $Message.error({
          content: result.Message || '解决问题失败。。。',
          duration: 3
      });
    }
  },

  [EXCEPTION_RIVER_SUCCESS] (state, {result, $Message, $router, route}) {
    console.log(`${EXCEPTION_RIVER_SUCCESS}: %o`, result);
    state.riverResult = result;
    if (result.IsError) {
      $Message.error({
          content: '河流信息获取失败。。。',
          duration: 3
      });
    }
  },

  [EXCEPTION_REACH_SUCCESS] (state, {result, $Message, $router, route}) {
    console.log(`${EXCEPTION_REACH_SUCCESS}: %o`, result);
    state.reachResult = result;
    if (result.IsError) {
      $Message.error({
          content: '河段信息获取失败。。。',
          duration: 3
      });
    }
  },

  [EXCEPTION_CHILD_AREA_SUCCESS] (state, {result, $Message, $router, route}) {
    console.log(`${EXCEPTION_CHILD_AREA_SUCCESS}: %o`, result);
    state.childAreaResult = result;
    if (result.IsError) {
      $Message.error({
          content: '子集地区信息获取失败。。。',
          duration: 3
      });
    }
  },

  [EXCEPTION_POLLING_ITEM_SUCCESS] (state, {result, $Message, $router, route}) {
    console.log(`${EXCEPTION_POLLING_ITEM_SUCCESS}: %o`, result);
    state.pollingItemResult = result;
    if (result.IsError) {
      $Message.error({
          content: '巡查项信息获取失败。。。',
          duration: 3
      });
    }
  },

  [EXCEPTION_ADD_SUCCESS] (state, {result, $Message, $router, route}) {
    console.log(`${EXCEPTION_ADD_SUCCESS}: %o`, result);
    state.addResult = result;
    if (result && result.IsError) {
      $Message.error({
          content: '添加异常失败。。。',
          duration: 3
      });
    }
  },

  [EXCEPTION_LIST_FAILURE] (state, error) {
    console.log(`${EXCEPTION_LIST_FAILURE}: %o`, error);
    state.error = error;
  },

  [EXCEPTION_DETAIL_FAILURE] (state, error) {
    console.log(`${EXCEPTION_DETAIL_FAILURE}: %o`, error);
    state.detailResult = error;
  },

  [EXCEPTION_SOLVE_FAILURE] (state, error) {
    console.log(`${EXCEPTION_SOLVE_FAILURE}: %o`, error);
    state.solveError = error;
  },

  [EXCEPTION_RIVER_FAILURE] (state, error) {
    console.log(`${EXCEPTION_RIVER_FAILURE}: %o`, error);
    state.riverResult = error;
  },

  [EXCEPTION_REACH_FAILURE] (state, error) {
    console.log(`${EXCEPTION_REACH_FAILURE}: %o`, error);
    state.reachResult = error;
  },

  [EXCEPTION_CHILD_AREA_FAILURE] (state, error) {
    console.log(`${EXCEPTION_CHILD_AREA_FAILURE}: %o`, error);
    state.childAreaResult = error;
  },

  [EXCEPTION_POLLING_ITEM_FAILURE] (state, error) {
    console.log(`${EXCEPTION_POLLING_ITEM_FAILURE}: %o`, error);
    state.pollingItemResult = error;
  },

  [EXCEPTION_ADD_FAILURE] (state, error) {
    console.log(`${EXCEPTION_ADD_FAILURE}: %o`, error);
    state.addError = error;
  },

  [EXCEPTION_FILTER_STATE] (state, exceptionState) {
    state.model.State = exceptionState;
  },

  

  [EXCEPTION_REACH_STATE] (state, exceptionReach) {
    state.pollingItemModel = exceptionReach
  },

  [EXCEPTION_POLLING_ITEM_STATE] (state, exceptionPollingItem) {
  },

  [EXCEPTION_ADD_EXCEPTION_STATE] (state, exceptionAdd) {
  },

  [EXCEPTION_GET_ROOT_AREA_CODE_STATE] (state, exceptionRootAreaCode) {
    state.model.AreaCode = exceptionRootAreaCode;
  },
  

  [COMMON_LOAD_DOING](state) {
      state.loading = true;
  },

  [COMMON_LOAD_DONE](state) {
      state.loading = false;
  },

  // 更新查询模型字段
  ['UPDATE_MODEL'] (state, {model, key, value}) {
    state[model][key] = value;
  },

  // 更新河流ID
  ['UPDATE_RIVER_ID'] (state, riverId) {
    state.model.RiverId = riverId;
    state.reachModel.RiverBaseInfoId = riverId;
  },

  // 更新行政区划编码AreaCode
  ['UPDATE_AREA_CODE'] (state, exceptionAreaCode) {
    exceptionAreaCode && (state.riverModel = exceptionAreaCode);
    state.model.AreaCode = exceptionAreaCode;
    state.reachModel.AreaCode = exceptionAreaCode;
  },

  ['UPDATE_PEOPLE_NAME'] (state, value) {
    state.model.PeopleName = value;
  },
  ['UPDATE_SOLVE_EXPLAIN'] (state, value) {
    state.solveModel.SolveInfo = value;
  },
  ['UPDATE_SOLVE_FILES'] (state, value) {
    state.solveModel.SolveExceptionsFileList = value;
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}