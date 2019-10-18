import fileDownload from 'js-file-download'
export default {
  data () {
    return {
      downLoading: !1
    }
  },
  methods: {
    timeRangeChangeFn () {
      var val = this.filter.timeRange
      var defaultRange = [$.getCurDay().from, $.getCurDay().to]
      if ($.isEmptyFn(val)) {
        return this.filter.timeRange = ['', '']
      }
      if (this.filter.timeRange.every(value => value == 0)) {
        return this.filter.timeRange = defaultRange
      }
      return this.filter.timeRange = this.filter.timeRange.map(item => {
        if (item instanceof Date) {
          return $.Date.getTickInSec(item)
        }
        return item
      })
    },
    clearFilter (param, cbFn) {
      for (let key in this.filter) {
        if (key == 'timeRange') {
          this.filter[key] = [$.getCurDay().from, $.getCurDay().to]
        } else {
          this.filter[key] = param ? (param[key] || '') : ''
        }
      }
      cbFn && cbFn()
    },
    query () {
      this.jtable.clear(() => {
        this.jtable.init()
      })
    },
    download (api, param) {
      this.downLoading = !0
      Service[api](param || this.filter).then(res => {
        this.downLoading = !1
        let disposition = res.headers['content-disposition']
        let filename = decodeURI(disposition.match(/filename=(.*)/)[1], 'UTF-8')
        fileDownload(res.data, filename)
      })
    }
  }
}
