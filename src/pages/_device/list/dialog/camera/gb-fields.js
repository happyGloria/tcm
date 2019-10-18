import reg from '@/data/reg'
export default function (me) {
  return [
    {
      tag: 'el-input',
      name: 'gbId',
      label: '国标编号',
      tip: '必填, 允许输入13或20位长度的数字',
      rules: [
        reg.required,
        reg.gbId2
      ],
      createFunction: 'formItem'
    },
    {
      tag: 'el-input',
      name: 'gbName',
      label: '名称',
      rules: [
        reg.str64
      ],
      createFunction: 'formItem'
    },
    {
      tag: 'el-input',
      name: 'civil',
      label: '行政区划编号',
      tip: '必填项, 允许输入1~20位长度的数字',
      rules: [
        reg.required,
        reg.civilCode
      ],
      createFunction: 'formItem'
    }, {
      tag: 'el-select',
      name: 'registerWay',
      label: '注册方式',
      default: '1',
      rules: [
        reg.required
      ],
      createFunction: 'formItem'
    },
    {
      tag: 'el-input',
      name: 'manufacture',
      label: '设备厂商',
      rules: [
        reg.str64
      ],
      createFunction: 'formItem'
    },
    {
      tag: 'el-input',
      name: 'model',
      label: '设备型号',
      rules: [
        reg.str64
      ],
      createFunction: 'formItem'
    },
    {
      tag: 'el-input',
      name: 'owner',
      label: '设备归属',
      tips: ['建议填写业主名称'],
      rules: [
        reg.str64
      ],
      createFunction: 'formItem'
    },
    {
      tag: 'el-input',
      name: 'certnum',
      label: '证书序列号',
      rules: [
        reg.str64
      ],
      createFunction: 'formItem'
    },
    {
      tag: 'el-select',
      name: 'certifiable',
      label: '证书有效标识',
      default: '1',
      createFunction: 'formItem'
    },
    {
      tag: 'el-input',
      name: 'errCode',
      label: '证书无效原因码',
      rules: [
        reg.str64
      ],
      createFunction: 'formItem'
    },
    {
      // tag: 'el-input',
      tag: 'el-date-picker',
      type: 'datetime',
      name: 'endTime',
      label: '证书终止有效期',
      createFunction: 'formItem'
    },
    {
      tag: 'el-select',
      name: 'secrecy',
      label: '保密属性',
      default: '0',
      createFunction: 'formItem'
    },
    {
      tag: 'el-input',
      name: 'gbIp',
      label: '设备IP',
      rules: [
        reg.ip
      ],
      createFunction: 'formItem'
    },
    {
      tag: 'el-input',
      name: 'gbPort',
      label: '设备端口',
      rules: [
        reg.port
      ],
      createFunction: 'formItem'
    },
    {
      tag: 'el-input',
      name: 'gbPassword',
      label: '设备口令',
      rules: [
        reg.str64
      ],
      createFunction: 'formItem'
    },
    {
      tag: 'el-select',
      name: 'safetyWay',
      label: '信令安全模式',
      default: '0',
      createFunction: 'formItem'
    },
    {
      tag: 'el-input',
      name: 'longitude',
      label: '经度',
      tip: '选填，输入-180-180，最大精确到小数点后16位，摄像机经度位置',
      rules: [
        reg.longitude
      ],
      createFunction: 'formItem'
    },
    {
      tag: 'el-input',
      name: 'latitude',
      label: '纬度',
      tip: '选填，输入-90-90，最大精确到小数点后16位，摄像机纬度位置',
      rules: [
        reg.latitude
      ],
      createFunction: 'formItem'
    },
    {
      tag: 'el-select',
      name: 'ptz',
      label: '摄像机类型',
      createFunction: 'formItem'
    },
    {
      tag: 'el-input',
      name: 'address',
      label: '安装地址',
      rules: [
        reg.str64
      ],
      createFunction: 'formItem'
    },
    {
      tag: 'el-select',
      name: 'parental',
      label: '是否有子设备',
      default: '0',
      createFunction: 'formItem'
    },
    {
      tag: 'el-select',
      name: 'position',
      label: '位置类型',
      createFunction: 'formItem'
    },
    {
      tag: 'el-select',
      name: 'room',
      label: '安装位置',
      default: '1',
      createFunction: 'formItem'
    },
    {
      tag: 'el-select',
      name: 'use',
      label: '摄像机用途',
      default: '1',
      createFunction: 'formItem'
    },
    {
      tag: 'el-input',
      name: 'block',
      label: '警区',
      rules: [
        reg.str64
      ],
      createFunction: 'formItem'
    },
    {
      tag: 'el-select',
      name: 'supplyLight',
      label: '摄像机补光',
      default: '1',
      createFunction: 'formItem'
    },
    {
      tag: 'el-select',
      name: 'direction',
      label: '监视方位',
      default: '1',
      createFunction: 'formItem'
    },
    {
      tag: 'el-select',
      name: 'resolution',
      label: '摄像机分辨率',
      default: '1',
      createFunction: 'formItem'
    },
    {
      tag: 'el-input',
      name: 'businessGroup',
      label: '业务分组ID',
      rules: [
        reg.int20
      ],
      createFunction: 'formItem'
    },
    {
      tag: 'el-input',
      name: 'multicastIp',
      label: '组播IP',
      rules: [
        reg.ip
      ],
      createFunction: 'formItem'
    },
    {
      tag: 'el-input',
      name: 'multicastPort',
      label: '组播端口',
      rules: [
        reg.port
      ],
      createFunction: 'formItem'
    },
    {
      tag: 'el-switch',
      name: 'keepAlive',
      label: '是否检测心跳',
      default: 1,
      data: {
        props: {
          activeValue: 1,
          inactiveValue: 0
        }
      },
      createFunction: 'formItem'
    },
    {
      tag: 'el-input',
      name: 'interval',
      label: '心跳间隔时间',
      default: '15',
      show: () => {
        return me.model.keepAlive == 1
      },
      rules: [
        reg.num3600
      ],
      children: [{
        tag: 'template',
        data: {
          slot: 'append'
        },
        children: ['秒']
      }],
      createFunction: 'formItem'
    }, {
      tag: 'el-input',
      name: 'times',
      label: '心跳检测次数',
      default: '3',
      rules: [
        reg.num100
      ],
      show: () => {
        return me.model.keepAlive == 1
      },
      children: [{
        tag: 'template',
        data: {
          slot: 'append'
        },
        children: ['次']
      }],
      createFunction: 'formItem'
    },
    {
      tag: 'el-switch',
      name: 'auth',
      label: '是否鉴权',
      default: 1,
      data: {
        props: {
          activeValue: 1,
          inactiveValue: 0
        }
      },
      createFunction: 'formItem'
    },
    {
      tag: 'el-switch',
      name: 'adjustTime',
      label: '是否校时',
      default: 1,
      data: {
        props: {
          activeValue: 1,
          inactiveValue: 0
        }
      },
      createFunction: 'formItem'
    },
    {
      tag: 'el-input',
      name: 'storageId',
      label: '存储设备国标ID',
      rules: [
        reg.str64
      ],
      createFunction: 'formItem'
    }
  ]
}
