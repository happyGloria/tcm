import reg from '@/data/reg'
export default function (me) {
  return [{
    tag: 'el-input',
    name: 'name',
    label: '名称',
    rules: [
      reg.required,
      reg.str64
    ],
    createFunction: 'formItem'
  },
  {
    tag: 'el-select',
    name: 'decoderId',
    label: '关联解码器',
    tip: '必选项，选择解码器后，再选择关联通道号',
    rules: [
      reg.required
    ],
    change (val) {
      this.model.decoderId = val
      this.model.channelNo = ''
      me.setChannel()
    },
    createFunction: 'formItem'
  },
  {
    tag: 'el-select',
    name: 'channelNo',
    label: '关联通道号',
    tip: '必选项，请在选择关联解码器后，再选择该项',
    rules: [
      reg.required
    ],
    createFunction: 'formItem'
  },
  {
    tag: 'el-input',
    name: 'mappingId',
    label: '编号',
    createFunction: 'formItem',
    rules: [
      reg.str20
    ]
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
  }]
}
