import reg from '@/data/reg'
import { validateChild } from '../../utils.js'
/** 通过接入方式判定
 * 1. 数字摄像机 通道号=1，不可编辑； 通道参数隐藏
 * 2. 编码器，第三方视频平台 通道号，通道参数均可显示和编辑
 */
let _TRIGGER_ = 'change'
let required = function (model, msg, trigger) {
  return {
    validator (rule, value, callback) {
      let isRequired = model.accessType === 'dv'
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
      return model.accessType == 'dv'
    },
    trigger: trigger || _TRIGGER_
  }
}

export default function (me) {
  return [
    {
      tag: 'el-select',
      name: 'accessType',
      label: '摄像机接入方式',
      rules: [reg.required],
      data: {
        props: {
          disabled: !!me.model.id
        }
      },
      change (val) {
        me.model.accessType = val
        this.model.encoderId = ''
        this.model.channelNo = ''
        me.getNotRelatedDevices()
      },
      createFunction: 'formItem'
    },
    {
      tag: 'el-input',
      name: 'name',
      label: '摄像机名称',
      rules: [reg.required, reg.str64],
      createFunction: 'formItem'
    },
    {
      tag: 'el-select',
      name: 'deviceSubType',
      label: '摄像机类型',
      default: '1',
      rules: [reg.required],
      data: {
        props: {
          disabled: (function () {
            return (
              me.activeNode && me.activeNode.id !== 'Camera'
            ) /*  || !$.isEmptyFn(me.model.id) */
          })()
        }
      },
      createFunction: 'formItem'
    },
    {
      tag: 'el-select',
      name: 'encoderId',
      label: '关联编码器（平台）ID',
      tip: '请先选择关联编码器（平台）ID，再选择通道编号',
      rules: [reg.required],
      change (val) {
        me.model.encoderId = val
        me.model.channelNo = ''
        me.setChannelNoList()
      },
      show: () => {
        return me.model.accessType != 'dv'
      },
      createFunction: 'formItem'
    },
    {
      tag: 'el-select',
      name: 'channelNo',
      label: '通道号',
      rules: [reg.required],
      data: {
        props: {
          disabled: me.model.accessType == 'dv'
        }
      },
      createFunction: 'formItem'
    },
    {
      tag: 'el-input',
      name: 'ip',
      label: 'IP地址',
      rules: [reg.required, reg.ip],
      show: () => {
        return me.model.accessType == 'dv'
      },
      createFunction: 'formItem'
    },
    {
      tag: 'el-cascader',
      name: 'driverId',
      label: '驱动类型',
      tip: '添加设备时，此值改变，用户名、密码、端口号会自动填充默认值',
      rules: [
        required(me.model),
        validateChild(me.option.driverId ? me.option.driverId.list : [])
      ],
      change (val) {
        if (val.length == 2) {
          var { port, username, password } = me.driverHT[val[1]]
          me.model.port = port
          me.model.username = username
          me.model.password = password
        }
      },
      show () {
        return me.model.accessType == 'dv'
      },
      createFunction: 'formItem'
    },
    {
      tag: 'el-input',
      name: 'port',
      label: '端口号',
      tip: '必填项，请输入1 ~ 65535范围内的整数',
      rules: [reg.required, reg.port],
      show: () => {
        return me.model.accessType == 'dv'
      },
      createFunction: 'formItem'
    },
    {
      tag: 'el-input',
      name: 'username',
      label: '用户名',
      show: () => {
        return me.model.accessType == 'dv'
      },
      rules: [reg.required, reg.str64],
      createFunction: 'formItem'
    },
    {
      tag: 'el-input',
      name: 'password',
      label: '密码',
      show: () => {
        return me.model.accessType == 'dv'
      },
      rules: [reg.password],
      createFunction: 'formItem'
    },
    {
      tag: 'el-input',
      name: 'mappingId',
      label: '编号',
      tip: ['此标识用于键盘上墙的映射ID，需保证节点内唯一'],
      rules: [reg.str20],
      createFunction: 'formItem'
    },
    {
      tag: 'el-switch',
      name: 'audio',
      label: '接入拾音器',
      default: 0,
      data: {
        props: {
          activeValue: 1,
          inactiveValue: 0
        }
      },
      createFunction: 'formItem'
    },
    {
      tag: 'el-cascader',
      name: 'zoneId',
      label: '所属分区',
      createFunction: 'formItem',
      data: {
        props: {
          clearable: true
        }
      },
      rules: [
        {
          validator (rule, value, callback) {
            if (value[0] == -1) {
              callback()
            } else {
              callback()
            }
          }
        }
      ]
    },
    {
      tag: 'el-input',
      name: 'channelParam',
      label: '通道参数',
      rules: [reg.str128],
      createFunction: 'formItem'
    },
    {
      tag: 'el-input',
      name: 'channelAddr',
      label: '通道地址',
      show: () => {
        return me.model.accessType != 'dv'
      },
      rules: [reg.str64],
      createFunction: 'formItem'
    },
    {
      tag: 'el-input',
      type: 'textarea',
      name: 'deviceParam',
      label: '设备参数',
      rules: [reg.str1000],
      createFunction: 'formItem'
    },
    {
      tag: 'el-input',
      name: 'multicastIp',
      label: '组播IP',
      tip: '选填项，遵循IPv4规范',
      rules: [reg.ip],
      createFunction: 'formItem'
    },
    {
      tag: 'el-input',
      name: 'multicastPort',
      label: '组播端口',
      tip: '选填项，请输入1 ~ 65535范围内的整数',
      rules: [reg.port],
      createFunction: 'formItem'
    },
    {
      tag: 'el-cascader',
      name: 'recordDriverId',
      label: '录像驱动类型',
      show: () => {
        return me.model.accessType == 'dv'
      },
      rules: [
        validateChild(
          me.option.recordDriverId ? me.option.recordDriverId.list : []
        )
      ],
      createFunction: 'formItem'
    },
    {
      tag: 'el-switch',
      name: 'share',
      label: '是否共享上级',
      default: 1,
      data: {
        props: {
          activeValue: 1,
          inactiveValue: 0
        }
      },
      createFunction: 'formItem'
    }
  ]
}
