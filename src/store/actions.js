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