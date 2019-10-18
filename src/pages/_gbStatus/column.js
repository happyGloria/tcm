export function getColumn (deviceType) {
  var res = []
  let basic = [
      { type: 'index', name: '序号', width: '60', minWidth: '50' },
      { key: 'gbId', name: '国标编号' },
      { key: 'name', name: deviceType == 'child' ? '下级名称' : '上级名称' },
      { key: 'ip', name: 'IP地址' },
      {
        key: 'regTime',
        name: '注册时间',
        format: val => val || '--'
      },
      {
        key: 'expires',
        name: '注册有效期 (单位:秒)',
        format: val => val || '--'
      }
    ],
    tail = [
      {
        key: 'status',
        htmlFlag: !0,
        align: 'center',
        width: 180,
        minWidth: 180,
        name: `<em style="margin-right: 10px;">状态</em>
        <em class="green"><i class="circle"></i><i>在线</i></em>
        <em class="red"><i class="circle"></i><i>离线</i></em>`,
        format: value => {
          return `<span class="${value == 'ON' ? 'green' : 'red'}">
            <i class="circle"></i>
            <i>${$.v2str('status', value)}</i>
          </span>`
        }
      }
    ],
    rest = [
      {
        key: 'type',
        name: '设备类型',
        format: value => `<i>${$.v2str('deviceType', value)}</i>`
      }
    ]
  switch (deviceType) {
    case 'parent':
    case 'user':
      res = [...basic, ...tail]
      break
    case 'child':
      res = [...basic, ...rest, ...tail]
      break
  }
  return res
}
