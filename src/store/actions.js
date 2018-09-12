import * as TYPES from './mutation-types'

export const setTitleArr = function ({commit, state}, arr) {
  commit(TYPES.SET_TITLE_ARR, arr)
}
