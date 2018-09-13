<template>
  <div class="member-list">
    <div class="content-top">
      <div class="left">
        <DateSelect @checkTime="checkTime"></DateSelect>
        <Search></Search>
      </div>
      <!--<AdminSelect></AdminSelect>-->
      <div class="excel">导出Excel</div>
    </div>
    <div class="content-list">
      <div class="list-header">
        <span class="header-key">团长</span>
        <span class="header-key">激活码</span>
        <div class="handle-click header-key" @click="handleClick(0)"><span class="contxt" :class="headClass.class0" >成员数</span></div>
        <div class="header-key" @click="handleClick(1)"><span class="contxt" :class="headClass.class1" >潜在客户数</span></div>
        <div class="header-key" @click="handleClick(2)"><span class="contxt" :class="headClass.class2" >消费客户数</span></div>
        <div class="header-key" @click="handleClick(3)"><span class="contxt" :class="headClass.class3" >订单数</span></div>
      </div>
      <div class="list-content">
        <div class="list-item" v-for="val in arr">
          <span class="item">某某某</span>
          <span class="item">100</span>
          <span class="item">100</span>
          <span class="item">100</span>
          <span class="item">100</span>
          <span class="item">100</span>
        </div>
      </div>
    </div>
    <PageDetail></PageDetail>
  </div>
</template>

<script>
  import Search from 'components/search/search' // 搜索框
  import AdminSelect from 'components/admin-select/admin-select' // 下拉框
  import DateSelect from 'components/date-select/date-select' // 下拉框
  import PageDetail from 'components/page-detail/page-detail' // 下拉框

  export default {
    name: 'member-list',
    data() {
      return {
        arr: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        // headClass: ['on', 'on', 'on', 'on'],
        headClass: {
          class0: 'on',
          class1: 'on',
          class2: 'on',
          class3: 'on'
        }
      }
    },
    methods: {
      checkTime(status) {
        console.log(status)
      },
      handleClick(num) {
        if (this.headClass[`class${num}`] === 'on') {
          this.headClass[`class${num}`] = 'down'
        } else if (this.headClass[`class${num}`] === 'down') {
          this.headClass[`class${num}`] = 'up'
        } else {
          this.headClass[`class${num}`] = 'on'
        }
      }
    },
    components: {
      Search,
      AdminSelect,
      DateSelect,
      PageDetail
    },
    mounted() {
      // this.$emit('showShade')
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import '~common/stylus/mixin'
  .member-list
    display: flex
    flex-direction: column
    background: $color-white
    border-radius: 5px
    box-shadow: 0 1px 6px 0 rgba(0,8,39,0.10)
    padding: 30px
    height: 100%
    padding-top: 0
    box-sizing: border-box
    .content-top
      display: flex
      justify-content: space-between
      align-items: center
      height: 88px
      .left
        display: flex
    .content-list
      text-align: left
      flex: 1
      font-size: 14px
      margin-bottom: 23px
      .list-header
        flex: 1
        background: $color-FAFAFA
        height: 7.6%
        line-height: 50px
        font-family: $fontFamilyMeddle
        display: flex
        justify-content: space-between
        padding-left: 40px
        color: $color-text33
        border-bottom: 1px solid $color-line
        .header-key
          flex: 1
          cursor: pointer
          .contxt
            position: relative
            &:before
            &:after
              content:''
              display: inline-block
              width: 0
              height: 0
              border: 5px solid $color-text99
              border-top: 4px solid transparent
              border-right-color: transparent
              border-bottom: 4px solid transparent
              position: absolute
              right: -16px
              top: 0
              transform: rotate(-90deg)
            &:after
              transform: rotate(90deg)
              top: 13px
          .down:after
            border-left-color: $color-4985FC
          .up:before
            border-left-color: $color-4985FC
      .list-content
        height: 92.4%
        .list-item
          height: 10%
          flex: 1
          display: flex
          align-items: center
          justify-content: space-between
          padding-left: 40px
          box-sizing: border-box
          border-bottom: 1px solid $color-line
          text-align: left
          .item
            flex: 1
</style>
