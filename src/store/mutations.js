import * as TYPES from './mutation-types'

const mutations = {
  [TYPES.SET_TITLE_ARR](state, arr) {
    state.titleArr = arr
  }
}

export default mutations
