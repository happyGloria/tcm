import reg from '@/data/reg'
import DatePlan from './timePlan'
export default function (me) {
  return [{
    tag: 'el-input',
    label: '录像计划名称',
    name: 'name',
    tip: [
      '请保证同一节点内，录像计划名称唯一'
    ],
    rules: [
      reg.required,
      reg.str64
    ],
    data: {
      props: {
        disabled: !!me.model.id
      }
    },
    createFunction: 'formItem'
  },
  {
    tag: 'div',
    data: {
      class: {
        'form-title': true
      }
    },
    children: ['录像计划时间表']
  },
  {
    tag: DatePlan, // 日期计划
    data: {
      ref: 'datePlan',
      class: 'form-item-days',
      props: {
        model: me.model
      }
    },
    createFunction: 'comp'
  },
  {
    tag: 'el-select',
    name: 'streamMode',
    label: '取流方式',
    rules: [
      reg.required
    ],
    createFunction: 'formItem'
  },
  {
    tag: 'el-input',
    name: 'circle',
    label: '存储周期',
    default: '30',
    rules: [
      reg.required,
      reg.int1_100
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
    tag: 'el-radio-group',
    name: 'storageId',
    label: '存储服务器',
    rules: [
      reg.required
    ],
    createFunction: 'formItem'
  }
  ]
}
