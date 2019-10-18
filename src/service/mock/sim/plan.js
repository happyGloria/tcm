import T from '../query.js'
export default {
  listPlan (param) {
    var items = [{
      'siteId': '9710',
      'id': '9710-RecordPlan-录像计划-1',
      'name': '存储计划1',
      'from': '00:00',
      'to': '24:00',
      'storageId': 'storage-1',
      'storageName': '存储服务2',
      'circle': 15,
      'streamMode': 2,
      'days': 'all',
      'cameras': [{
        'id': '4',
        'name': '摄像机-4',
        'deviceSubType': '1',
        'zoneName': '11'
      }, {
        'id': '5',
        'name': '摄像机-5',
        'deviceSubType': '2',
        'zoneName': '11'
      }]
    }, {
      'siteId': '9710',
      'id': '9710-RecordPlan-录像计划-1',
      'name': '存储计划1',
      'from': '00:00',
      'to': '24:00',
      'storageId': 'storage-2',
      'storageName': '存储服务2',
      'circle': 15,
      'streamMode': 2,
      'days': 'all',
      'cameras': [{
        'id': '7',
        'name': '摄像机-7',
        'deviceSubType': '1',
        'zoneName': '22'
      }, {
        'id': '8',
        'name': '摄像机-8',
        'deviceSubType': '2',
        'zoneName': '22'
      }]
    }]
    if (param.id) {
      return {
        'retCode': 1,
        'items': items[0]
      }
    }
    return {
      'retCode': 1,
      'items': items,
      'total': 1
    }
  },
  getPlan () {
    return T.fr()
  },
  addPlan () {
    return T.fr()
  },
  editPlan () {
    return T.fr()
  },
  delPlan () {
    return T.fr()
  },
  listDeviceWithoutPlan () {
    return {
      'retCode': 1,
      'total': 2,
      'items': {
        'storages': [{
          'id': 'storage-1',
          'name': '存储服务器1',
          'ip': '192.168.1.1'
        }, {
          'id': 'storage-2',
          'name': '存储服务器-2',
          'ip': '192.168.1.2'
        }, {
          'id': 'storage-3',
          'name': '存储服务器-3',
          'ip': '192.168.1.3'
        }],
        'cameras': [
          { 'id': '1', 'name': '摄像机-1', 'deviceSubType': '1', 'zoneName': '11' },
          { 'id': '2', 'name': '摄像机-2', 'deviceSubType': '2', 'zoneName': '11' },
          { 'id': '3', 'name': '摄像机-3', 'deviceSubType': '3', 'zoneName': '33' },
          { 'id': '20', 'name': '摄像机-20', 'deviceSubType': '3', 'zoneName': '33' },
          { 'id': '21', 'name': '摄像机-21', 'deviceSubType': '3', 'zoneName': '33' },
          { 'id': '22', 'name': '摄像机-22', 'deviceSubType': '3', 'zoneName': '33' },
          { 'id': '23', 'name': '摄像机-23', 'deviceSubType': '3', 'zoneName': '33' },
          { 'id': '24', 'name': '摄像机-24', 'deviceSubType': '3', 'zoneName': '33' },
          { 'id': '25', 'name': '摄像机-25', 'deviceSubType': '3', 'zoneName': '33' },
          { 'id': '26', 'name': '摄像机-26', 'deviceSubType': '3', 'zoneName': '33' },
          { 'id': '27', 'name': '摄像机-27', 'deviceSubType': '3', 'zoneName': '33' },
          { 'id': '28', 'name': '摄像机-28', 'deviceSubType': '3', 'zoneName': '33' },
          { 'id': '29', 'name': '摄像机-29', 'deviceSubType': '3', 'zoneName': '33' },
          { 'id': '30', 'name': '摄像机-30', 'deviceSubType': '3', 'zoneName': '33' },
          { 'id': '20', 'name': '摄像机-20', 'deviceSubType': '3', 'zoneName': '33' },
          { 'id': '31', 'name': '摄像机-31', 'deviceSubType': '3', 'zoneName': '33' },
          { 'id': '32', 'name': '摄像机-32', 'deviceSubType': '3', 'zoneName': '33' },
          { 'id': '33', 'name': '摄像机-33', 'deviceSubType': '3', 'zoneName': '33' },
          { 'id': '34', 'name': '摄像机-34', 'deviceSubType': '3', 'zoneName': '33' },
          { 'id': '35', 'name': '摄像机-35', 'deviceSubType': '3', 'zoneName': '33' },
          { 'id': '36', 'name': '摄像机-36', 'deviceSubType': '3', 'zoneName': '33' },
          { 'id': '37', 'name': '摄像机-37', 'deviceSubType': '3', 'zoneName': '33' },
          { 'id': '38', 'name': '摄像机-38', 'deviceSubType': '3', 'zoneName': '33' },
          { 'id': '39', 'name': '摄像机-39', 'deviceSubType': '3', 'zoneName': '33' },
          { 'id': '40', 'name': '摄像机-40', 'deviceSubType': '3', 'zoneName': '33' },
          { 'id': '41', 'name': '摄像机-41', 'deviceSubType': '3', 'zoneName': '33' },
          { 'id': '42', 'name': '摄像机-42', 'deviceSubType': '3', 'zoneName': '33' },
          { 'id': '43', 'name': '摄像机-43', 'deviceSubType': '3', 'zoneName': '33' },
          { 'id': '44', 'name': '摄像机-44', 'deviceSubType': '3', 'zoneName': '33' },
          { 'id': '45', 'name': '摄像机-45', 'deviceSubType': '3', 'zoneName': '33' },
          { 'id': '46', 'name': '摄像机-46', 'deviceSubType': '3', 'zoneName': '33' },
          { 'id': '47', 'name': '摄像机-47', 'deviceSubType': '3', 'zoneName': '33' },
          { 'id': '48', 'name': '摄像机-48', 'deviceSubType': '3', 'zoneName': '33' },
          { 'id': '49', 'name': '摄像机-49', 'deviceSubType': '3', 'zoneName': '33' },
          { 'id': '50', 'name': '摄像机-50', 'deviceSubType': '3', 'zoneName': '33' }
        ]
      }
    }
  }
}
