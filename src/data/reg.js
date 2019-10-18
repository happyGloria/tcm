/**
 * Created by zj on 2017/4/20.
 */
var _TRIGGER_ = 'change'
var _REG_FLAGS = 'm'
var _BLUR_ = 'blur'

var required = function (msg, trigger) {
  return {
    validator: function (rule, value, callback) {
      if ($.isArray(value)) {
        if (value.length === 0) {
          callback(new Error(msg || '此处为必填项'))
        } else {
          callback()
        }
      } else if (value === '' || value === undefined) {
        callback(new Error(msg || '此处为必填项'))
      } else {
        callback()
      }
    },
    required: !0,
    trigger: trigger || _TRIGGER_
  }
}

var pattern = function (reg, msg, trigger, flags) {
  return {
    pattern: typeof reg === 'string' ? new RegExp(reg, flags) : reg,
    message: msg || '输入格式不匹配',
    trigger: trigger || _TRIGGER_
  }
}

var str = function (min, max, msg, flags) {
  return pattern('^.{' + min + ',' + max + '}$', msg, _TRIGGER_, flags)
}

var account = function (min, max, msg, flags) {
  return pattern('^[a-zA-Z0-9/_-]{' + min + ',' + max + '}$', msg, _TRIGGER_, flags)
}
// 字符串数字 01 001 1001
var int = function (min, max, msg) {
  return pattern('^[0-9]{' + min + ',' + max + '}$', msg)
}

// 严格数字开头不能是0
var num = function (min, max, msg, trigger) {
  return {
    validator: function (rule, value, callback) {
      if (value === '') {
        callback()
      }
      value = value + ''
      var _value_ = parseInt(value)
      if (
        value.length === (_value_ + '').length &&
        min <= _value_ && _value_ <= max
      ) {
        callback()
      } else {
        callback(new Error(msg ||
          $.tpl('请输入{min} ~ {max}范围内的整数', {
            min: min,
            max: max
          })
        ))
      }
    },
    trigger: trigger || _TRIGGER_
  }
}

var remote = function (data) {
  let {
    id,
    name,
    api,
    apiPrefix,
    msg
  } = data
  return {
    validator: function (rule, value, callback) {
      if (value === '') {
        callback()
      } else {
        let param = {}
        param[name] = value
        if (id) {
          param.id = id
        }
        Service[api](param, apiPrefix).then((r) => {
          if (r.data.status) {
            callback(new Error(msg || r.data.message))
          } else {
            callback()
          }
        }, (r) => {
          callback(new Error(r.data.message))
        })
      }
    },
    trigger: _BLUR_
  }
}

var getStrMsgByLength = function (length) {
  return $.tpl('限制{size}位字符输入', {
    size: length
  })
}

var getIntMsgByLength = function (length) {
  return $.tpl('仅支持数字输入，限制最大输入{size}位字符，最小为1位字符', {
    size: length
  })
}

let int20Reg = /^[0-9]{20}$/
let ipReg = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$|^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/

var ip4gb = {
  validator: function (rule, value, callback) {
    if (value === '') {
      callback()
    }
    if (int20Reg.test(value)) {
      callback()
    } else {
      if (ipReg.test(value)) {
        callback()
      } else {
        callback(new Error('IP地址格式不正确'))
      }
    }
  },
  trigger: _TRIGGER_
}

let multiIpExp = /^((25[0-5]|2[0-4]\d|[01]?\d\d?)($|(?!\.$)\.)){4}$|^((25[0-5]|2[0-4]\d|[01]?\d\d?)($|(?!\.$)\.)){3}\*$|^((25[0-5]|2[0-4]\d|[01]?\d\d?)($|(?!\.$)\.)){2}\*\.((25[0-5]|2[0-4]\d|[01]?\d\d?))$|^((25[0-5]|2[0-4]\d|[01]?\d\d?)($|(?!\.$)\.)){2}\*\.\*$|^((25[0-5]|2[0-4]\d|[01]?\d\d?)($|(?!\.$)\.)){3}((25[0-5]|2[0-4]\d|[01]?\d\d?))\-((25[0-5]|2[0-4]\d|[01]?\d\d?))$/

