<template>
  <ul class="date">
    <li class="date-item hand" :class="{'date-item-fi-active':index === tabIndex && index === 0,'date-item-ce-active': index === tabIndex && index !== 0, 'date-item-ne-active': index> 0 && index - 1 === tabIndex}" v-for="(item, index) in arrTitle" :key="index" @click="checkTab(index)">
      {{item.title}}
      <div class="block" v-if="item.status === ''" v-show="tabIndex === 4">
        <el-date-picker
          v-model="moreTime"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </div>
    </li>
  </ul>
</template>

<script>
  const NAV = [{title: '今天', status: 'today'}, {title: '昨天', status: 'yesterday'}, {title: '7天', status: 'week'}, {title: '30天', status: 'month'}, {title: '自定义', status: ''}]
  export default {
    name: 'date-select',
    data() {
      return {
        arrTitle: NAV,
        tabIndex: 0,
        showPicker: true,
        moreTime: ''
      }
    },
    methods: {
      checkTab(index) {
        this.tabIndex = index
        let status = this.arrTitle[index].status
        if (!status) {
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
      box-sizing: border-box
      line-height: 28px
      font-size: $font-size-small12
      color: $color-text-66
      width: 60px
      height: 28px
      border-top: 0.5px solid $color-textD9
      border-bottom: 0.5px solid $color-textD9
      position: relative
      &:last-child
        border-right: 0.5px solid $color-textD9
        border-top-right-radius: 4px
        border-bottom-right-radius: 4px
      &:first-child
        border-left: 0.5px solid $color-textD9
        border-top-left-radius: 4px
        border-bottom-left-radius: 4px
        &:after
          display: none
      &:after
        position: absolute
        left: 0
        height: 100%
        width: 1px
        transform: scaleX(0.5)
        background: $color-textD9
        content: ''
    /*第一个*/
    .date-item.date-item-fi-active
      border-color: $color-4985FC
      color: $color-4985FC
      &:after
        background: $color-4985FC
    /*中间*/
    .date-item.date-item-ce-active
      color: $color-4985FC
      border-color: $color-4985FC
      &:after
        background: $color-4985FC
    .date-item.date-item-ne-active
      &:after
        background: $color-4985FC

  .block
    row-center()
</style>
