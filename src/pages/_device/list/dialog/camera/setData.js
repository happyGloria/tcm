import {
  listToTree
} from '../../utils.js'
export default function (model, callback) {
  let me = this
  if (me.encoderHT) me.encoderHT.clear()
  $.initForm({
    model,
    ajax: [
      [Service.listZone, { siteId: model.siteId }],
      [Service.listDriver, { driverType: model.deviceType }],
      [Service.listDevice4Type, { id: model.id }, 'put']
    ],
    events: [
      (r) => {
        var driverList = listToTree('provider', 'provider', r[1].items || []),
          zoneList = [{ id: '-1', name: '无', parentId: '' }].concat(r[0].items) || [],
          constList = $.db.getConsts()
        me.setDriverHT(r[1].items)
        me.option = {
          deviceSubType: {
            default: '1',
            name: 'name',
            value: 'id',
            list: constList.cameraType || []
          },
          zoneId: { // 所属分区
            default: '',
            name: 'name',
            value: 'id',
            list: $.array2tree(zoneList, 'id', 'parentId') || []
          },
          driverId: {
            default: '',
            name: 'text',
            value: 'virId',
            list: driverList
          },
          recordDriverId: {
            default: '',
            name: 'text',
            value: 'virId',
            list: driverList
          },
          encoderId: {
            default: '',
            name: 'name',
            value: 'id',
            list: []
          },
          channelNo: {
            name: 'name',
            value: 'id',
            list: [{ id: 1, name: 1 }]
          }
        }
      },
      {
        method: 'put',
        fn: (r) => {
          me.data = r[2].data
          me.$nextTick(() => {
            me.model.encoderId = me.data.encoderId
            me.getNotRelatedDevices({
              siteId: me.data.siteId,
              deviceType: me.data.accessType
            })
          })
        }
      },
      {
        method: 'post',
        fn: (r) => {
          me.data = model
        }
      },
      () => {
        $.fire(callback, me.data)
      }
    ]
  })
}
