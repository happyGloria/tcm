import reg from '@/data/reg'
export default function (me) {
  return [{
    tag: 'el-select',
    name: 'siteType',
    label: '节点类型',
    rules: [
      reg.required
    ],
    createFunction: 'formItem'
  }, {
    tag: 'el-input',
    name: 'siteId',
    label: '节点ID',
    tip: [
      '必填，1 ~ 9999 范围内的整数',
      '此标识是本节点与其他节点组成联网域内的节点唯一标识',
      '该标识填写后不可修改，请慎重填写'
    ],
    data: {
      props: {
        disabled: Boolean(me.model.id)
      }
    },
    rules: [
      reg.required,
      reg.num9999
    ],
    createFunction: 'formItem'
  },
  {
    tag: 'el-input',
    name: 'no',
    label: '节点编号',
    tip: [
      '必填，1 ~ 9999 范围内的整数',
      '此标识是向对接平台提供参数时的备用参数项，请保持全线路各站点间唯一'
    ],
    rules: [
      reg.required,
      reg.num9999
    ],
    createFunction: 'formItem'
  },
  {
    tag: 'el-input',
    name: 'name',
    label: '节点名称',
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
    tag: 'el-select',
    name: 'code',
    label: '同步类型',
    /*
      1.仅允许当前站点为车站节点时，对当前节点的上级部门节点进行设置，且仅允许对一个上级部门进行设置。
      2.被设置了同步类型的上级部门，既是当前节点的直属上级。
      3.同步类型为【系统配置】时，允许直属上级，修改本节点的【系统配置】"
    */
    createFunction: 'formItem'
  },
  {
    tag: 'el-input',
    type: 'textarea',
    name: 'descr',
    label: '说明',
    tip: '选填项，最多128字符长度输入',
    rules: [
      reg.str128
    ],
    createFunction: 'formItem'
  }
  ]
}

export function copyFieldFactory (me) {
  return [
    {
      tag: 'el-input',
      name: 'ip',
      label: '数据源站点IP',
      tip: '必填项，遵循IPv4规范',
      rules: [
        reg.required,
        reg.ip
      ],
      createFunction: 'formItem'
    }
  ]
}
