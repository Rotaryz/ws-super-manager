// 将所有的接口请求都通过这个统一输出
import login from './login'
import goods from './goods'
import data from './data'

// 登录
export const Login = login
// 商品
export const Goods = goods
// 图表数据
export const Data = data
