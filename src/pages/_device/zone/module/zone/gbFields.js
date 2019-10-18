import reg from '@/data/reg'
export default function (me) {
  return [
    {
      tag: 'el-input',
      label: '国标编号',
      name: 'gbId',
      tip: '必填项, 允许输入1~20位长度的数字',
      rules: [
        reg.required,
        reg.civilCode
      ],
      createFunction: 'formItem'
    },
    {
      tag: 'el-input',
      label: '分区名称',
      name: 'gbName',
      rules: [
        /* reg.required, */
        reg.str64
      ],
      createFunction: 'formItem'
    }
  ]
}
