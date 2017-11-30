import { getAuth } from '../getters';
import user from './../../api/user-service';
import {
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAILURE,
  USER_LOGOUT,
  USER_REGISTER,
  COMMON_LOAD_DOING,
  COMMON_LOAD_DONE,
  COMMON_AUTH,

  USER_PEOPLE_SUCCESS,
  USER_PEOPLE_FAILURE
} from './../mutation-types';
import auth from './../../util/auth';

// initial state
const state = {
  loading: false,   // 是否正在登录状态
  model: {       // 用户模型
    username: '13882016776',
    password: '123456'
  },
  result: null,   // 成功结果集
  error: null,    // 失败结果集

  peopleResult: null,
  peopleError: null,
}

// getters
const getters = {
  loading: state => state.loading,
  result: state => state.result,
  error: state => state.error,
}

// actions
const actions = {

  // 用户登录
  login ({ dispatch, commit, state }, params) {
    commit(COMMON_LOAD_DOING);
    return user.login(params)
      .then(
        result => {
          let {Data: data, Message: message, IsError: isError} = result.data;
          
          commit(USER_LOGIN_SUCCESS, result.data);
        },
        error => commit(USER_LOGIN_FAILURE, error)
      );
  },

  // 获取登录用户的人员信息
  getPeopleInfo ({dispatch, commit, state}, payload) {
    commit(COMMON_LOAD_DOING);
    let {params, $Message, $router, route} = payload;
    return user.getPeopleInfo(params)
      .then(
        result => commit(USER_PEOPLE_SUCCESS, {result: result.data, $Message, $router, route}),
        error => commit(USER_PEOPLE_FAILURE, error)
      );
  },
}

// mutations
const mutations = {
  [USER_LOGIN_SUCCESS] (state, result) {
    console.log(result);
    
    state.result = result;

    let {Data: data, Message: message, IsError: isError} = result;

    if(isError) {
      state.auth = false;
      auth.logout();
      return;
    }

    state.auth = true;
    auth.setToken((data && data.AccessToken) || null);
    auth.setPermission(data || null);
  },

  [USER_PEOPLE_SUCCESS] (state, {result, $Message, $router, route}) {
    console.log(`${USER_PEOPLE_SUCCESS}: %o`, result);
    state.peopleResult = result;

    let {Data: data, Message: message, IsError: isError} = result;

    auth.setPeopleInfo(data || null);

    if (result && result.IsError) {
      $Message.error({
          content: '获取人员信息异常',
          duration: 3
      });
    }
  },

  [USER_LOGIN_FAILURE] (state, error) {
    state.error = error;
    
    state.auth = false;
    auth.logout();
  },

  [USER_PEOPLE_FAILURE] (state, error) {
    state.peopleError = error;
  },

  [COMMON_LOAD_DOING](state) {
      state.loading = true;
  },

  [COMMON_LOAD_DONE](state) {
      state.loading = false;
  },

  'UPDATE_USERNAME' (state, value) {
    state.model.username = value;
  },

  'UPDATE_PASSWORD' (state, value) {
    state.model.password = value;
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}