// 将所有的接口请求都通过这个统一输出
import login from './login'
import goods from './goods'
import customers from './customers'
import business from './business'
import data from './data'
import exchange from './exchange'
import order from './order'

// 登录
export const Login = login
// 商品
export const Goods = goods
// 客户
export const Customers = customers
// 商家
export const Business = business
// 图表数据
export const Data = data
// 财务交易
export const Exchange = exchange
// 订单
export const Order = order
