import T from '../query.js'
import DB from '../Factory'
export default {
  listZone (param) {
    return T.fr({
      items: []
    })
  },
  listZoneCameraCount (param) {
    return T.fr({
      items: _.cloneDeep([...Object.values(DB.Sites), ...Object.values(DB.Zones)])
    })
  },
  addZone (param) {
    return T.save(DB.Zones, param)
  },
  editZone () {
    return T.fr()
  },
  delZone () {
    return T.fr()
  },
  listCameraByZone (params) {
    return T.page(DB.Cameras, params)
  },
  /* param: {
      pageNo,
      pageSize,
      siteId
  } */
  listCameraWithoutZone (param) {
    var list = Object.values(DB.Cameras)
    return T.fr({
      total: list.length,
      items: list
    })
  },
  /* param: {
    zoneId, // TODO:
    cameras:[id....]
  } */
  delCameraFromZone () {
    return T.fr({})
  },
  /* param: {
    zoneId：'',
    cameraIds: []
  } */
  addCameras2Zone (param) {
    return T.fr({})
  },
  /* param: {
    zoneId: '',
    siteId: ''
  } */
  getMap (param) {
    return T.fr({
      data: {
        url: 'timg.jpg',
        cameras: Object.values(DB.MapCameras)
      }
    })
  },
  /* param: {
    zoneId: '',
    siteId: ''
  } */
  getCamerasNotInMap (param) {
    return {
      'retCode': 1,
      'items': Object.values(DB.NoMapCameras)
    }
  },
  /* param: { id, x, y } */
  addCamera2Map () {
    return T.fr()
  },
  /* param: { id, x, y } */
  editCameraOfMap (param) {
    return T.fr()
  },
  /* param: {id} */
  delCamera4Map (param) {
    return T.fr()
  }
}
