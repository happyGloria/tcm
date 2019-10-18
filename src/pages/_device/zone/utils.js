export function parseTree (list) {
  var TYPES = $.db.getFinal().cameraType.list// $.db.getConsts().cameraType
  list.forEach(item => {
    var cameras = item.list
    if (!$.isEmptyFn(cameras)) {
      var tempChild = []
      TYPES.forEach(d => {
        var id = Object.keys(d)[0],
          name = Object.values(d)[0]
        tempChild.push({
          siteId: item.siteId,
          zoneId: item.id,
          parentId: item.id,
          id: item.id + '-' + id,
          nodeType: 'leaf',
          cameraType: id,
          name: name,
          icon: `Camera-${id}`,
          total: item.list[id]
        })
      })
      Object.assign(item, {
        children: tempChild
      })
    }
  })
  return $.array2tree(list || [], 'id', 'parentId')
}
