import reg from '@/data/reg'
import {
  validateChild
} from '../../utils.js'
export default function (me) {
  return [{
    tag: 'el-input',
    name: 'name',
    label: '解码器名称',
    rules: [
      reg.required
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
      reg.required,
      validateChild((me.option.driverId ? me.option.driverId.list : []))
    ],
    createFunction: 'formItem'
  },
  {
    tag: 'el-input',
    name: 'port',
    label: '端口号',
    tip: '必填项，请输入1 ~ 65535范围内的整数',
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
    createFunction: 'formItem'
  },
  {
    tag: 'el-input',
    name: 'password',
    label: '密码',
    rules: [
      reg.password
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
    tag: 'el-input',
    name: 'maxWindow',
    label: '单通道最大画面数',
    default: '1',
    rules: [
      reg.required,
      reg.num99
    ],
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
