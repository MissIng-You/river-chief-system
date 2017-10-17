import user from './../../api/user-service';
import {
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAILURE,
  USER_LOGOUT,
  USER_REGISTER,
  COMMON_LOAD_DOING,
  COMMON_LOAD_DONE,
  COMMON_AUTH
} from './../mutation-types';
import auth from './../../util/auth';

// initial state
const state = {
  loading: false,   // 是否正在登录状态
  model: {       // 用户模型
    username: '13084399880',
    password: 'a123456'
  },
  result: null,   // 成功结果集
  error: null    // 失败结果集
}

// getters
const getters = {
  loading: state => state.loading,
  result: state => state.result,
  error: state => state.error,
}

// actions
const actions = {
  login ({ dispatch, commit, state }, params) {
    commit(COMMON_LOAD_DOING);

    return user.login(params)
      .then(
        result => {
          let {Data: data, Message: message, IsError: isError} = result.data;
          
          commit(USER_LOGIN_SUCCESS, result.data)
        },
        error => commit(USER_LOGIN_FAILURE, error)
      );
  }
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

  [USER_LOGIN_FAILURE] (state, error) {
    state.error = error;
    
    state.auth = false;
    auth.logout();
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