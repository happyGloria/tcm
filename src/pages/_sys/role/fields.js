import reg from '@/data/reg'
import EditPermit from './permit/editPermit.vue'
export default function (me) {
  return [{
    tag: 'el-input',
    name: 'name',
    label: '角色名称',
    tip: [
      '请保证同一节点内， 角色名称唯一'
    ],
    data: {
      props: {
        disabled: !!me.model.id
      }
    },
    rules: [
      reg.required,
      reg.str64
    ],
    createFunction: 'formItem'
  },
  {
    tag: 'div',
    data: {
      class: {
        'form-title': true
      }
    },
    children: ['权限设置']
  },
  {
    tag: 'el-switch',
    name: 'record',
    label: '允许录像文件检索与回放',
    default: true,
    change (val) {
      if (!val) {
        me.model.download = false
      }
    },
    data: {
      props: {
        activeValue: true,
        inactiveValue: false,
        activeText: '开',
        inactiveText: '关'
      }
    },
    createFunction: 'formItem'
  },
  {
    tag: 'el-switch',
    name: 'download',
    label: '允许录像文件下载',
    change (val) {
      me.model.record = val
    },
    default: true,
    data: {
      props: {
        activeValue: true,
        inactiveValue: false,
        activeText: '开',
        inactiveText: '关'
      }
    },
    createFunction: 'formItem'
  },
  {
    tag: 'el-switch',
    name: 'map',
    label: '允许查看地图',
    default: true,
    data: {
      props: {
        activeValue: true,
        inactiveValue: false,
        activeText: '开',
        inactiveText: '关'
      }
    },
    createFunction: 'formItem'
  },
  {
    tag: 'el-input',
    type: 'textarea',
    name: 'ip',
    label: 'IP地址',
    desc: '多个IP段间，请用逗号隔开',
    tip: [
      '允许客户端登录的IP地址',
      '填写格式: IP段间请用逗号隔开，且结尾不要有逗号',
      '如：192.168.12.55,192.168.12.20-30,192.168.12.*,192.168.*.20,192.168.*.*'
    ],
    rules: [
      reg.multiIp
    ],
    createFunction: 'formItem'
  },
  {
    tag: EditPermit,
    name: 'access',
    label: '权限选择',
    createFunction: 'comp',
    data: {
      ref: 'editPermit',
      props: {
        type: 'role',
        model: me.model
      }
    }
  }]
}
