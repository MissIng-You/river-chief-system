import exception from './../../api/exception-service';
import {
  EXCEPTION_LIST_SUCCESS,
  EXCEPTION_LIST_FAILURE,
  EXCEPTION_FILTER_STATE,
  EXCEPTION_DETAIL_SUCCESS,
  EXCEPTION_DETAIL_FAILURE,
  EXCEPTION_ADD_SUCCESS,
  EXCEPTION_ADD_FAILURE,
  EXCEPTION_SLOVE_SUCCESS,
  EXCEPTION_SLOVE_FAILURE,
  COMMON_LOAD_DOING,
  COMMON_LOAD_DONE
} from './../mutation-types';

// initial state
const state = {
  loading: false,   // 是否正在登录状态
  model: {       // 用户模型
    RiverBaseInfoId: '',
    AreaCode: '',
    PeopleName: '',
    ExceptionType: 0,       // "0"表示异常项，"1"表示正常项
    State: -1,
    SearchDate: '',
    PollingMainItem: '',
    PageIndex: 1,
    PageSize: 9
  },
  result: null,   // 成功结果集
  error: null,    // 失败结果集
  detailResult: null,   // 异常详情成功结果集
  detailError: null,    // 异常详情失败结果集
  addModel: null, // 新增模型

  solveModel: {   // 解决模型
    Id: '',
    SolveExplain: '',
    FileList: []
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
  detailError: state => state.detailError
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
  }
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
    state.solveModel.Id = result.Data && result.Data.Id;

    if (result.IsError) {
      $Message.error({
          content: '异常详情获取失败。。。',
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

  [EXCEPTION_FILTER_STATE] (state, exceptionState) {
    state.model.State = exceptionState;
  },

  [COMMON_LOAD_DOING](state) {
      state.loading = true;
  },

  [COMMON_LOAD_DONE](state) {
      state.loading = false;
  },

  ['UPDATE_PEOPLE_NAME'] (state, value) {
    state.model.PeopleName = value;
  },
  ['UPDATE_SOLVE_EXPLAIN'] (state, value) {
    state.solveModel.SolveExplain = value;
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}