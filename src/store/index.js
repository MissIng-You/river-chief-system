import Vue from 'vue';
import Vuex from 'vuex';
import * as actions from './actions';
import * as getters from './getters';
import common from './modules/common';
import user from './modules/user';
import exception from './modules/exception';
import patrol from './modules/patrol';
import report from './modules/report';
import river from './modules/river';

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
            },

            // 更新查询模型字段
            ['UPDATE_MODEL'] (state, {model, key, value}) {
                state[model][key] = value;
            },

            // 处理统一的错误信息
            ['COMMON_ERROR'] (state, {key, value}) {
                console.log(`${key}: %o`, value);
                state[key] = value;

                // 跳转，处理统一错误提示
            },
        },
        actions,
        getters,
        modules: {
            common,
            user,
            exception,
            patrol,
            report,
            river,
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