var multiIp = {
  validator: function (rule, value, callback) {
    if (value === '') {
      callback()
    }
    var aIp = value.trim().split(/,|，/)
    var count = 0
    for (var i = 0; i < aIp.length; i++) {
      if (!multiIpExp.test(aIp[i])) {
        count++
      }
    }
    if (count > 0) {
      callback(new Error('IP格式错误'))
    } else {
      callback()
    }
  },
  trigger: _TRIGGER_
}
var str16 = str(1, 16, getStrMsgByLength(16))
var str18 = str(1, 18, getStrMsgByLength(18))
var str20 = str(1, 20, getStrMsgByLength(20))
var str24 = str(1, 24, getStrMsgByLength(24))
var str25 = str(1, 25, getStrMsgByLength(25))
var str32 = str(1, 32, getStrMsgByLength(32))
var str36 = str(1, 36, getStrMsgByLength(36))
var str40 = str(1, 40, getStrMsgByLength(40))
var str45 = str(1, 45, getStrMsgByLength(45))
var str50 = str(1, 50, getStrMsgByLength(50))
var str64 = str(1, 64, getStrMsgByLength(64))
var str80 = str(1, 80, getStrMsgByLength(80))
var str100 = str(1, 100, getStrMsgByLength(100))
var str128 = str(1, 128, getStrMsgByLength(128), _REG_FLAGS)
var str150 = str(1, 150, getStrMsgByLength(150))
var str250 = str(1, 250, getStrMsgByLength(250))
var str1000 = str(1, 1000, getStrMsgByLength(1000))

var str1500 = str(1, 1500, getStrMsgByLength(1500))
var strDefault = str(1, 45, getStrMsgByLength(45))

var account64 = account(1, 64, '仅允许输入字母、数字、下划线、中线、以及 / 输入，长度范围 1 ~ 64 位')

var int4 = int(1, 4, getIntMsgByLength(4))
var int5 = int(1, 5, getIntMsgByLength(5))
var int6 = int(1, 6, getIntMsgByLength(6))
var int10 = int(1, 10, getIntMsgByLength(10))
var int11 = int(1, 11, getIntMsgByLength(11))
var int18 = int(1, 18, getIntMsgByLength(18))
var int20 = int(1, 20, getIntMsgByLength(20))
var int24 = int(1, 24, getIntMsgByLength(24))
var int25 = int(1, 25, getIntMsgByLength(25))
var int32 = int(1, 32, getIntMsgByLength(32))
var int36 = int(1, 36, getIntMsgByLength(36))
var int50 = int(1, 50, getIntMsgByLength(50))
var int64 = int(1, 64, getIntMsgByLength(64))

var num20 = num(5, 20)
var num99 = num(1, 99)
var num100 = num(1, 100)
var num128 = num(0, 128)
var num512 = num(1, 512)
var num999 = num(1, 999)
var num1000 = num(1, 1000)
var num3000 = num(1, 3000)
var num3600 = num(1, 3600)
var num9999 = num(1, 9999)
var num99999 = num(1, 99999)

var isNum = {
  type: 'number',
  message: '必须为数字值'
}

var ptzIdleTime = num(5, 60, '可输入5-60中的任何数字')

var projectNumber = pattern(
  '^(([1-9]{1}[0-9]{0,6}))$',
  '可输入1—9999999中的任何数字'
)

var nodeNumber = pattern(
  '^(([1-9]{1}[0-9]{0,5}))$',
  '可输入1—999999中的任何数字'
)

var email = pattern(
  /^(([^<>()[\]\\.,;:\s@\\"]+(\.[^<>()[\]\\.,;:\s@\\"]+)*)|(\\".+\\"))@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
  '邮箱格式不正确'
)

var level = pattern(
  '^(([1-9]{1}[0-9]{0,3})|10000|0)$',
  '可输入0—10000中的任何数字，0的级别最小，10000的级别最大'
)

var cloudPersize = pattern(
  '^(([1-9]\\d{0,4})|0)(\\.\\d{1,2})?$',
  '支持数字输入，支持小数点后2位，最大支持小数点前4位数字输入，最大9999G'
)

var password = pattern(
  '^[^&#\\s\u4e00-\u9fa5]{1,30}$',
  `支持1 ~ 30位，除了中文、 空格、' & '、 '#' 以外的字符输入`
)

var password2 = pattern(
  '^[a-zA-Z0-9_]{1,30}$',
  `密码由数字、字母、下划线组成，长度为1~30位`
)

var gbId = pattern(/^[0-9]{1,20}$/, '请输入1~20位长度的数字')
var gbId2 = pattern(/^\d{13}$|^\d{20}$/, '请输入13或20位长度的数字')
var civilCode = pattern(/^\d{1,20}$/, '请输入1~20位长度的数字')

