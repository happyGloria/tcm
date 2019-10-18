import reg from '@/data/reg'
export function OccConfig (me) {
  return [{
    tag: 'el-input',
    name: 'CurrentSite',
    label: '标识号',
    desc: '长度在 1 到 64 个字符',
    rules: [
      reg.required,
      reg.str64
    ],
    createFunction: 'formItem'
  },
  {
    tag: 'el-input',
    name: 'OCCTcmIP',
    label: '服务IP',
    rules: [
      reg.required,
      reg.ip
    ],
    createFunction: 'formItem'
  }
  ]
}

export function TimeLimit (me) {
  return [{
    tag: 'el-input',
    name: 'RealToHistorySaveDays',
    label: '实时告警转历史告警',
    tip: '必填，建议不超过30天',
    rules: [
      reg.required,
      reg.int5
    ],
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
    tag: 'el-input',
    name: 'HistorySaveDays',
    label: '历史告警保存期限',
    tip: '必填，建议不超过180天',
    rules: [
      reg.required,
      reg.int5
    ],
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
    tag: 'el-input',
    name: 'OpLogSaveDays',
    label: '操作日志保存期限',
    tip: '必填，建议不超过180天',
    default: 30,
    rules: [
      reg.required,
      reg.int5
    ],
    children: [{
      tag: 'template',
      data: {
        slot: 'append'
      },
      children: ['天']
    }],
    createFunction: 'formItem'
  }
  ]
}

