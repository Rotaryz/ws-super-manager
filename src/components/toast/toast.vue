<template>
  <transition name="fade">
    <div class="toast" v-show="showToast">
      <div class="content">{{content}}</div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  export default {
    data() {
      return {
        showToast: false,
        content: 'carNumber error!'
      }
    },
    methods: {
      show(content, time) {
        this.content = content
        this.showToast = true
        const showTime = time || 1000
        setTimeout(() => {
          this.showToast = false
        }, showTime)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '~common/stylus/variable'
  @import '~common/stylus/mixin'

  .toast
    all-center()
    z-index: 9999
    min-width: 200px
    max-width: 300px
    margin-left: -100px
    padding: 10px 20px
    opacity: .9
    border-radius: 6px
    transition: all .5s ease-out
    text-align: center
    background-color: rgba(0, 0, 0, .8)
    .content
      line-height: 20px
      font-size: $font-size-medium14
      color: $color-white

</style>
