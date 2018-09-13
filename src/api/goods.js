import request from '../common/js/request'

export default {
  /**
   * 商品列表
   * @param data
   * @returns {*}
   */
  goods(data) {
    let url = '/api/admin/goods'
    return request.get(url, data)
  },
  /**
   * 活动列表
   * @param data
   * @returns {*}
   */
  activities(data) {
    let url = '/api/admin/activities'
    return request.get(url, data)
  }
}
