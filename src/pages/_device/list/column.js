var DeviceGridCfgs = {
  'default': 'deviceType,name,ip,gbId',
  'Server': 'deviceSubType,name,ip,port,driverId,gbId',
  'Camera': 'deviceSubType,accessType,name,ip,channelNo,driverInfo,port,gbId,audio',
  'Encoder': 'name,ip,channelNum,driverInfo,port,username,gbId',
  'Decoder': 'name,ip,channelNum,maxWindow,driverInfo,port,username,gbId',
  'Keyboard': 'name,ip,port,username,driverInfo,gbId'
}
function getColumnDict (ColumnKey) {
  return {
    accessType: {
      name: '接入方式',
      sortable: true,
      minWidth: 110,
      format: (value) => {
        return $.v2str('accessType', value)
      }
    },
    deviceType: {
      name: '设备类型',
      sortable: true,
      format: (value) => {
        return `<i class="icon icon-${value}"></i>` + $.v2str('deviceType', value)
      }
    },
    deviceSubType: {
      name: '设备类型',
      minWidth: 120,
      sortable: true,
      format: (value) => {
        if (ColumnKey == 'Camera') {
          return `<i class="icon icon-Camera-${value}" style=""></i>` + $.v2str('cameraType', value)
        } else if (ColumnKey == 'Server') {
          return `<i class="icon icon-server"></i>` + $.v2str('deviceType', value)
        }
        return $.v2str('deviceType', value)
      }
    },
    driverInfo: {
      name: '驱动类型',
      format: (val) => {
        return Util.isEmptyFn(val) ? '--' : val
      }
    },
    name: {
      name: '设备名称',
      minWidth: 120,
      sortable: true
    },
    ip: {
      name: '设备IP',
      minWidth: 120
    },
    port: {
      name: '端口号',
      format: (val) => {
        return Util.isEmptyFn(val) ? '--' : val
      }
    },
    mappingId: {
      name: '映射ID'
    },
    channelNo: {
      name: '通道号'
    },
    zoneName: {
      name: '分区名称'
    },
    channelNum: {
      name: '通道总数'
    },
    maxWindow: {
      name: '单通道最大画面数'
    },
    username: {
      name: '用户名'
    },
    password: {
      name: '密码'
    },
    gbId: {
      name: '国标编号',
      format: (value) => Util.isEmptyFn(value) ? '--' : value
    },
    audio: {
      name: '拾音器',
      format: (val) => `<i class="icon icon-${val == 1 ? 'selected' : 'unselected'}"></i>`
    }
  }
}
export function getColumn (type) {
  var pre = { type: 'index', name: '序号', width: '50', minWidth: '50' },
    columnDict = getColumnDict(type),
    columns = [pre],
    specialCols = (DeviceGridCfgs[type] || DeviceGridCfgs.default)
  specialCols.split(',').forEach(colName => {
    for (var key in columnDict) {
      if (key == colName) {
        columns.push(Object.assign({}, { key }, columnDict[key]))
        break
      }
    }
  })
  // console.log('columns', columns)
  return columns
}
