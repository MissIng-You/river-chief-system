import http from './../util/http';
import {
    EXCEPTION_GET_EXCEPTION_LIST,
    EXCEPTION_GET_EXCEPTION_DETAIL,
    EXCEPTION_ADD_EXCEPTION,
    EXCEPTION_SLOVE_EXCEPTION,
    EXCEPTION_GET_AREA_ROOT,
    
    POLLING_GET_ALL_POLLING_ITEM,

    RIVER_GET_REIVER_LIST_BY_AREA,
} from './constant';

export default {
    getExceptions(params) {
        return http.post(EXCEPTION_GET_EXCEPTION_LIST, params);
    },

    getDetails(params) {
        return http.post(EXCEPTION_GET_EXCEPTION_DETAIL, params);
    },

    addException(params) {
        return http.post(EXCEPTION_ADD_EXCEPTION, params);
    },

    sloveException(params) {
        return http.post(EXCEPTION_SLOVE_EXCEPTION, params);
    },
    
    getAreaRoot(params) {
        return http.post(EXCEPTION_GET_AREA_ROOT, params);
    },

    getAllPollingItem(params) {
        return http.post(POLLING_GET_ALL_POLLING_ITEM, params);
    },

    getRiversByArea(params) {
        return http.post(RIVER_GET_REIVER_LIST_BY_AREA, params);
    }
}