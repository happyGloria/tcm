import reg from '@/data/reg'
import {
  validateChild
} from '../../utils.js'
function isShow (type) {
  // 视频分析服务器，视频诊断服务器, 云存储服务器, 第三方视频平台 上、下级 国标 显示某些字段
  return ['VideoAnalysis', 'VideoDiagnose', 'CloudStorage', 'VideoPlatform'].indexOf(type) > -1
}
let _TRIGGER_ = 'change'
let required = function (model, msg, trigger, requireFlag) {
  return {
    validator (rule, value, callback) {
      let isRequired = requireFlag
      if (isRequired) {
        if (value === '' || value === undefined) {
          callback(new Error(msg || '此处为必填项'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    },
    required () {
      return requireFlag
    },
    trigger: trigger || _TRIGGER_
  }
}
export default function (me) {
  return [{
    tag: 'el-select',
    name: 'deviceSubType',
    default: 'TNM',
    label: '服务器类型',
    rules: [
      reg.required
    ],
    data: {
      props: {
        disabled: (function () {
          return (me.activeNode && me.activeNode.id !== 'Server') || !$.isEmptyFn(me.model.id)
        })()
      }
    },
    change (val) {
      me.model.deviceSubType = val
      me.listDriver()
      me.model.port = me.defaultPorts[val] ? me.defaultPorts[val] : ''
    },
    createFunction: 'formItem'
  },
  {
    tag: 'el-input',
    name: 'name',
    label: '服务器名称',
    rules: [
      reg.required,
      reg.str64
    ],
    createFunction: 'formItem'
  },
  {
    tag: 'el-input',
    name: 'ip',
    label: 'IP地址',
    rules: [
      required(me.model, null, null, !(['SubordinateGB'].indexOf(me.model.deviceSubType) > -1)), // 除了下级国标平台之外，都为必填项
      reg.ip
    ],
    createFunction: 'formItem'
  },
  {
    tag: 'el-input',
    name: 'channelNum',
    label: '通道数',
    // tip: '必填项，请输入1 ~ 99999范围内的整数',
    show: () => {
      return me.model.deviceSubType == 'VideoPlatform'
    },
    rules: [
      required(me.model, null, null, me.model.deviceSubType == 'VideoPlatform'),
      reg.num99999
    ],
    children: [{
      tag: 'template',
      data: {
        slot: 'append'
      },
      children: ['个']
    }],
    createFunction: 'formItem'
  },
  {
    tag: 'el-cascader',
    name: 'driverId',
    label: '驱动类型',
    show: () => {
      return isShow(me.model.deviceSubType)
    },
    tip: '添加设备时，此值改变，用户名、密码、端口号会自动填充默认值',
    change (val) {
      if (val.length == 2) {
        var {
          port,
          username,
          password
        } = me.driverHT[val[1]]
        me.model.port = port
        me.model.username = username
        me.model.password = password
      }
    },
    rules: [
      validateChild((me.option.driverId ? me.option.driverId.list : []))
    ],
    createFunction: 'formItem'
  },
  {
    tag: 'el-input',
    name: 'port',
    label: '端口号',
    tip: '选填项，请输入1 ~ 65535范围内的整数',
    rules: [
      // required(me.model, null, null, !(['SuperiorGB', 'SubordinateGB'].indexOf(me.model.deviceSubType) > -1)) ,
      reg.port
    ],
    createFunction: 'formItem'
  },
  {
    tag: 'el-input',
    name: 'httpPort',
    label: 'web服务端口号',
    default: '8080',
    show: () => {
      return me.model.deviceSubType == 'TVS'
    },
    rules: [
      reg.port
    ],
    createFunction: 'formItem'
  },
  {
    tag: 'el-input',
    name: 'username',
    label: '用户名',
    rules: [
      reg.str64
    ],
    show: () => {
      return isShow(me.model.deviceSubType)
    },
    createFunction: 'formItem'
  },
  {
    tag: 'el-input',
    name: 'password',
    label: '密码',
    tip: '选填，密码由数字、字母、下划线组成，长度为1~30位',
    rules: [
      reg.password
    ],
    show: () => {
      return isShow(me.model.deviceSubType)
    },
    createFunction: 'formItem'
  },
  {
    tag: 'el-input',
    type: 'textarea',
    name: 'deviceParam',
    label: '设备参数',
    rules: [
      reg.str1000
    ],
    createFunction: 'formItem'
  }
  ]
}