var isInt = pattern(/^[1-9]\d*$/, '仅支持输入非零整数')
var int1_100 = pattern(/^[1-9]\d?$|^100$/, '仅支持输入非零整数, 数字范围1~100')

var maxWay = num(0, 1000, '仅支持数字输入，默认为4，不输入数字则不做限制，最大可设1000路')

var phone = pattern(
  /^[0-9\\-]{1,20}$/,
  '电话号码格式不正确,例如 010-82325561, 支持20位输入'
)

var ip = pattern(ipReg, 'IP地址格式不正确')

var port = num(1, 65535, '端口号请输入1到65535的整数')

var chanNo = pattern(
  '^(([1-9]{1}[0-9]{0,4}))$|^[0-9]{20}$',
  '可输入1—99999中的任何数字，或20位的国标编号'
)

var extraChannelNo = pattern(
  '^(([1-9]{1}[0-9]{0,4}))$',
  '可输入1—99999中的任何数字'
)

var serviceSize = pattern(
  '^(([1-9]\\d{0,19})|0)(\\.\\d{1,2})?$',
  '支持20位数字，精确到小数点后俩位'
)

var gbIdStep = pattern(
  '^(([1-9]{1}[0-9]{0,2}))$|^1000$',
  '可输入1—1000中的任何数字'
)

var gbIdTimes = pattern(
  '^([1-9]{1}[0-9]{0,2})$|^([1-2]{1})([0-9]{0,3})$|^3000$',
  '可输入1—3000中的任何数字'
)

var longitude = pattern(
  '^-?(?:(?:180(?:\\.0{1,16})?)|(?:(?:(?:1[0-7]\\d)|(?:[1-9]?\\d))(?:\\.\\d{1,16})?))$',
  '经度范围：-180~180，精确到小数点后16位'
)

var latitude = pattern(
  '^-?(?:90(?:\\.0{1,16})?|(?:[1-8]?\\d(?:\\.\\d{1,16})?))$',
  '纬度范围：-90~90，精确到小数点后16位'
)

var presetPositions = pattern(
  '^(([1-9]{1}[0-9]{0,3}))$',
  '可输入1—9999中的任何数字'
)

var deviceInfoPrice = pattern(
  '^(([1-9]\\d{0,9})|0)(\\.\\d{1,2})?$',
  '支持10位数字，精确到小数点后俩位'
)

var vodInCount6 = pattern(
  '^([1-9]\\d{0,4})?$',
  '最大支持5位数字输入'
)

var platformNum = pattern(
  '^([1-9]\\d{0,7})?$',
  '最大支持8位数字输入'
)

var macAddr = pattern(
  '^([0-9a-fA-F]{2}[:-]){5}([0-9a-fA-F]{2})$',
  'MAC地址格式不正确,格式如: 00:A3:19:EF:E4:24'
)

var uri = pattern((() => {
  let allowLocal = true
  let allowEmptyProtocol = true
  let protocol = ('http, https, ftp').split(',').join('|').replace(/\s/g, '')
  return new RegExp(
    '^' +
    // protocol identifier
    '(?:(?:' + protocol + ')://)' +
    // allow empty protocol
    (allowEmptyProtocol ? '?' : '') +
    // user:pass authentication
    '(?:\\S+(?::\\S*)?@)?' +
    '(?:' +
    // IP address exclusion
    // private & local networks
    (allowLocal ? '' : ('(?!(?:10|127)(?:\\.\\d{1,3}){3})' +
      '(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})' +
      '(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})')) +
    // IP address dotted notation octets
    // excludes loopback network 0.0.0.0
    // excludes reserved space >= 224.0.0.0
    // excludes network & broadcast addresses
    // (first & last IP address of each class)
    '(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])' +
    '(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}' +
    '(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))' +
    '|' +
    // host name
    '(?:(?:[a-z\\u00a1-\\uffff0-9]-?)*[a-z\\u00a1-\\uffff0-9]+)' +
    // domain name
    '(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-?)*[a-z\\u00a1-\\uffff0-9])*' +
    // TLD identifier
    '(?:\\.(?:[a-z\\u00a1-\\uffff]{2,}))' +
    // Allow intranet sites (no TLD) if `allowLocal` is true
    (allowLocal ? '?' : '') +
    ')' +
    // port number
    '(?::\\d{2,5})?' +
    // resource path
    '(?:/[^\\s]*)?' +
    '$', 'i'
  )
})())

