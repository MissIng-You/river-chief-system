import http from './../util/http';
import {
    REPORT_INFO_DATA,

    REPORT_GET_PHASE_REPORT,
    REPORT_GET_PHASE_REPORT_TIME,
    DELETE_REPORT_RECORD,
    UPDATE_REPORT_CANLOOKSTATE,

} from './constant';

export default {
    //获取公众上报信息
    getReportInfo(params){
        return http.post(REPORT_INFO_DATA, params);
    },

    // 获取上报统计报表信息
    getPhaseReport(params) {
        return http.post(REPORT_GET_PHASE_REPORT, params);
    },

   // 获取上报统计报表信息(时间纬度)
    getPhasesReportOfTime(params) {
        return http.post(REPORT_GET_PHASE_REPORT_TIME, params);
    },

    //删除公众上报信息
    delReportRecord(params){
        return http.post(DELETE_REPORT_RECORD, params);
    },

    //更新公众上报可视状态
    updateReportCanLookState(params){
        return http.post(UPDATE_REPORT_CANLOOKSTATE, params);
    }
   
}