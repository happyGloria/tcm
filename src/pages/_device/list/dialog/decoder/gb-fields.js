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
        reg.required,
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
    }
  ]
}
