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
    let url = '/api/admin/total-mode'
    return request.get(url, data)
  },
  /**
   * 总筛选图标
   * @param data
   * @returns {*}
   */
  totalChart(type = 1, date_type = 1) {
    let data = {
      type,
      date_type
    }
    let url = '/api/admin/total-chart'
    return request.get(url, data)
  }
}
