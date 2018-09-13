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
  }
}
