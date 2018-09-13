import request from '../common/js/request'

export default {
  /**
   * 商品订单
   * @param data
   * @returns {*}
   */
  shopOrder(data) {
    let url = '/api/admin/order-index'
    return request.get(url, data)
  },
  /**
   * 开通门店列表
   * @param data
   * @returns {*}
   */
  openOrder(data) {
    let url = '/api/admin/store-index'
    return request.get(url, data)
  }
}
