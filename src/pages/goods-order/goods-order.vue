<template>
  <div class="activity">
    <div class="ac-tab">
      <date-select @checkTime="checkTime"></date-select>
      <admin-select :select="activityType" role="activity" @setValue="setType"></admin-select>
      <search @search="searchBtn"></search>
      <div class="excel">导出Excel</div>
    </div>
    <ul class="tab-list">
      <li class="item" v-for="(item, index) in tabStatus" v-bind:key="index" :class="indexActive === index ? 'active' : ''" @click="checkTab(item, index)">{{item.text}}</li>
    </ul>
    <div class="form-list">
      <div class="list-header">
        <div class="list-item" v-for="(item, index) in titleList" :key="index">
          {{item}}
        </div>
      </div>
      <div class="list">
        <div class="list-box" v-for="(item, index) in goodsList" :key="index">
          <div class="list-item list-text">{{item.order_sn}}</div>
          <div class="list-item list-text">{{item.title}}</div>
          <div class="list-item list-text">{{item.price}}</div>
          <div class="list-item list-text">{{item.num}}</div>
          <div class="list-item list-text">{{item.total_price}}</div>
          <div class="list-item list-text">{{item.source}}</div>
          <div class="list-item list-text">{{item.name}}</div>
          <div class="list-item list-text">{{item.created_at}}</div>
          <div class="list-item list-text">{{item.status}}</div>
        </div>
      </div>
      <div class="page">
        <page-detail ref="page" :pageDtail="goodsPage" @addPage="goPage"></page-detail>
      </div>
    </div>
  </div>
</template>

<script>
  import Search from 'components/search/search' // 搜索框
  import AdminSelect from 'components/admin-select/admin-select' // 下拉框
  import DateSelect from 'components/date-select/date-select' // 下拉框
  import PageDetail from 'components/page-detail/page-detail' // 下拉框
  import {Order} from 'api'
  import {ERR_OK} from 'common/js/config'
  const TITLELIST = ['订单号', '商品信息', '单价', '数量', '实付金额', '业务类型', '下单用户', '下单时间', '状态']
  const ORDERSTATUS = [{text: '全部订单', status: 0}, {text: '待付款', status: 1}, {text: '待发货', status: 2}, {text: '待收货', status: 3}, {text: '已完成', status: 4}, {text: '已关闭', status: 4}]

  export default {
    name: 'goods-order',
    data() {
      return {
        titleList: TITLELIST,
        activityType: [{
          select: false,
          show: false,
          children: [{content: '活动类型', data: []}]
        }],
        tabStatus: ORDERSTATUS,
        rqData: {
          time: 'today',
          start_time: 0,
          end_time: 0,
          order_sn: '',
          trade_type: 0,
          page: 1,
          status: 1,
          limit: 10
        },
        goodsList: [],
        goodsPage: {
          total: 0, // 总数量
          per_page: 10, // 一页条数
          total_page: 1 // 总页数
        },
        indexActive: 0
      }
    },
    methods: {
      getGoodsOrdersData() {
        Order.shopOrder(this.rqData).then((res) => {
          if (res.error === ERR_OK) {
            this.goodsList = res.data
            this.goodsPage.total = res.meta.total
            this.goodsPage.per_page = res.meta.per_page
            this.goodsPage.total_page = res.meta.last_page
            this.$emit('setNull', !this.goodsList.length)
          } else {
            this.$emit('setNull', true)
            this.$emit('showToast', res.message)
          }
        })
      },
      checkTime(index) {
        if (index.constructor === Array) {
          this.rqData.start_time = index[0]
          this.rqData.end_time = index[1]
          this.rqData.time = ''
        } else {
          this.rqData.start_time = ''
          this.rqData.end_time = ''
          this.rqData.time = index
        }
        this.rqData.page = 1
        this.$refs.page.beginPage()
        this.getGoodsOrdersData()
      },
      setType(type) {
        this.rqData.trade_type = type.status
        this.rqData.page = 1
        this.$refs.page.beginPage()
        this.getGoodsOrdersData()
      },
      checkTab(item, index) {
        this.indexActive = index
        this.rqData.status = item.status
        this.rqData.page = 1
        this.$refs.page.beginPage()
        this.getGoodsOrdersData()
      },
      searchBtn(text) {
        this.rqData.order_sn = text
        this.rqData.page = 1
        this.$refs.page.beginPage()
        this.getGoodsOrdersData()
      },
      goPage(page) {
        this.rqData.page = page
        this.getGoodsOrdersData()
      }
    },
    components: {
      Search,
      AdminSelect,
      DateSelect,
      PageDetail
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import '~common/stylus/mixin'
  .activity
    height: 100%
    background: $color-white
    padding: 0 1.5vw
    display: flex
    flex-direction: column

  .ac-tab
    min-height: 8.14vh
    box-sizing: border-box
    padding: 2.8vh 0
    display: flex
    position: relative
    .excel
      right: 0
      col-center()

  .form-list
    font-size: $font-size-medium14
    font-family: $fontFamilyRegular
    flex: 1

  .list-header, .list-box
    width: 100%
    display: flex
    align-items: center
    padding-left: 2vw
    box-sizing: border-box

  .list-header
    width: 100%
    height: 9.1%
    white-space: nowrap
    border-bottom: 1px solid $color-line
    background: $color-big-background
    .list-item
      font-family: $fontFamilyMeddle
      color: $color-text33

  .list
    height: 81.8%
    display: flex
    flex-direction: column
    .list-box
      height: 10%
      overflow: hidden
      border-bottom: 1px solid $color-line
      .list-item
        line-height: 16px
        color: $color-text33
        font-size: $font-size-medium14
        .pic-box
          height: 40px
          width: 40px
          overflow: hidden
          background: $color-text33
          .pic
            width: 40px
      .list-item-tap
        font-size: $font-size-small12
        color: rgba(0, 0, 0, .1)
      .list-text
        no-wrap()
        width: 90%
        color: $color-text-66
    no-wrap()

  .list-item-img
    width: 60px
    height: 40px
    border: none
    display: block

  .list-item
    color: $color-text
    flex: 1
    position: relative
    text-align: left
    overflow: hidden
    .showDetail
      cursor: pointer
      font-size: $font-size-small
      color: $color-nomal
      border-radius: 3px
      .audit-disable
        color: $color-text-little
      .audit
        color: $color-nomal
    &:nth-child(1)
      flex: 1.2
    &:nth-child(2)
      flex: 1.5
      white-space: normal !important
      padding-right: 5px

  .list-box-active
    background: $color-background
  .tab-list
    layout(row)
    margin-bottom: 20px
    border-bottom-1px()
    .item
      cursor: pointer
      background: $color-FAFAFA
      width: 120px
      font-size: $font-size-medium14
      font-family: $fontFamilyRegular
      color: #222
      height: 46px
      line-height: 46px
      border-top: 1px solid #e1e4e5
      border-right: 1px solid #e1e4e5
      box-sizing: border-box
      &:nth-child(1)
        border-left: 1px solid #e1e4e5
      &.active
        background: #fff
        position: relative
        &:after
          content: ""
          position: absolute
          bottom: -2px
          left: 0
          width: 100%
          border-bottom: 3px solid #fff
        &:before
          content: ""
          position: absolute
          top: 0
          left: 0
          width: 100%
          border-bottom: 4px solid #4985FC

  .page
    height: 9.1%
</style>
