<template>
  <div class="search-box">
    <input type="text" class="input-box" :placeholder="placeholerTxt" @input="inputIn">
    <div class="btn-box hand" @click="searchFn">{{btnTxt}}</div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      placeholerTxt: {
        type: String,
        default: '请输入订单编号'
      },
      btnTxt: {
        type: String,
        default: '搜 索'
      }
    },
    data() {
      return {
        inputTxt: ''
      }
    },
    methods: {
      inputIn(e) {
        this.inputTxt = e.target.value
      },
      searchFn() {
        this.$emit('search', this.inputTxt)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '~common/stylus/variable'
  @import '~common/stylus/mixin'

  .search-box
    display: flex
    align-items: center
    margin-left: 10px
    .input-box
      width: 224px
      height: 28px
      border: 0.5px solid $color-textD9
      border-radius: 4px
      font-size: $font-size-small12
      font-family: $fontFamilyRegular
      color: $color-text
      box-sizing: border-box
      text-indent: 8px
      line-height: 26px
    .input-box::-webkit-input-placeholder { /* WebKit browsers */
      color: $color-ccc
    }
    :-moz-placeholder { /* Mozilla Firefox 4 to 18 */
      color: $color-ccc
    }
    ::-moz-placeholder { /* Mozilla Firefox 19+ */
      color: $color-ccc
    }
    :-ms-input-placeholder { /* Internet Explorer 10+ */
      color: $color-ccc
    }
    .btn-box
      background: $color-4985FC
      width: 52px
      height: 28px
      text-align: center
      line-height: 28px
      border-radius: 4px
      font-family: $fontFamilyRegular
      font-size: $font-size-small12
      color: $color-white
      margin-left: 20px


</style>
