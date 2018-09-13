<template>
  <div class="agent-order">
    <div class="content-top">
      <div class="left">
        <DateSelect @checkTime="checkTime"></DateSelect>
        <Search></Search>
      </div>
      <div class="excel">导出Excel</div>
    </div>
    <div class="content-list">
      <div class="list-header">
        <span class="header-key" v-for="item in headerList">{{item}}</span>
      </div>
      <div class="list-content">
        <div class="list-item" v-for="val in arr">
          <div class="item">
            <img class="head-img" src="" alt="">
          </div>
          <span class="item">啦啦啦</span>
          <span class="item">男</span>
          <span class="item">广东广州</span>
          <span class="item">13584260103</span>
          <div class="long-item">
            <span>收货人：市民老王</span>
            <span>手机号：13584260103</span>
            <p>收获地址：广东省广州市海珠区新港街道新港中路397号</p>
          </div>
          <span class="item">100</span>
          <span class="item">780.00</span>
          <span class="item">2018-09-12</span>
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
    name: 'agent-order',
    data() {
      return {
        headerList: ['客户头像', '客户昵称', '性别', '地区', '手机号', '收货地址', '完成订单', '消费金额', '加入时间'],
        arr: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
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
    },
    methods: {
      checkTime(status) {
        console.log(status)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import '~common/stylus/mixin'
  .agent-order
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
          text-align: left
          &:nth-of-type(6)
            flex: 3.8
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
          .item
            flex: 1
          .long-item
            flex: 3.8
            line-height: 18px


</style>
