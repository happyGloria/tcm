import reg from '@/data/reg'
export default function (me) {
  return [
    {
      tag: 'el-input',
      name: 'gbId',
      label: '国标编号',
      tip: '必填，请输入13或20位长度的数字',
      rules: [
        reg.required,
        reg.gbId2
      ],
      createFunction: 'formItem'
    },
    {
      tag: 'el-input',
      name: 'gbName',
      label: '名称',
      rules: [
        reg.str64
      ],
      createFunction: 'formItem'
    },
    {
      tag: 'el-input',
      name: 'gbPassword',
      label: '密码',
      rules: [
        reg.password
      ],
      createFunction: 'formItem'
    },
    {
      tag: 'el-switch',
      name: 'keepAlive',
      label: '是否检测心跳',
      default: 1,
      data: {
        props: {
          activeValue: 1,
          inactiveValue: 0
        }
      },
      createFunction: 'formItem'
    },
    {
      tag: 'el-input',
      name: 'interval',
      label: '心跳间隔时间',
      default: '15',
      rules: [
        reg.num3600
      ],
      show: () => {
        return me.model.keepAlive == 1
      },
      children: [{
        tag: 'template',
        data: {
          slot: 'append'
        },
        children: ['秒']
      }],
      createFunction: 'formItem'
    },
    {
      tag: 'el-input',
      name: 'times',
      label: '心跳检测次数',
      default: '3',
      rules: [
        reg.num100
      ],
      show: () => {
        return me.model.keepAlive == 1
      },
      children: [{
        tag: 'template',
        data: {
          slot: 'append'
        },
        children: ['次']
      }],
      createFunction: 'formItem'
    },
    {
      tag: 'el-switch',
      name: 'auth',
      label: '是否鉴权',
      default: 1,
      data: {
        props: {
          activeValue: 1,
          inactiveValue: 0
        }
      },
      createFunction: 'formItem'
    },
    {
      tag: 'el-switch',
      name: 'adjustTime',
      label: '是否校时',
      default: 1,
      data: {
        props: {
          activeValue: 1,
          inactiveValue: 0
        }
      },
      createFunction: 'formItem'
    },
    // 流媒体
    {
      tag: 'el-input',
      name: 'period',
      label: '注册有效期',
      default: '30',
      rules: [
        reg.num1000
      ],
      show: () => {
        return ['VideoAnalysis', 'VideoDiagnose', 'SuperiorGB'].indexOf(me.model.deviceSubType) > -1
      },
      children: [{
        tag: 'template',
        data: {
          slot: 'append'
        },
        children: ['天']
      }],
      createFunction: 'formItem'
    },
    {
      tag: 'el-select',
      name: 'safetyWay',
      label: '信令安全模式',
      default: '0',
      show: () => {
        return ['VideoAnalysis', 'VideoDiagnose', 'SuperiorGB'].indexOf(me.model.deviceSubType) > -1
      },
      createFunction: 'formItem'
    },
    {
      tag: 'el-select',
      name: 'registerWay',
      label: '注册方式',
      show: () => {
        return ['VideoAnalysis', 'VideoDiagnose', 'SuperiorGB'].indexOf(me.model.deviceSubType) > -1
      },
      createFunction: 'formItem'
    },
    {
      tag: 'el-input',
      name: 'rtpSendPort',
      label: 'RTP发送端口',
      rules: [
        reg.port
      ],
      show: () => {
        return me.model.deviceSubType == 'TFS'
      },
      default: '16000',
      createFunction: 'formItem'
    },
    {
      tag: 'el-input',
      name: 'recvIp',
      label: '数据接受IP',
      rules: [
        reg.ip
      ],
      show: () => {
        return me.model.deviceSubType == 'TFS'
      },
      createFunction: 'formItem'
    },
    {
      tag: 'el-input',
      name: 'sendIp',
      label: '数据发送IP',
      rules: [
        reg.ip
      ],
      show: () => {
        return me.model.deviceSubType == 'TFS'
      },
      createFunction: 'formItem'
    },
    {
      tag: 'el-switch',
      name: 'use',
      label: '是否启用',
      default: 1,
      data: {
        props: {
          activeValue: 1,
          inactiveValue: 0
        }
      },
      show: () => {
        return ['VideoAnalysis', 'VideoDiagnose', 'TFS', 'SuperiorGB'].indexOf(me.model.deviceSubType) > -1
      },
      createFunction: 'formItem'
    },
    {
      tag: 'el-switch',
      name: 'tcp',
      label: '是否采用TCP',
      default: 1,
      data: {
        props: {
          activeValue: 1,
          inactiveValue: 0,
          activeText: '开',
          inactiveText: '关'
        }
      },
      show () {
        return ['VideoAnalysis', 'VideoDiagnose', 'SuperiorGB'].indexOf(me.model.deviceSubType) > -1
      },
      createFunction: 'formItem'
    },
    {
      tag: 'el-input',
      name: 'number',
      label: '每次传送数量',
      default: '1000',
      rules: [
        reg.num99999
      ],
      show () {
        return ['VideoAnalysis', 'VideoDiagnose', 'SuperiorGB'].indexOf(me.model.deviceSubType) > -1
      },
      createFunction: 'formItem'
    },
    {
      tag: 'el-switch',
      name: 'alwaysTrans',
      label: '是否强制转码',
      default: 1,
      data: {
        props: {
          activeValue: 1,
          inactiveValue: 0
        }
      },
      show: () => {
        return me.model.deviceSubType == 'TFS'
      },
      createFunction: 'formItem'
    },
    {
      tag: 'el-switch',
      name: 'streamReuse',
      label: '是否流复用',
      default: 1,
      data: {
        props: {
          activeValue: 1,
          inactiveValue: 0
        }
      },
      show: () => {
        return me.model.deviceSubType == 'TFS'
      },
      createFunction: 'formItem'
    },
    {
      tag: 'el-switch',
      name: 'extractEnable',
      label: '是否加速转码',
      default: 1,
      data: {
        props: {
          activeValue: 1,
          inactiveValue: 0
        }
      },
      show: () => {
        return me.model.deviceSubType == 'TFS'
      },
      createFunction: 'formItem'
    },
    {
      tag: 'el-switch',
      name: 'gpuEnable',
      label: '是否采用GPU编码',
      default: 1,
      data: {
        props: {
          activeValue: 1,
          inactiveValue: 0
        }
      },
      show: () => {
        return me.model.deviceSubType == 'TFS'
      },
      createFunction: 'formItem'
    },
    {
      tag: 'el-switch',
      name: 'rtcpEnable',
      label: '是否开启RTCP',
      default: 1,
      data: {
        props: {
          activeValue: 1,
          inactiveValue: 0
        }
      },
      show: () => {
        return me.model.deviceSubType == 'TFS'
      },
      createFunction: 'formItem'
    },
    {
      tag: 'el-switch',
      name: 'rtcpUpEnable',
      label: '是否检测上级RTCP',
      default: 1,
      data: {
        props: {
          activeValue: 1,
          inactiveValue: 0
        }
      },
      show: () => {
        return me.model.deviceSubType == 'TFS' && me.model.rtcpEnable == 1
      },
      createFunction: 'formItem'
    },
    {
      tag: 'el-switch',
      name: 'rtcpDownEnale',
      label: '是否检测下级RTCP',
      default: 1,
      data: {
        props: {
          activeValue: 1,
          inactiveValue: 0
        }
      },
      show: () => {
        return me.model.deviceSubType == 'TFS' && me.model.rtcpEnable == 1
      },
      createFunction: 'formItem'
    },
    {
      tag: 'el-input',
      name: 'rtcpSendCycle',
      label: 'rtcp 发送间隔时间',
      default: '10',
      rules: [
        reg.num3600
      ],
      show: () => {
        return me.model.deviceSubType == 'TFS' && me.model.rtcpEnable == 1
      },
      children: [{
        tag: 'template',
        data: {
          slot: 'append'
        },
        children: ['秒']
      }],
      createFunction: 'formItem'
    },
    {
      tag: 'el-input',
      name: 'rtcpRecvTimeout',
      label: 'rtcp 接受超时时间',
      default: '20',
      rules: [
        reg.num3600
      ],
      show: () => {
        return me.model.deviceSubType == 'TFS' && me.model.rtcpEnable == 1
      },
      children: [{
        tag: 'template',
        data: {
          slot: 'append'
        },
        children: ['秒']
      }],
      createFunction: 'formItem'
    }
  ]
}
