import reg from '@/data/reg'
export default function (me) {
  return [
    {
      tag: 'el-input',
      label: '驱动ID',
      name: 'id',
      data: {
        props: {
          disabled: true
        }
      },
      createFunction: 'formItem'
    },
    {
      tag: 'el-input',
      label: '驱动名称',
      name: 'name',
      data: {
        props: {
          disabled: true
        }
      },
      createFunction: 'formItem'
    },
    {
      tag: 'el-input',
      label: '驱动类型',
      name: 'driverType',
      data: {
        props: {
          disabled: true
        }
      },
      createFunction: 'formItem'
    },
    {
      tag: 'el-input',
      label: '厂家',
      name: 'provider',
      data: {
        props: {
          disabled: true
        }
      },
      createFunction: 'formItem'
    },
    {
      tag: 'el-input',
      label: '型号',
      name: 'style',
      data: {
        props: {
          disabled: true
        }
      },
      createFunction: 'formItem'
    },
    {
      tag: 'el-input',
      label: '默认用户名',
      name: 'username',
      rules: [
        reg.str64
      ],
      createFunction: 'formItem'
    },
    {
      tag: 'el-input',
      label: '默认密码',
      name: 'password',
      rules: [
        reg.password
      ],
      createFunction: 'formItem'
    },
    {
      tag: 'el-input',
      name: 'port',
      label: '默认端口',
      tip: '选填项，请输入1 ~ 65535范围内整数',
      rules: [
        reg.port
      ],
      createFunction: 'formItem'
    },
    {
      tag: 'el-input',
      name: 'driverParam',
      label: '驱动参数',
      rules: [
        reg.str64
      ],
      createFunction: 'formItem'
    },
    {
      tag: 'el-input',
      name: 'secondParam',
      label: '辅码流参数',
      rules: [
        reg.str64
      ],
      createFunction: 'formItem'
    },
    {
      tag: 'el-input',
      name: 'monitorParam',
      label: '电视墙上墙参数',
      rules: [
        reg.str64
      ],
      createFunction: 'formItem'
    },
    {
      tag: 'el-input',
      name: 'recordParam',
      label: '录像参数',
      rules: [
        reg.str64
      ],
      createFunction: 'formItem'
    },
    {
      tag: 'el-input',
      name: 'otherParam',
      label: '其他参数',
      rules: [
        reg.str64
      ],
      createFunction: 'formItem'
    },
    {
      tag: 'el-input',
      name: 'descr',
      label: '描述',
      tip: '选填项，最多128字符长度输入',
      rules: [
        reg.str128
      ],
      createFunction: 'formItem'
    }
  ]
}
