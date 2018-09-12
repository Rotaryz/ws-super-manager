import request from '../common/js/request'

export default {
  /**
   * 登录
   * @param data
   * @returns {*}
   */
  adminLogin(data) {
    let url = '/api/jwt/admin-login'
    return request.post(url, data)
  }
}
