import http from './../util/http';
import {
    EXCEPTION_GET_EXCEPTION_LIST,
    EXCEPTION_GET_EXCEPTION_DETAIL,
    EXCEPTION_ADD_EXCEPTION,
    EXCEPTION_SOLVE_EXCEPTION,
    EXCEPTION_GET_AREA_ROOT,
    EXCEPTION_GET_POLLING_ITEM,
    
    POLLING_GET_ALL_POLLING_ITEM,

    RIVER_GET_REIVER_LIST_BY_AREA,

    REACH_GET_REACH_LIST_BY_AREA_AND_RIVER,

    COMMON_GET_CHILD_AREA
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

    solveException(params) {
        return http.post(EXCEPTION_SOLVE_EXCEPTION, params);
    },
    
    getAreaRoot(params) {
        return http.post(EXCEPTION_GET_AREA_ROOT, params);
    },

    getAllPollingItem(params) {
        return http.post(POLLING_GET_ALL_POLLING_ITEM, params);
    },

    getRiversByArea(params) {
        return http.post(RIVER_GET_REIVER_LIST_BY_AREA, params);
    },

    getChildArea(params) {
        return http.post(COMMON_GET_CHILD_AREA, params);
    },
    getReach(params) {
        return http.post(REACH_GET_REACH_LIST_BY_AREA_AND_RIVER, params);
    },
    getPolingItem(params) {
        return http.post(EXCEPTION_GET_POLLING_ITEM, params)
    }
}