export default {
  props: {
    title: String
  },
  data () {
    return {
      driverHT: {}
    }
  },
  computed: {
    activeNode () {
      return this.$parent.jtree.getActive()
    },
    jtree () {
      return this.closest('jtree')
    },
    jtable () {
      return this.closest('jtable')
    }
  },
  methods: {
    setDriverHT (driverList) {
      this.driverHT = {}
      driverList.map(d => {
        this.driverHT[d.id] = d
      })
    },
    open (prop) {
      this.model = this.defModel = $.extend(true, {}, $.modelTpl(this.fields, this.option))
      this.dialog.open(() => {
        this.setData(prop, (data) => {
          let obj = {
            id: data.id
          }
          if (obj.id) {
            $.copyValue(obj, data, this.fields)
          } else {
            obj = $.modelTpl(this.fields, this.option, {})
          }
          this.model = $.extend(true, {}, obj)
          this.dialog.end()
        })
      })
    },
    saveAjax () {
      this.start(() => {
        let model = this.getFormValue()
        $.persist(model, 'addDevice', 'editDevice').then((r) => {
          this.nvMsg()
          this.close()
          this.jtree.init().then(() => this.$parent.refreshFn())
        }).finally(this.end)
      })
    },
    getFormValue () {
      let fields = this.fields
      let map = {
        id: this.data.id,
        deviceType: this.data.deviceType,
        siteId: this.data.siteId
      }
      fields.forEach(field => {
        if (field.name && (!field.show || field.show())) {
          var val = this.model[field.name]
          switch (field.name) {
            case 'driverId':
            case 'recordDriverId':
              // var arr = val[val.length - 1].split('-')
              map[field.name] = val[val.length - 1]
              break
            case 'zoneId':
              var tmpVal = val[val.length - 1]
              map[field.name] = tmpVal == -1 ? '' : tmpVal
              break
            default:
              map[field.name] = val
          }
        }
      })
      var gb28181 = {}
      if (this.isShowGBTab) {
        gb28181 = this.getSecondFormValue(this.model)
      }
      Object.assign(map, gb28181)
      return map
    }
  }
}