var date = function (year, month, day, notInFuture) {
  if (isNaN(year) || isNaN(month) || isNaN(day)) {
    return false
  }
  if (day.length > 2 || month.length > 2 || year.length > 4) {
    return false
  }

  day = parseInt(day, 10)
  month = parseInt(month, 10)
  year = parseInt(year, 10)

  if (year < 1000 || year > 9999 || month <= 0 || month > 12) {
    return false
  }
  var numDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
  // Update the number of days in Feb of leap year
  if (year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0)) {
    numDays[1] = 29
  }

  // Check the day
  if (day <= 0 || day > numDays[month - 1]) {
    return false
  }

  if (notInFuture === true) {
    var currentDate = new Date(),
      currentYear = currentDate.getFullYear(),
      currentMonth = currentDate.getMonth(),
      currentDay = currentDate.getDate()
    return (year < currentYear || (year === currentYear && month - 1 < currentMonth) || (year === currentYear && month - 1 === currentMonth && day < currentDay))
  }

  return true
}

var id = {
  validator (rule, value, callback) {
    if (value === '') {
      callback()
    }

    var error = () => callback(new Error('身份证号填写错误, 请重新填写'))
    value = value.trim()
    if (!/^\d{15}$/.test(value) && !/^\d{17}[\dXx]{1}$/.test(value)) {
      error()
    }
    // Check date of birth
    var dob
    if (value.length === 18) {
      dob = value.substr(6, 8)
    } else /* length == 15 */ {
      dob = '19' + value.substr(6, 6)
    }
    var year = parseInt(dob.substr(0, 4), 10),
      month = parseInt(dob.substr(4, 2), 10),
      day = parseInt(dob.substr(6, 2), 10)
    if (!date(year, month, day)) {
      error()
    }

    // Check checksum (18-digit system only)
    if (value.length === 18) {
      var sum = 0,
        weight = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
      for (var i = 0; i < 17; i++) {
        sum += parseInt(value.charAt(i), 10) * weight[i]
      }
      sum = (12 - (sum % 11)) % 11
      var checksum = (value.charAt(17)
        .toUpperCase() !== 'X') ? parseInt(value.charAt(17), 10) : 10
      if (checksum === sum) {
        callback()
      } else {
        error()
      }
    }

    callback()
  },
  trigger: _TRIGGER_
}
// var strDefault = str(1, 45, getStrMsgByLength(45))
var name = function (min, max, msg, trigger) {
    msg = msg || `支持${min}~${max}位的中文、英文（大小写）、整数、下划线、中线、/、. 、空格等输入`
    return {
      validator: function (rule, value, callback) {
        if (value == undefined || value == '') {
          callback()
        }
        var reg = new RegExp('^[a-zA-Z0-9_\-/.\s\u0391-\uFFE5]{' + min + ',' + max + '}$')
        // var reg = new RegExp('^[\\u0391-\\uFFE5|a-z|A-Z|0-9|_|\\-|/|.|[\s\S]]{' + min + ',' + max + '}$')
        if (!reg.test(value)) {
          callback(new Error(msg))
        }
        callback()
      },
      trigger: trigger || _TRIGGER_
    }
  },
  name30 = name(1, 30),
  name64 = name(1, 64)
export default {
  required: required(),
  account64,
  str16,
  str18,
  str20,
  str24,
  str25,
  str32,
  str36,
  str40,
  str45,
  str50,
  str64,
  str80,
  str100,
  str128,
  str150,
  str250,
  str1000,
  str1500,
  strDefault,
  isInt,
  int4,
  int5,
  int6,
  int10,
  int11,
  int18,
  int20,
  int24,
  int25,
  int32,
  int36,
  int50,
  int64,
  int1_100,
  num,
  num20,
  num99,
  num128,
  num100,
  num512,
  num999,
  num1000,
  num3000,
  num3600,
  num9999,
  num99999,
  name,
  name30,
  name64,
  level,
  gbId,
  gbId2,
  civilCode,
  chanNo,
  id,
  ip,
  multiIp,
  ip4gb,
  port,
  email,
  maxWay,
  latitude,
  longitude,
  password,
  password2,
  gbIdStep,
  gbIdTimes,
  serviceSize,
  cloudPersize,
  extraChannelNo,
  presetPositions,
  deviceInfoPrice,
  vodInCount6,
  trunkInCount6: vodInCount6,
  platformNum,
  isNum,
  macAddr,
  phone,
  uri,
  ptzIdleTime,
  projectNumber,
  nodeNumber,
  remote
}
