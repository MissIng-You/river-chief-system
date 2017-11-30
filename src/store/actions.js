import * as types from './mutation-types'

export const loading = ({commit}) => {
  commit(types.COMMON_LOAD_DOING);
}

export const loaded = ({commit}) => {
  commit(types.COMMON_LOAD_DONE);
}

export const auth = ({commit}, isAuth) => {
  commit(types.COMMON_AUTH, isAuth);
}

// 处理公用错误，并附带提示信息
export const error = ({commit}, payload) => {
  commit('COMMON_ERROR', payload);
}

// 更新State下面的模型值
export const updateModel = ({commit}, payload) => {
  commit('UPDATE_MODEL', payload);
}