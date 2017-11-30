/** 用户模块 */
export const USER_LOGIN = '/User/UserLogin';
export const USER_LOGOUT = '/User/UserLogout';
export const USER_REGISTER = '/User/Register';
export const USER_PEOPLE_INFO = '/User/GetPeopleAreaInfo';

/** 异常模块 */
export const EXCEPTION_GET_EXCEPTION_LIST = '/Inspection/GetReportPagerList2';
export const EXCEPTION_GET_EXCEPTION_DETAIL = '/Inspection/GetReportDetail2';
export const EXCEPTION_ADD_EXCEPTION = '/Inspection/AddReportInfoByReachId';
export const EXCEPTION_SOLVE_EXCEPTION = '/Inspection/AddSolveExceptionsRecord';
export const EXCEPTION_GET_AREA_ROOT = '/Exceptions/GetAddExceptionAreaRoot';
export const EXCEPTION_GET_POLLING_ITEM = '/Inspection/GetInspectionItemByReachId';

/** 巡检模块 */
export const POLLING_GET_ALL_POLLING_ITEM = '/Polling/GetAllPollingItem';
export const POLLING_GET_PATROL_INFO = '/Report/GetObjectCurrentPhaseInspectionReport';
export const POLLING_GET_PATROL_PEOPLE = '/Inspection/GetPeopleListByObject';
export const POLLING_RECORD_LIST_BY_OBJECT = '/Inspection/GetInspectionRecordListByObject';
export const POLLING_GET_PATROL_FULL_DETAIL = '/Inspection/GetInspectionRecordFullDetail';
export const POLLING_GET_PATROL_TRACK = '/Inspection/GetInspectionTrackList';


/** 报表接口 */
export const REPORT_GET_PHASE_REPORT = '/Report/GetPhaseReportByArea';
export const REPORT_GET_PHASE_REPORT_TIME = '/Report/GetPhasesInspectSituationReportByArea';
export const REPORT_GET_PHASE_LIST = '/Report/GetPhaseList';

/** 河流模块 */
export const RIVER_GET_REIVER_LIST_BY_AREA = '/River/GetRiverListByArea';
export const RIVER_GET_RIVER_PAGER_LIST = '/River/GetRiverPagerList';

/** 河段模块 */
export const REACH_GET_REACH_LIST_BY_AREA_AND_RIVER = '/Reach/GetReachListByAreaNRiver';

/** 公共模块 */
export const COMMON_GET_RIVER_SYSTEMS = '/BaseInfo/GetRiverSystemList';
export const COMMON_GET_CHILD_AREA = '/Common/GetChildArea';
export const COMMON_UPLOAD_FILE = '/Common/UploadFile?accessToken=&fileType=0';

//公众上报模块
export const REPORT_INFO_DATA = '/WeChat/GetMassesReportList';
export const DELETE_REPORT_RECORD = '/WeChat/DeleteReportById';
export const UPDATE_REPORT_CANLOOKSTATE ='/WeChat/UpdateReportCanLookById';

//基础信息模块
export const RIVER_INFO_DATA = '/BaseInfo/GetRiverPagerListWhitThroughArea';
export const RIVER_STATISTIC_INFO_DATA = '/BaseInfo/GetRiverStatisticInfo';