import http from './../util/http';
import config from '../config/config';
import {
    COMMON_UPLOAD_FILE,
    USER_PEOPLE_INFO,

    COMMON_GET_CHILD_AREA,
    COMMON_GET_RIVER_SYSTEMS,
    RIVER_GET_RIVER_PAGER_LIST,
} from './constant';

export default {
    // 公用文件上传
    upload(params) {
        return http.post(COMMON_UPLOAD_FILE, params);
    },

    // 获取登录用户的公用信息
    getPeopleInfo(params) {
        return http.post(USER_PEOPLE_INFO, params);
    },

    // 获取子集地区
    getChildArea(params) {
        return http.post(COMMON_GET_CHILD_AREA, params);
    },

    // 获取水系列表
    getRiverSystems(params) {
        return http.post(COMMON_GET_RIVER_SYSTEMS, params);
    },

    // 获取河流列表
    getRivers(params) {
        return http.post(RIVER_GET_RIVER_PAGER_LIST, params);
    },

    // 获取上次文件路径
    getUploadUrl() {
        return `${config.apiServer}${COMMON_UPLOAD_FILE}`;
    }
}