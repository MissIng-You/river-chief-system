import Vue from 'vue';
import Vuex from 'vuex';
import * as actions from './actions';
import * as getters from './getters';
import user from './modules/user';
import exception from './modules/exception';
import patrol from './modules/patrol';

import { 
    COMMON_AUTH,
    COMMON_PERMISSION
 } from './mutation-types';
import authUtil from './../util/auth';

// import createLogger from '../../../src/plugins/logger'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export function createStore() {
    let storeConfig = {
        state: {
            auth: authUtil.loggedIn(),     // 是否授权
            permission: authUtil.getPermission(),   // 获取权限信息
        },
        mutations: {
            [COMMON_AUTH] (state, isAuth) {
                state.auth = isAuth || false;
            },
            [COMMON_PERMISSION] (state, permission) {
                state.permission = permission || {};
            }
        },
        actions,
        getters,
        modules: {
            user,
            exception,
            patrol,
        },
        strict: debug,
        //   plugins: debug ? [createLogger()] : []
    };
    let store = new Vuex.Store(storeConfig);

    // import('./modules/user').then(userModule => {
    //     store.registerModule('user', userModule);
    // });

    return store;
}