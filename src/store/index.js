import Vue from 'vue';
import Vuex from 'vuex';
import * as actions from './actions';
import * as getters from './getters';
import user from './modules/user';
import exception from './modules/exception';

import { COMMON_AUTH } from './mutation-types';
import authUtil from './../util/auth';

// import createLogger from '../../../src/plugins/logger'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export function createStore() {
    let storeConfig = {
        state: {
            auth: authUtil.loggedIn(),     // 是否授权
        },
        mutations: {
            [COMMON_AUTH] (state, isAuth) {
                state.auth = isAuth || false;
            }
        },
        actions,
        getters,
        modules: {
            user,
            exception
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