import http from './../util/http';
import {
    RIVER_INFO_DATA,
    RIVER_STATISTIC_INFO_DATA,
    
} from  './constant';

export default{
    //获取河流信息
    getRiverInfo(params){
        return http.post(RIVER_INFO_DATA, params);
    },

    //获取河流统计信息
    getRiverStatisticInfo(params){
        return http.post(RIVER_STATISTIC_INFO_DATA, params);
    }
    
}
