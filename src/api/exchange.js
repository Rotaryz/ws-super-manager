import request from '../common/js/request'

export default {
  /**
   * 交易明细列表
   * @param data
   * @returns {*}
   */
  exchangeList(data) {
    let url = '/api/admin/trade-index'
    return request.get(url, data)
  },
  /**
   * 交易明细列表导出excel
   * @param data
   * @returns {*}
   */
  exchangeListExcel(data) {
    let url = '/api/admin/trade-index-excel'
    return request.get(url, data)
  },
  /**
   * 提现列表
   * @param data
   * @returns {*}
   */
  withdrawList(data) {
    let url = '/api/admin/withdraw-index'
    return request.get(url, data)
  },
  /**
   * 提现审核
   * @param data
   * @returns {*}
   */
  withdrawAudit(data) {
    let url = '/api/admin/withdraw-index'
    return request.get(url, data)
  },
  /**
   * 提现审核
   * @param data
   * @returns {*}
   */
  withdrawListExcel(data) {
    let url = '/api/admin/withdraw-index-excel'
    return request.get(url, data)
  }
}
