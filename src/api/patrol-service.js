import http from './../util/http';
import {
    COMMON_GET_CHILD_AREA,
    POLLING_RECORD_LIST_BY_OBJECT,
    POLLING_GET_PATROL_INFO,
    POLLING_GET_PATROL_PEOPLE,

    REPORT_GET_PHASE_REPORT,
    REPORT_GET_PHASE_REPORT_TIME,

    REPORT_GET_PHASE_LIST,
    COMMON_GET_RIVER_SYSTEMS,
    RIVER_GET_RIVER_PAGER_LIST,
    POLLING_GET_PATROL_FULL_DETAIL,
    POLLING_GET_PATROL_TRACK,
} from './constant';

export default {
    getChildArea(params) {
        return http.post(COMMON_GET_CHILD_AREA, params);
    },

    getPatrolInfo(params){
        return http.post(POLLING_GET_PATROL_INFO, params);
    },

    getInspectionRecordListByObject(params){
        return http.post(POLLING_RECORD_LIST_BY_OBJECT,params);
    },

    getPollingPeople(params){
        return http.post(POLLING_GET_PATROL_PEOPLE, params);
    },

    // 获取巡检统计报表信息
    getPhaseReport(params) {
        return http.post(REPORT_GET_PHASE_REPORT, params);
    },

    // 获取巡检统计报表信息(时间纬度)
    getPhasesReportOfTime(params) {
        return http.post(REPORT_GET_PHASE_REPORT_TIME, params);
    },

    // 获取巡检周期列表
    getPhases(params) {
        return http.post(REPORT_GET_PHASE_LIST, params);
    },

    // 获取水系列表
    getRiverSystems(params) {
        return http.post(COMMON_GET_RIVER_SYSTEMS, params);
    },

    // 获取河流列表
    getRivers(params) {
        return http.post(RIVER_GET_RIVER_PAGER_LIST, params);
    },

    // 获取巡检轨迹
    getPatrolTrack(params) {
        return http.post(POLLING_GET_PATROL_TRACK, params);
    },

    getPatrolFullDetail(params){
        return http.post(POLLING_GET_PATROL_FULL_DETAIL, params);
    }
}