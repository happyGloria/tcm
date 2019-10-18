import Router from 'vue-router'
import Layout from '@/pages/layout/Layout'
const login = () => import('@/pages/_login/index')
const errorPage = () => import('@/pages/_errorPage/index')
const page_404 = () => import('@/pages/_errorPage/404')
const sysNode = () => import('@/pages/_sys/node/index')
const sysRole = () => import('@/pages/_sys/role/index')
const sysUser = () => import('@/pages/_sys/user/index')
const sysDrive = () => import('@/pages/_sys/driver/index')
const sysConfig = () => import('@/pages/_sys/config/index')
const sysGB = () => import('@/pages/_sys/gb/index')
const deviceList = () => import('@/pages/_device/list/index')
const deviceZone = () => import('@/pages/_device/zone/index')
const deviceWall = () => import('@/pages/_device/wall/index')
const storeList = () => import('@/pages/_store/list/index')
const gbStatus = () => import('@/pages/_gbStatus/index')
/**
  * hidden: true                   true 不在菜单栏显示
  * redirect: noredirect
  * name: 'router-name'            必填项
  * meta: {
      title: 'title'               菜单栏名称
      icon: 'svg-name'             菜单栏图标
      roles: ['0', '1']            权限
    }
**/
export const constantRouterMap = [
  {
    path: '/login',
    component: login,
    hidden: true
  },
  {
    path: '/errorPage',
    component: errorPage,
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    name: 'root',
    redirect: '/sys/node',
    hidden: true
  },
  {
    path: '*',
    component: page_404,
    hidden: true
  }
]

export const asyncRouterMap = [
  {
    path: '/sys',
    name: 'sys',
    component: Layout,
    redirect: '/sys/node',
    meta: {
      title: '系统管理',
      icon: 'sys',
      roles: [0, 1]
    },
    children: [
      {
        path: '/sys/node',
        name: 'sys-node',
        meta: {
          title: '节点管理',
          icon: 'sys-line',
          roles: [0, 1]
        },
        component: sysNode
      },
      {
        path: '/sys/role',
        name: 'sys-role',
        meta: {
          title: '角色管理',
          icon: 'sys-role',
          roles: [1]
        },
        component: sysRole
      },
      {
        path: '/sys/user',
        name: 'sys-user',
        meta: {
          title: '用户管理',
          icon: 'sys-user',
          roles: [0, 1]
        },
        component: sysUser
      },
      {
        path: '/sys/drive',
        name: 'sys-drive',
        meta: {
          title: '驱动管理',
          icon: 'sys-drive',
          roles: [0]
        },
        component: sysDrive
      },
      {
        path: '/sys/config',
        name: 'sys-config',
        meta: {
          title: '系统设置',
          icon: 'sys-config',
          roles: [0, 1]
        },
        component: sysConfig
      },
      {
        path: '/sys/gb',
        name: 'sys-gb',
        meta: {
          title: '本地国标配置',
          icon: 'gb',
          roles: [1]
        },
        component: sysGB
      }
    ]
  },
  {
    path: '/device',
    name: 'device',
    component: Layout,
    redirect: '/device/list',
    meta: {
      title: '设备管理',
      icon: 'device',
      roles: [1]
    },
    children: [
      {
        path: '/device/list',
        name: 'device-list',
        meta: {
          title: '设备列表',
          icon: 'device-list',
          roles: [1]
        },
        component: deviceList
      },
      {
        path: '/device/zone',
        name: 'device-zone',
        meta: {
          title: '摄像机分区',
          icon: 'Camera',
          roles: [1]
        },
        component: deviceZone
      },
      {
        path: '/device/wall',
        name: 'device-wall',
        meta: {
          title: '电视墙',
          icon: 'monitor',
          roles: [1]
        },
        component: deviceWall
      },
      {
        path: '/device/map',
        name: 'device-map',
        meta: {
          title: '地图测试',
          icon: 'monitor',
          roles: [1]
        },
        component: () => import('@/pages/_device/map')
      }
    ]
  },
  {
    path: '/store',
    name: 'store',
    component: Layout,
    redirect: '/store/list',
    meta: {
      title: '存储管理',
      icon: 'store',
      roles: [1]
    },
    children: [
      {
        path: '/store/list',
        name: 'store-list',
        meta: {
          title: '存储计划',
          icon: 'store',
          roles: [1]
        },
        component: storeList
      }
    ]
  },
  {
    path: '/gbStatus',
    name: 'gbStatus',
    component: Layout,
    redirect: '/gbStatus/parent',
    meta: {
      title: '国标注册信息',
      icon: 'status',
      roles: [1]
    },
    children: [
      {
        path: '/gbStatus/parent',
        name: 'gbStatus-parent',
        meta: {
          title: '上级状态',
          icon: 'parent',
          roles: [1]
        },
        component: gbStatus
      },
      {
        path: '/gbStatus/child',
        name: 'gbStatus-child',
        meta: {
          title: '下级状态',
          icon: 'child',
          roles: [1]
        },
        component: gbStatus
      },
      {
        path: '/gbStatus/user',
        name: 'gbStatus-user',
        meta: {
          title: '用户状态',
          icon: 'user',
          roles: [1]
        },
        component: gbStatus
      }
    ]
  }
]

export default new Router({
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRouterMap
})
