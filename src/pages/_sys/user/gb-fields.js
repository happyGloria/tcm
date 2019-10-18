import reg from '@/data/reg'
export default function (me) {
  return [
    {
      tag: 'el-input',
      name: 'gbId',
      label: '国标编号',
      rules: [
        reg.required,
        reg.gbId2
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
      name: 'auth',
      label: '是否鉴权',
      default: 1,
      data: {
        props: {
          activeValue: 1,
          inactiveValue: 0,
          activeText: '开',
          inactiveText: '关'
        }
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
      change (val) {
        this.model.tcp = val
      },
      createFunction: 'formItem'
    },
    {
      tag: 'el-input',
      name: 'number',
      label: '每次传送数量',
      default: '10000',
      rules: [
        reg.required,
        reg.num99999
      ],
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
      tag: 'el-switch',
      name: 'subscribeAlarm',
      label: '订阅告警',
      default: 0,
      data: {
        props: {
          activeValue: 1,
          inactiveValue: 0,
          activeText: '开',
          inactiveText: '关'
        }
      },
      createFunction: 'formItem'
    }
  ]
}
