import request from '../common/js/request'

export default {
  /**
   * 团队列表
   * @param data
   * @returns {*}
   */
  getMemberList(data) {
    let url = '/api/admin/consumption-index'
    return request.get(url, data)
  },
  /**
   * 商家列表
   * @param data
   * @returns {*}
   */
  getBusinessList(data) {
    let url = '/api/admin/potential-index'
    return request.get(url, data)
  }
}
