import Vue from 'vue'
import Router from 'vue-router'
import storage from 'storage-controller'

const Home = () => import('pages/home/home')
const Login = () => import('pages/login/login') // 登录
const Demo = () => import('pages/demo/demo') // 事例
const MemberList = () => import('pages/member-list/member-list') // 事例
const Activity = () => import('pages/activity/activity') // 事例
const Commodity = () => import('pages/commodity/commodity') // 事例
const DataOverview = () => import('pages/data-overview/data-overview') // 事例

Vue.use(Router)

const route = new Router({
  routes: [
    {
      path: '/',
      component: Home,
      children: [{
        path: 'demo',
        component: Demo,
        meta: {
          title: '商家管理,商家列表'
        }
      }, {
        path: '/member-list',
        component: MemberList,
        meta: {
          title: '团队列表'
        }
      }, {
        path: '/business-list',
        component: MemberList,
        meta: {
          title: '商家列表'
        }
      }, {
        path: '/agent-order',
        component: MemberList,
        meta: {
          title: '消费客户'
        }
      }, {
        path: '/retail-order',
        component: MemberList,
        meta: {
          title: '潜在客户'
        }
      }, {
        path: 'activity',
        component: Activity,
        meta: {
          title: '活动管理'
        }
      }, {
        path: 'commodity',
        component: Commodity,
        meta: {
          title: '商品管理'
        }
      }, {
        path: 'data-overview',
        component: DataOverview,
        meta: {
          title: ''
        }
      }]
    },
    {
      path: '/login',
      component: Login
    }
  ]
})
const DEFAULT_ROUTE = '/activity'
const OAUTH_ROUTE = '/login'
route.beforeEach((to, from, next) => {
  if (to.path === '/') {
    const token = storage.get('aiToken')
    if (token) {
      next({path: DEFAULT_ROUTE, replace: true})
    } else {
      next({path: OAUTH_ROUTE, replace: true})
    }
  }
  next()
})
export default route
