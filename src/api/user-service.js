import http from './../util/http';
import {
    USER_LOGIN,
    USER_LOGOUT,
    USER_REGISTER
} from './constant';

export default {
    login(params) {
        return http.post(USER_LOGIN, params);
    },

    register(params) {
        return http.post(USER_REGISTER, params);
    },

    logout(params) {
        return http.post(USER_LOGOUT, params);
    }
}