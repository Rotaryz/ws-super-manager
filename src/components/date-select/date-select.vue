<template>
  <ul class="date">
    <li class="date-item hand" :class="{'date-item-active': tabIndex === index}" v-for="(item, index) in arrTitle" :key="index" @click="checkTab(index)">
      {{item.title}}
      <transition name="fade">
        <div class="block" v-if="item.status === 'set'" v-show="tabIndex === tabActive">
          <el-date-picker
            v-model="moreTime"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
          >
          </el-date-picker>
        </div>
      </transition>
    </li>
  </ul>
</template>

<script>
  const NAV = [{title: '今天', status: 'today'}, {title: '昨天', status: 'yesterday'}, {title: '7天', status: 'week'}, {title: '30天', status: 'month'}, {title: '全部', status: ''}, {title: '自定义', status: 'set'}]
  export default {
    name: 'date-select',
    props: {
      arrTitle: {
        type: Array,
        default: () => NAV
      },
      tabActive: {
        type: Number,
        default: 5
      }
      // tabIndex: {
      //   type: Number,
      //   default: 0
      // }
    },
    data() {
      return {
        showPicker: true,
        moreTime: '',
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now()
          }
        },
        tabIndex: 0
      }
    },
    methods: {
      setDate(times = 0) {
        this.pickerOptions = {
          disabledDate(time) {
            let day1 = new Date()
            day1.setDate(day1.getDate() - times)
            return time.getTime() > day1
          }
        }
      },
      setIndex(index) {
        this.tabIndex = index
      },
      checkTab(index) {
        this.tabIndex = index
        let status = this.arrTitle[index].status
        if (status === 'set') {
          this.moreTime = ''
          return
        }
        this.$emit('checkTime', status)
      }
    },
    watch: {
      moreTime(newVal) {
        let time = []
        if (Array.isArray(newVal)) {
          newVal.forEach((item) => {
            time.push(item.toLocaleDateString().replace(/\//g, '-'))
          })
          this.$emit('checkTime', time)
        }
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import '~common/stylus/mixin'
  .date
    display: flex
    .date-item
      line-height: 28px
      font-size: $font-size-small12
      color: $color-text-66
      width: 60px
      height: 27px
      position: relative
      transition: all 0.3s ease-out
      border: 0.5px solid $color-textD9
      border-left: none
      &:nth-child(1)
        border-left: 0.5px solid $color-textD9
      &:last-child
        border-top-right-radius: 4px
        border-bottom-right-radius: 4px
        &:after
          border-top-right-radius: 4px
          border-bottom-right-radius: 4px
        &:before
          border-top-right-radius: 4px
          border-bottom-right-radius: 4px
      &:first-child
        border-top-left-radius: 4px
        border-bottom-left-radius: 4px
        &:after
          border-top-left-radius: 4px
          border-bottom-left-radius: 4px
        &:before
          border-top-left-radius: 4px
          border-bottom-left-radius: 4px
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
        box-sizing: content-box
        transition: all 0.3s ease-out

    .date-item-active
      transition: all 0.3s ease-out
      color: $color-4985FC
      &:after
        border-color: $color-4985FC
        transition: all 0.3s ease-out
        width: 100%
      &:before
        border-color: $color-4985FC
        transition: all 0.3s ease-out
        height: 100%

  .block
    row-center()
    z-index: 10
    &.fade-enter, &.fade-leave-to
      opacity: 0
      height: 0
    &.fade-enter-to, &.fade-leave-to
      transition: all .3s ease-in-out
</style>
