import request from '../common/js/request'

export default {
  /**
   * 团队列表
   * @param data
   * @returns {*}
   */
  getMemberList(data) {
    let url = '/api/admin/team-list'
    return request.get(url, data)
  },
  /**
   * 商家列表
   * @param data
   * @returns {*}
   */
  getBusinessList(data) {
    let url = 'api/admin/merchant-list'
    return request.get(url, data)
  },
  /**
   * 开通商家
   * @param data
   * @returns {*}
   */
  openBusiness(data) {
    let url = 'api/admin/merchant-open'
    return request.get(url, data)
  },
  /**
   * 冻结商家
   * @param data
   * @returns {*}
   */
  frozenBusiness(data) {
    let url = 'api/admin/merchant-frozen'
    return request.get(url, data)
  },
  /**
   * 解冻商家
   * @param data
   * @returns {*}
   */
  unfreezeBusiness(data) {
    let url = 'api/admin/merchant-unfreeze'
    return request.get(url, data)
  },
  /**
   * 越权
   * @param data
   * @returns {*}
   */
  overPower(data) {
    let url = 'api/admin/merchant-over-power'
    return request.post(url, data)
  },
  /**
   * 越权
   * @param data
   * @returns {*}
   */
  previewMerchant(data) {
    let url = 'api/admin/merchant-preview'
    return request.get(url, data)
  }
}
