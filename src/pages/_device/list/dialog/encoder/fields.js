import reg from '@/data/reg'
import {
  validateChild
} from '../../utils.js'
const _TRIGGER_ = 'blur'
export function required (model, msg, trigger) {
  return {
    validator (rule, value, callback) {
      if (value.some(item => item == '')) {
        callback(new Error(msg || '此处为必填项'))
      } else {
        callback()
      }
    },
    required () {
      return true
    },
    trigger: trigger || _TRIGGER_
  }
}
export default function (me) {
  return [{
    tag: 'el-input',
    name: 'name',
    label: '编码器名称',
    /* tip: '必填项，1 ~ 64 个字符，支持中文、英文（大小写）、整数、下划线、中线、/、. 输入', */
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
      reg.required,
      reg.ip
    ],
    createFunction: 'formItem'
  },
  {
    tag: 'el-input',
    name: 'channelNum',
    label: '通道数',
    rules: [
      reg.required,
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
      required(),
      validateChild((me.option.driverId ? me.option.driverId.list : []))
    ],
    createFunction: 'formItem'
  },
  {
    tag: 'el-input',
    name: 'port',
    label: '端口号',
    rules: [
      reg.required,
      reg.port
    ],
    createFunction: 'formItem'
  },
  {
    tag: 'el-input',
    name: 'username',
    label: '用户名',
    rules: [
      reg.required,
      reg.str64
    ],
    default: 'admin',
    createFunction: 'formItem'
  },
  {
    tag: 'el-input',
    name: 'password',
    label: '密码',
    default: 'admin',
    rules: [
      reg.password
    ],
    createFunction: 'formItem'
  },
  {
    tag: 'el-cascader',
    name: 'recordDriverId',
    label: '录像驱动类型',
    rules: [
      validateChild((me.option.recordDriverId ? me.option.recordDriverId.list : []))
    ],
    createFunction: 'formItem'
  },
  {
    tag: 'el-input',
    name: 'deviceParam',
    type: 'textarea',
    label: '设备参数',
    rules: [
      reg.str1000
    ],
    createFunction: 'formItem'
  }
  ]
}
