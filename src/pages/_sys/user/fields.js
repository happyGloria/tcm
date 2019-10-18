import reg from '@/data/reg'
/** 用户创建规则
 * root -> admin用户
 * admin -> 普通用户
 */
export function FormFactory (me) {
  return [
    {
      tag: 'el-select',
      name: 'userType',
      label: '用户类型',
      default: $.db.getUserType() == 1 ? '2' : '1',
      rules: [
        reg.required
      ],
      createFunction: 'formItem'
    },
    {
      tag: 'el-select',
      name: 'role',
      label: '用户角色',
      rules: [
        reg.required
      ],
      show: () => me.model.userType == 2,
      createFunction: 'formItem'
    },
    {
      tag: 'el-input',
      name: 'name',
      label: '用户名',
      rules: [
        reg.required,
        reg.str64
      ],
      createFunction: 'formItem'
    },
    {
      tag: 'el-input',
      name: 'account',
      label: '登录账号',
      tip: [
        '必填，1 ~ 64 个字符，支持数字、英文（大小写）、下划线、中线、以及 / 输入',
        '需保证同一节点内唯一'
      ],
      data: {
        props: {
          disabled: !!me.model.id,
          disableautocomplete: !0,
          autocomplete: 'new-username'
        }
      },
      rules: [
        reg.required,
        reg.account64
      ],
      createFunction: 'formItem'
    },
    {
      tag: 'el-input',
      name: 'password',
      label: '密码',
      type: 'password',
      tip: `必填，1 ~ 30 个字符，支持除了中文、 空格、' & '、 ' # ' 以外的字符输入`,
      data: {
        props: {
          autocomplete: 'new-password'
        }
      },
      show: () => {
        return !me.model.id
      },
      rules: [
        reg.required,
        reg.password
      ],
      createFunction: 'formItem'
    },
    {
      tag: 'el-input',
      name: 'password-confirm',
      type: 'password',
      label: '确认密码',
      tip: `必填，1 ~ 30 个字符，支持除了中文、 空格、' & '、 ' # ' 以外的字符输入`,
      show: () => {
        return !me.model.id
      },
      rules: [
        reg.required,
        reg.password,
        {
          validator (rule, value, callback) {
            if (value != me.model.password) {
              callback(new Error('请保证与登录密码一致'))
            }
            callback()
          },
          trigger: 'change'
        }
      ],
      createFunction: 'formItem'
    },
    {
      tag: 'el-input',
      name: 'userLevel',
      label: '用户级别',
      tip: '必填，1 ~ 999 范围内的整数，数字越小，级别越高',
      default: '100',
      rules: [
        reg.required,
        reg.num999
      ],
      show: () => me.model.userType == 2,
      createFunction: 'formItem'
    },
    {
      tag: 'el-input',
      type: 'textarea',
      name: 'mappingId',
      label: '编号',
      /* tip: [
        '此标识是向对接平台提供参数时的备用参数项'
      ], */
      rules: [
        reg.str20
      ],
      createFunction: 'formItem'
    },
    {
      tag: 'el-input',
      type: 'textarea',
      name: 'descr',
      label: '说明',
      rules: [
        reg.str128
      ],
      createFunction: 'formItem'
    }
  ]
}

export function PwdFactory (me) {
  return [{
    tag: 'el-input',
    name: 'password',
    label: '新密码',
    tip: `必填，1 ~ 30 个字符，支持除了中文、 空格、' & '、 ' # ' 以外的字符输入`,
    rules: [
      reg.required,
      reg.password
    ],
    createFunction: 'formItem'
  }]
}
