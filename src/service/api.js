module.exports = function (prefix) {
  prefix = prefix || ''
  return [
    // 登录 登出
    ['login', '/login/check', 'POST'],
    ['logout', '/user/logout', 'post'],
    ['checkSession', '/login/refresh', 'POST'],
    ['isKicked', '/user/iskickedout', 'POST'],
    ['listConst', '/enumeration/list', 'POST'], // 常量

    // 节点管理
    ['setCurNode', '/site/setcurrent', 'POST'],
    ['listNode', '/site/list', 'POST'],
    ['addSite', '/site/add', 'POST'],
    ['editSite', '/site/edit', 'POST'],
    ['delSite', '/site/delete', 'POST'],
    ['copySite', '/site/copy', 'POST'],
    ['listSiteTree', '/device/listSiteInfo', 'POST'],
    // 电视墙，录像计划，用户角色，用户 type: 'Monitor' || 'Recordplan' || 'UserRole' || 'User'

    ['setLineName', '/lines/edit', 'POST'],
    ['affiliateSites', '/sites/addSitesRelationship', 'POST'],
    ['setCurrentSite', '/settings/setCurrentSite', 'POST'],

    // 角色管理
    ['listRole', '/userRole/list', 'post'],
    ['delRole', '/userRole/delete', 'POST'],
    ['addRole', '/userRole/add', 'POST'],
    ['editRole', '/userRole/edit', 'POST'],

    // 用户优先级管理
    ['listUserLevel', '/userLevels/list', 'POST'],
    ['editUserLevel', '/userLevels/edit', 'POST'],
    ['resetLevel', '/userLevels/reset', 'POST'],
    // 驱动管理
    ['listDrive', '/driver/list', 'POST'],
    ['editDriver', '/driver/edit', 'POST'],
    ['setDriverSync', '/settings/setDriverSync', 'POST'],
    ['getDriverSync', '/settings/getDriverSync', 'POST'],
    // 用户管理
    ['listUser', '/userManage/user/list', 'POST'],
    ['delUser', '/userManage/user/delete', 'POST'],
    ['addUser', '/userManage/user/add', 'POST'],
    ['editUser', '/userManage/user/edit', 'POST'],

    ['resetPwd', '/userManage/user/resetPwd', 'POST'],
    ['resetPriv', '/userManage/user/resetPriv', 'POST'], // T:
    ['getUserPriv', '/userManage/user/getUserPriv', 'POST'], // T:
    ['kickUser', '/userManage/user/kickUser', 'POST'],
    // 系统管理
    ['listConfig', '/settings/list', 'POST'], //
    ['setConfig', '/settings/edit', 'POST'],
    ['syncData', '/settings/dataSync', 'POST'],
    ['clockSync', '/settings/clockSync', 'POST'],
    ['timingSetting', '/settings/editTimingSettings', 'POST'],
    ['listBackupFile', '/settings/backup/list', 'POST'], // 还原文件列表
    ['restore', '/settings/restore', 'POST'], // 手动还原
    ['backup', '/settings/backup', 'POST'], // 自动备份

    // 国标
    ['getGB', '/settings/getgb28181', 'POST'],
    ['setGB', '/settings/setgb28181', 'POST'],
    ['listGBStatus', '/vms/gbstatus', 'POST'],

    // 设备管理
    ['listDeviceCount', '/device/listDevicesInfo', 'POST'], // 所有设备count信息
    ['listDevice4Type', '/device/list', 'POST'], // 设备列表 根据站点和设备类型
    ['addDevice', '/device/add', 'POST'],
    ['editDevice', '/device/edit', 'POST'],
    ['delDevice', '/device/delete', 'POST'],
    ['listNotRelatedDevices', '/device/getNotRelatedDevices', 'POST'], // 获取编码器、解码器、第三方视频平台，未被使用的通道号
    ['listDriver', '/driver/list', 'POST'], // 获取驱动
    ['releasePTZ', '/device/releasePTZ', 'POST'], // 释放云台
    ['syncCameraInfo', '/device/syncCameraInfo', 'POST'], // 第三方视频平台 同步摄像机

    ['listCamera', '/devices/getAllCameras', 'POST'], // T:
    ['isRelatePickup', '/devices/isExitPickupOfCamera', 'POST'],
    ['getDriver', '/devices/getDrivers', 'GET'],
    ['hasData', '/devices/checkDataExit', 'POST'],
    ['listCoder', '/devices/getAllCoders', 'GET'],

    // 摄像机分区
    ['listZoneCameraCount', '/deviceZone/listAndCameraCount', 'POST'],
    ['listZone', '/deviceZone/list', 'POST'], // 有siteId 返回该线路的，没有返回全部节点分区
    ['listZoneAndCameraInfo', '/deviceZone/listAndCameraInfo', 'POST'],
    ['addZone', '/deviceZone/add', 'POST'],
    ['editZone', '/deviceZone/edit', 'POST'],
    ['delZone', '/deviceZone/delete', 'POST'],

    ['listCameraByZone', '/deviceZone/getCameraInZone', 'POST'], // 包含所有子分区的摄像机
    ['listCameraOfZone', '/device/getCameraByZoneId', 'POST'], // 只有该分区IID的摄像机
    ['listCameraWithoutZone', '/deviceZone/getCameraWithoutZone', 'POST'], // 未被分配分区的摄像机
    ['delCameraFromZone', '/deviceZone/removeCameraInZone', 'POST'],
    ['addCameras2Zone', '/deviceZone/addCameraInZone', 'POST'],

    ['getMap', '/deviceZone/getMap', 'POST'],
    ['addCamera2Map', '/deviceZone/addCameraToMap', 'POST'],
    ['editCameraOfMap', '/deviceZone/updateCameraInMap', 'POST'],
    ['delCamera4Map', '/deviceZone/deleteCameraFromMap', 'POST'],
    ['getCamerasNotInMap', '/deviceZone/getCamerasNotInMap', 'POST'],

    // 录像计划
    ['listPlan', '/recordplan/list', 'POST'],
    ['getPlan', '/recordplan/get', 'POST'],
    ['addPlan', '/recordplan/add', 'POST'],
    ['editPlan', '/recordplan/edit', 'POST'],
    ['delPlan', '/recordplan/delete', 'POST'],
    ['startPlan', '/recordplan/start', 'POST'],
    ['stopPlan', '/recordplan/stop', 'POST'],
    ['listDeviceWithoutPlan', '/recordplan/getCamerasWithoutPlan', 'POST'],

    // 导出
    ['exportData', '/settings/exportData', 'post', 'blob'],
    ['updatePercentage', '/settings/importData/percentage', 'post']
  ].map(function (v, idx) {
    v[1] = prefix + v[1]
    return v
  })
}
