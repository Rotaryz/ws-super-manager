<template>
  <div class="activity">
    <div class="ac-tab">
      <date-select @checkTime="checkTime"></date-select>
      <admin-select :select="activityType" role="activity" @setValue="setType"></admin-select>
      <search @search="searchBtn"></search>
      <div class="excel">导出Excel</div>
    </div>
    <div class="form-list">
      <div class="list-header">
        <div class="list-item" v-for="(item, index) in titleList" :key="index">
          {{item}}
        </div>
      </div>
      <div class="list">
        <div class="list-box" v-for="(item, index) in exchangeList" v-bind:key="index">
          <div class="list-item list-text">{{item.order_sn}}</div>
          <div class="list-item list-text">{{item.out_trade_sn}}</div>
          <div class="list-item list-text">{{item.total}}</div>
          <div class="list-item list-text">{{item.source}}</div>
          <div class="list-item list-text"><span v-if="item.trade_type * 1 === 1">支付</span><span v-if="item.trade_type * 1 === 2">退款</span></div>
          <div class="list-item list-text">{{item.nickname}}</div>
          <div class="list-item list-text">{{item.created_at}}</div>
        </div>
      </div>
      <div class="page">
        <!--:pageDtail="pageTotal" @addPage="_addPage"-->
        <page-detail ref="page" :pageDtail="exchagePage" @addPage="goPage"></page-detail>
      </div>
    </div>
  </div>
</template>

<script>
  import Search from 'components/search/search' // 搜索框
  import AdminSelect from 'components/admin-select/admin-select' // 下拉框
  import DateSelect from 'components/date-select/date-select' // 下拉框
  import PageDetail from 'components/page-detail/page-detail' // 下拉框
  import {Exchange} from 'api'
  import {ERR_OK} from 'common/js/config'

  const TITLELIST = ['订单号', '交易号', '交易金额', '业务类型 ', '交易类型', '付款人', '支付时间']
  export default {
    name: 'exchange',
    data() {
      return {
        titleList: TITLELIST,
        activityType: [{
          select: false,
          show: false,
          children: [{
            content: '活动类型',
            data: [{title: '全部', status: 0}, {title: '支付', status: 1}, {title: '退款', status: 2}]
          }]
        }],
        rqData: {
          time: 'today',
          start_time: 0,
          end_time: 0,
          order_sn: '',
          trade_type: 0,
          page: 1,
          limit: 10
        },
        exchangeList: [],
        exchagePage: {
          total: 0, // 总数量
          per_page: 10, // 一页条数
          total_page: 1 // 总页数
        }
      }
    },
    created() {
      this.getExchangeData()
    },
    methods: {
      getExchangeData() {
        Exchange.exchangeList(this.rqData).then((res) => {
          if (res.error === ERR_OK) {
            this.exchangeList = res.data
            this.exchagePage.total = res.meta.total
            this.exchagePage.per_page = res.meta.per_page
            this.exchagePage.total_page = res.meta.last_page
            this.$emit('setNull', !this.exchangeList.length)
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
        this.getExchangeData()
      },
      setType(type) {
        this.rqData.trade_type = type.status
        this.rqData.page = 1
        this.$refs.page.beginPage()
        this.getExchangeData()
      },
      searchBtn(text) {
        this.rqData.order_sn = text
        this.rqData.page = 1
        this.$refs.page.beginPage()
        this.getExchangeData()
      },
      goPage(page) {
        this.rqData.page = page
        this.getExchangeData()
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
    &:nth-child(2)
      flex: 1.5

  .list-box-active
    background: $color-background

  .page
    height: 9.1%
</style>
