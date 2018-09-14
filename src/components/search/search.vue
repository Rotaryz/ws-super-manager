<template>
  <div class="search-box">
    <div class="input-box-big">
      <span class="after"></span>
      <input type="text" class="input-box" :placeholder="placeholerTxt" @input="inputIn">
      <span class="before"></span>
    </div>
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
    .input-box-big
      position: relative
      transition: all 0.4s ease-out
      .input-box
        position: relative
        z-index: 10
        box-sizing: border-box
        border: 0.5px solid $color-textD9
        width: 224px
        border-radius: 4px
        height: 27px
        font-size: $font-size-small12
        font-family: $fontFamilyRegular
        color: $color-text33
        text-indent: 8px
        line-height: 26px
        transition: all 0.4s ease-out
      .after
        border-top: 0.5px solid transparent
        border-bottom: 0.5px solid transparent
        position: absolute
        z-index: 5
        height: 28px
        width: 0
        right: 0
        top: -0.5px
        box-sizing: content-box
        border-radius 4px
        transition: all 0.4s ease-out
      .before
        border-right: 0.5px solid transparent
        border-left: 0.5px solid transparent
        position: absolute
        z-index: 5
        height: 0
        width: 225px
        bottom: 0
        left: -1px
        box-sizing: content-box
        border-radius 4px
        transition: all 0.4s ease-out
      &:hover
        .input-box
          border: 0.5px solid transparent
        .after
          border-color: $color-text99
          transition: all 0.4s ease-out
          width: 225px
        .before
          border-color: $color-text99
          transition: all 0.4s ease-out
          height: 28px

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
      color: $color-white
      margin-left: 20px
      font-size: $font-size-small12
      transition: all 0.4s ease-out
      &:hover
        transition: all 0.4s ease-out
        font-size: 13px


</style>
