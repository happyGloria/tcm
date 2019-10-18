import DefaultFinal from '@/data/final.js'
let FINAL_DATA
export default {
  setFinal: (data, final = DefaultFinal) => {
    for (var key in data) {
      final[key] = {
        default: '',
        list: data[key].map(d => {
          let json = {}
          json[d.id] = d.name
          return json
        })
      }
    }
    FINAL_DATA = final
    $.db.setFinal(FINAL_DATA)
  },
  getFinal (key) {
    if (key instanceof Array) {
      var res = {}
      key.forEach(key => {
        res[key] = FINAL_DATA[key] || {}
      })
      return res
    }
    return key ? FINAL_DATA[key] : FINAL_DATA
  }
}
