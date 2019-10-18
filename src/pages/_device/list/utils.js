export function parseTree (nodes) {
  function getIcon (obj) {
    if (!$.isEmptyFn(obj.parentId)) {
      var pId = obj.parentId
      if (pId == 'Server') {
        return pId
      }
      if (pId == 'Camera') {
        return [pId, obj.id].join('-')
      }
    }
    return obj.id
  }

  function getNodeKey (site, obj) {
    if (!$.isEmptyFn(obj.parentId)) {
      return [site.siteId, obj.parentId, obj.id].join('-')
    }
    return [site.siteId, obj.id].join('-')
  }
  return nodes.map(site => {
    var countHT = {}
    site.devices.forEach(d => {
      countHT[d.type] = d.count
    })
    var deviceTypes = $.db.getConsts().deviceType.map(obj => {
      return Object.assign({}, obj, {
        count: countHT[obj.id] || 0,
        key: getNodeKey(site, obj),
        nodeType: 'device',
        icon: getIcon(obj)
      })
    })
    return Object.assign({}, site, {
      key: site.siteId,
      name: site.siteName,
      icon: site.siteType,
      nodeType: 'site',
      children: $.array2tree(deviceTypes, 'id', 'parentId')
    })
  })
}

export function editForm (data) {
  var extParam = {
    'id': data ? data.id : ''
  }
  var formFlag = ''
  if (data) {
    formFlag = data.deviceType
    Object.assign(extParam, {
      'siteId': data.siteId,
      'deviceType': data.deviceType,
      'deviceSubType': data.deviceSubType || ''
    })
  } else {
    let activeNode = this.jtree.getActive()
    let nodeKey = activeNode.key.split('-')
    formFlag = nodeKey[1]
    Object.assign(extParam, {
      'siteId': nodeKey[0],
      'deviceType': nodeKey[1],
      'deviceSubType': nodeKey[2] || (formFlag == 'Camera' ? '1' : '')
    })
  }
  switch (formFlag) {
    case 'Camera':
      extParam = Object.assign({}, extParam, {
        accessType: 'dv'
      })
      break
    /* case 'Server':
      extParam = Object.assign({}, extParam, {
        deviceSubType: extParam.deviceSubType || 'TNM'
      })
      break
    case 'encoder':
      extParam = Object.assign({}, extParam)
      break */
    default:
      extParam = Object.assign({}, extParam)
  }
  this.$refs[`${formFlag}Form`].open(extParam)
}

export function getNode (list, ht) {
  for (var i = 0; i < list.length; i++) {
    var obj = list[i]
    if (obj.id == ht.id) {
      var tempChild = []
      $.db.getConsts().cameraType.forEach(item => {
        tempChild.push(Object.assign({}, item, {
          id: obj.id + '-' + item.id,
          type: 'leaf',
          cameraType: item.id,
          count: ht.list[item.id]
        }))
      })
      Object.assign(obj, {
        count: ht.total,
        children: tempChild
      })
      break
    } else {
      if (obj.children) {
        getNode(obj.children, ht)
      } else {
        Object.assign(obj, {
          count: 0
        })
        continue
      }
    }
  }
}

export function listToTree (myId, pId, list) {
  function exists (list, parentId) {
    for (var i = 0; i < list.length; i++) {
      if (list[i][myId] == parentId) return true
    }
    return false
  }

  var nodes = []
  for (var i = 0; i < list.length; i++) {
    var row = list[i]
    if (!exists(nodes, row[pId])) {
      nodes.push(Object.assign({}, row, {
        virId: row[pId],
        text: row[pId]
      }))
    }
  }

  for (var j = 0; j < nodes.length; j++) {
    var parent = nodes[j]
    for (var k = 0; k < list.length; k++) {
      var item = list[k]
      if (parent[pId] == item[myId]) {
        if (parent.children) {
          parent.children.push(Object.assign({}, item, {
            virId: item.id,
            text: item['style'],
            parent: parent
          }))
        } else {
          parent.children = [Object.assign({}, item, {
            virId: item.id,
            text: item['style'],
            parent: parent
          })]
        }
      }
    }
  }

  return nodes
}

export function getCascadeValue (val, tree) {
  function getNode (list) {
    for (var i = 0; i < list.length; i++) {
      var item = list[i]
      if (item.id == val) {
        return [item.virId, item.parent.virId]
      } else {
        if (item.children) {
          getNode(item.children)
        }
      }
    }
  }
  return getNode(tree)
}

let _TRIGGER_ = 'change'
export function validateChild (zoneList, msg, trigger) {
  return {
    validator (rule, value, callback) {
      function getNode (list, nodeId) {
        if (!nodeId) {
          return
        }
        for (var i = 0; i < list.length; i++) {
          var item = list[i]
          if (item['virId'] == nodeId) {
            return item
          } else {
            if (item.children) {
              getNode(item.children, nodeId)
            } else {
              continue
            }
          }
        }
      }
      if (value.length == 0) {
        callback()
      } else {
        var node = getNode(zoneList, value[value.length - 1])
        if (node && node.children) {
          callback(new Error('请选择最底层节点'))
        } else {
          callback()
        }
      }
    },
    trigger: trigger || _TRIGGER_
  }
}
