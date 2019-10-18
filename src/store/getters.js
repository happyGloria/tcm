const getters = {
  userId: state => state.user.userId,
  username: state => state.user.username,
  userType: state => state.user.userType,
  siteId: state => state.user.siteId,
  siteName: state => state.user.siteName,
  siteType: state => state.user.siteType,
  version: state => state.user.version,

  portTotal: state => state.device.portTotal,
  permission_routers: state => state.permission.routers,
  addRouters: state => state.permission.addRouters,
  firstNav: state => state.permission.firstNav,
  secondNav: state => state.permission.secondNav,

  activeZoneNode: state => state.zone.activeZoneNode,
  zoneTab: state => state.zone.zoneTab,

  lostCameras: state => state.device.lostCameras,
  mapCameras: state => state.device.mapCameras,

  uploadStatus: state => state.percentage.uploadStatus,
  uploadLoading: state => state.percentage.uploadLoading,
  isHideUpload: state => state.percentage.isHideUpload,
  isUploaded: state => state.percentage.isUploaded,
  ajaxing: state => state.percentage.ajaxing,
  fileList: state => state.percentage.fileList
}
export default getters
