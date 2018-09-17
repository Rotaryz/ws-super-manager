<template>
  <div class="admin-select">
    <div class="select-item" v-for="(item,index) in select" :key="index"
         @click.stop="selectType(item.type, index)">
      <!--<span class="select-title">{{item.title}}</span>-->
      <div class="admin-big-box" :class="{'input-height':item.select}" v-for="(items,idx) in item.children" :key="idx">
        <div class="admin-select-box input-height-item" :class="{'admin-select-box-active': item.show}">{{items.content}}
          <img src="./icon-dropdown@2x.png" class="city-tap-top" :class="{'city-tap-top-active': item.select}">
          <!--<span class="city-tap-top" :class="{'city-tap-bottom':item.show && item.select,'city-tap-top-two': item.show && !item.select}"></span>-->
          <transition name="fade">
            <ul class="select-child" v-show="item.select" @mouseleave="leaveHide(index)" @mouseenter="endShow">
              <li class="select-child-item" v-for="(child, chIdx) in items.data" :key="chIdx" @click.stop="setValue(child,index,idx)">
                {{child.title}}
              </li>
            </ul>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      select: {
        type: Array,
        default: () => [{
          select: false,
          show: false,
          children: [{content: '全部', data: []}]
        }]
      },
      isUse: {
        type: Boolean,
        default: true
      }
    },
    created() {
      window.onclick = () => {
        this.select.forEach((item) => {
          item.select = false
        })
      }
    },
    data() {
      return {
        setTime: ''
      }
    },
    methods: {
      clickHide(index) {
        this.select[index].select = false
      },
      endShow() {
        clearTimeout(this.setTime)
      },
      leaveHide(index) {
        this.setTime = setTimeout(() => {
          this.clickHide(index)
        }, 1500)
      },
      selectType(type, index) {
        if (!this.isUse) {
          return
        }
        this.select[index].select = !this.select[index].select
        this.select.forEach((item, idx) => {
          if (idx !== index) {
            item.select = false
          }
        })
        this.select[index].show = true
        this.$emit('selectType', type, this.select)
      },
      setValue(value, index, idx) {
        this.select[index].select = false
        this.select[index].children[idx].content = value.title
        this.$emit('setValue', value, idx)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import '~common/stylus/mixin'
  .admin-select
    box-sizing: border-box
    display: flex

  .select-item
    display: flex
    align-items: center
    position: relative
    &:first-child
      margin-left: 0px

  .select-title
    font-size: $font-size-medium
    line-height: 17px
    no-wrap()

  .admin-big-box
    cursor: pointer
    margin-left: 10px
    box-sizing: border-box
    border-radius: 4px
    font-size: $font-size-medium
    color: $color-text-little
    position: relative
    .admin-select-box
      min-width: 48px
      border-radius: 4px
      border 0.5px solid $color-textD9
      padding: 0 31px 0 15px
      line-height: 26px
      white-space: nowrap
      font-size: $font-size-small12
      position: relative
      color: $color-text-66
      &:after
        content: ''
        border-top: 0.5px solid transparent
        border-bottom: 0.5px solid transparent
        position: absolute
        z-index: 5
        height: 100%
        width: 0
        right: 0
        top: -0.5px
        border-radius 4px
        box-sizing: content-box
        transition: all 0.3s ease-out
      &:before
        content: ''
        border-right: 0.5px solid transparent
        border-left: 0.5px solid transparent
        position: absolute
        z-index: 5
        height: 0
        width: 100%
        bottom: 0
        left: 0
        border-radius 4px
        box-sizing: content-box
        transition: all 0.3s ease-out
      &:hover
        border: 0.5px solid transparent
        transition: all 0.3s ease-out
        &:after
          border-color: $color-text99
          transition: all 0.3s ease-out
          width: 100%
        &:before
          border-color: $color-text99
          transition: all 0.3s ease-out
          height: 100%

      .city-tap-top
        width: 9px
        col-center()
        right: 16px
        transform-origin: 50% 0%
        transform: rotate(0deg) translateY(-50%)
        transition: transform 0.3s
      .city-tap-top-active
        transform-origin: 50% 0%
        transform: rotate(180deg) translateY(-50%)
        transition: transform 0.3s
      .select-child
        left: 0
        background: $color-white
        z-index: 300
        position: absolute
        width: 100%
        border-radius: 3px
        box-shadow: 0 1px 5px 0 rgba(12, 6, 14, 0.20)
        margin-top: 4px
        max-height: 228px
        overflow-y: auto
        &.fade-enter, &.fade-leave-to
          opacity: 0
        &.fade-enter-to, &.fade-leave-to
          transition: opacity .3s ease-in-out
        .select-child-item
          white-space: nowrap
          color: $color-text33
          padding: 0 10px
          text-align: left
          height: 26px
          line-height: 26px
          font-size: $font-size-medium
          &:hover
            background: $color-big-background
    .admin-select-box-active
      color: $color-text33
</style>
