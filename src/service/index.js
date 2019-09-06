/**
* 通用协议接口
* @param { params } params 入参
*/
export const getInfoByAgreement = (vue, params) =>  vue.$http.get('/api', { params });
/**
* 获取网关信息
*/
export const getGateWayConfig = (vue, params) =>  vue.$http.get('/api/HomeIndex/GetGateWayConfig', { params });

/**
* 获取监区分组信息
* @param { String } OrgID 监区ID
*/
export const getCriminalGroupNum = (vue, params) =>  vue.$http.get('/api/Move/GetCriminalGroupNum', { params });

/**
* 获取绑定监区
*/
export const getBindJQ = (vue, params) =>  vue.$http.get('/api/HomeIndex/GetBindJQ', { params });
