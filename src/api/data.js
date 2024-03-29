import request from '../common/js/request'

export default {
  /**
   * 交易金额（昨天/今天)
   * @param data
   * @returns {*}
   */
  exchangeMoney(data) {
    let url = '/api/admin/total-today'
    return request.get(url, data)
  },
  /**
   * 商家/门店/订单数量/金额统计
   * @param data
   * @returns {*}
   */
  totalMode(data) {
    let url = '/api/admin/real-stats'
    return request.get(url, data)
  },
  /**
   * 总筛选图标
   * @param data
   * @returns {*}
   */
  totalChart(data) {
    let url = '/api/admin/history-stats'
    return request.get(url, data)
  }
}
