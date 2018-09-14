// 将所有的接口请求都通过这个统一输出
import login from './login'
import goods from './goods'
import customers from './customers'
import business from './business'

// 登录
export const Login = login
// 商品
export const Goods = goods
// 客户
export const Customers = customers
// 商家
export const Business = business
