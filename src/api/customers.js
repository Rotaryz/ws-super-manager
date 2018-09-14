import request from '../common/js/request'

export default {
  /**
   * 消费客户
   * @param data
   * @returns {*}
   */
  getAgentOrderList(data) {
    let url = '/api/admin/consumption-index'
    return request.get(url, data)
  },
  /**
   * 潜在客户
   * @param data
   * @returns {*}
   */
  getRetailOrderList(data) {
    let url = '/api/admin/potential-index'
    return request.get(url, data)
  }
}
