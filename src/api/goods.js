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
  }
}
