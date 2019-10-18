import reg from '@/data/reg'
export default function (me) {
  let disableFn = function (val) {
    return !Number(val)
  }
  return [{
    tag: 'el-switch',
    name: 'flag',
    label: '启用国标模块',
    default: 0,
    data: {
      props: {
        activeValue: 1,
        inactiveValue: 0,
        inactiveColor: 'red',
        activeText: '开',
        inactiveText: '关'
      }
    },
    change (val) {
      let h = me.$createElement,
        prompMsg = h(
          'div', {
            'class': 'nv-message-box'
          },
          [
            h('p', `如果关闭，监控系统将重启！`)
          ]
        )
      if (!val) {
        me.$confirm(prompMsg, '提示', {
          type: 'warning'
        }).then(() => {
          me.model.flag = val
          Service.setGB(me.getFormValue()).then((r) => {
            $.db.setBJVMS(me.model.bjVMS)
            me.$message.success('操作成功')
            setTimeout(() => {
              location.reload()
            }, 1000)
          }).catch(err => {
            console.log(err)
          })
        }, () => {
          me.model.flag = !val
          me.$message.warning('操作取消')
        })
      } else {
        me.model.flag = val
      }
    },
    createFunction: 'formItem'
  },
  {
    tag: 'el-switch',
    name: 'bjVMS',
    label: '北京VMS',
    default: 0,
    data: {
      props: {
        activeValue: 1,
        inactiveValue: 0,
        inactiveColor: 'red',
        activeText: '开',
        inactiveText: '关'
      }
    },
    change (val) {
      me.model.bjVMS = val
    },
    createFunction: 'formItem'
  },
  {
    tag: 'el-input',
    name: 'gbId',
    label: '国标编号',
    /*  tip: '选填，请输入13或20位数字', */
    rules: [
      reg.required,
      reg.gbId2
    ],
    data: {
      props: {
        disabled: disableFn(me.model.flag)
      }
    },
    createFunction: 'formItem'
  },
  {
    tag: 'el-input',
    name: 'gbName',
    label: '名称',
    rules: [
      reg.required,
      reg.str64
    ],
    data: {
      props: {
        disabled: disableFn(me.model.flag)
      }
    },
    createFunction: 'formItem'
  },
  {
    tag: 'el-input',
    name: 'password',
    label: '密码',
    data: {
      props: {
        disabled: disableFn(me.model.flag)
      }
    },
    rules: [
      reg.required,
      reg.password
    ],
    createFunction: 'formItem'
  },
  {
    tag: 'el-input',
    name: 'civil',
    label: '行政区划编号',
    // tip: '必填项，长度需要是小于"国标编号"位数的偶数',
    // tip: '必填项，长度需小于或等于"国标编号"位数',
    data: {
      props: {
        disabled: disableFn(me.model.flag)
      }
    },
    rules: [
      reg.required,
      reg.civilCode
      /* {
        validator (rule, value, callback) {
          if (value.length > me.model.gbId.length) {
            callback(new Error('长度需小于或等于"国标编号"位数！'))
          }
          callback()
        },
        trigger: 'change'
      } */
    ],
    createFunction: 'formItem'
  },
  {
    tag: 'el-input',
    name: 'ip',
    label: 'IP地址',
    data: {
      props: {
        disabled: disableFn(me.model.flag)
      }
    },
    rules: [
      reg.required,
      reg.ip
    ],
    createFunction: 'formItem'
  },
  {
    tag: 'el-input',
    name: 'port',
    label: '端口',
    default: '5060',
    data: {
      props: {
        disabled: disableFn(me.model.flag)
      }
    },
    rules: [
      reg.required,
      reg.port
    ],
    createFunction: 'formItem'
  },
  {
    tag: 'el-select',
    name: 'registerWay',
    label: '注册方式',
    default: '1',
    data: {
      props: {
        disabled: disableFn(me.model.flag)
      }
    },
    rules: [
      reg.required
    ],
    createFunction: 'formItem'
  }, {
    tag: 'el-input',
    name: 'httpPort',
    label: 'http服务端口',
    default: '8080',
    data: {
      props: {
        disabled: disableFn(me.model.flag)
      }
    },
    rules: [
      reg.required,
      reg.port
    ],
    createFunction: 'formItem'
  },
  {
    tag: 'el-input',
    name: 'number',
    label: '每次传送数量(TCP)',
    /* tip: ['TCP传输时，向上级平台一次推送多少条'], */
    default: '10000',
    data: {
      props: {
        disabled: disableFn(me.model.flag)
      }
    },
    rules: [
      reg.required,
      reg.num99999
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
        inactiveValue: 0,
        activeText: '开',
        inactiveText: '关',
        disabled: disableFn(me.model.flag)
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
    data: {
      props: {
        disabled: disableFn(me.model.flag)
      }
    },
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
    data: {
      props: {
        disabled: disableFn(me.model.flag)
      }
    },
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
    tag: 'el-input',
    name: 'owner',
    label: '所有者',
    rules: [
      reg.str64
    ],
    data: {
      props: {
        disabled: disableFn(me.model.flag)
      }
    },
    createFunction: 'formItem'
  },
  {
    tag: 'el-input',
    name: 'address',
    label: '安装地址',
    rules: [
      reg.str64
    ],
    data: {
      props: {
        disabled: disableFn(me.model.flag)
      }
    },
    createFunction: 'formItem'
  },
  {
    tag: 'el-input',
    name: 'backup',
    label: '备用中心国标编号',
    /* tip: '选填，请输入13或20位数字', */
    rules: [
      reg.gbId2
    ],
    data: {
      props: {
        disabled: disableFn(me.model.flag)
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
        inactiveText: '关',
        disabled: disableFn(me.model.flag)
      }
    },
    change (val) {
      this.model.tcp = val
    },
    createFunction: 'formItem'
  }
  ]
}
