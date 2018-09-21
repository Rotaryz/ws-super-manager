<template>
  <div class="search-box">
    <div class="input-box-big">
      <span class="after"></span>
      <form autocomplete="off">
        <input type="text" class="input-box" v-model="txt" :placeholder="placeholerTxt" autocomplete="off">
      </form>
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
        inputTxt: '',
        txt: ''
      }
    },
    methods: {
      setInput(txt) {
        this.txt = txt
      },
      searchFn() {
        this.$emit('search', this.txt)
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
        border: 0.5px solid $color-textD9
        width: 224px
        border-radius: 4px
        height: 27px
        font-size: $font-size-small12
        font-family: $fontFamilyRegular
        color: $color-text33
        text-indent: 8px
        line-height: 28px
        transition: all 0.4s ease-out
      .after
        border-top: 0.5px solid transparent
        border-bottom: 0.5px solid transparent
        position: absolute
        z-index: 5
        height: 29px
        width: 0
        right: 0
        top: -1px
        box-sizing: content-box
        border-radius 4px
        transition: all 0.4s ease-out
      .before
        border-right: 0.5px solid transparent
        border-left: 0.5px solid transparent
        position: absolute
        z-index: 5
        height: 0
        width: 225.5px
        bottom: 0
        left: -1px
        box-sizing: content-box
        border-radius 4px
        transition: all 0.4s ease-out
      &:hover
        .input-box
          border: 0.5px solid transparent
          transition: all 0.4s ease-out
        .after
          border-color: $color-text99
          transition: all 0.4s ease-out
          width: 225.5px
        .before
          border-color: $color-text99
          transition: all 0.4s ease-out
          height: 29px

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
      box-sizing: border-box
      font-family: $fontFamilyRegular
      color: $color-white
      margin-left: 20px
      font-size: $font-size-small12
      transition: font-size 0.4s ease-out
      &:hover
        transition: font-size 0.4s ease-out
        font-size: 13px


</style>
