import reg from '@/data/reg'
export default function (me) {
  return [{
    tag: 'el-input',
    label: '编号',
    name: 'mappingId',
    rules: [
      reg.required,
      reg.str20
    ],
    createFunction: 'formItem'
  },
  {
    tag: 'el-input',
    label: '分区名称',
    name: 'name',
    rules: [
      reg.required,
      reg.str64
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
