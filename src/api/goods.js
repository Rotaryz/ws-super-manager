import request from '../common/js/request'

export default {
  /**
   * 登录
   * @param data
   * @returns {*}
   */
  goods(data) {
    let url = '/api/admin/goods'
    return request.post(url, data)
  }
}
