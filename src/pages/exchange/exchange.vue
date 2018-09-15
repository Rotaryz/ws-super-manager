<template>
  <div class="activity">
    <div class="ac-tab">
      <date-select @checkTime="checkTime"></date-select>
      <admin-select :select="activityType" role="activity" @setValue="setType"></admin-select>
      <search @search="searchBtn"></search>
      <a :href="downUrl" class="excel">导出Excel</a>
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
  import {ERR_OK, BASE_URL} from 'common/js/config'
  import storage from 'storage-controller'

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
            content: '交易类型',
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
        },
        downUrl: ''
      }
    },
    async created() {
      this._getUrl()
      await this.getExchangeData()
    },
    methods: {
      _getUrl() {
        this.downUrl = BASE_URL.api + `/api/admin/trade-index-excel?access_token=${storage.get('aiToken')}&time=${this.rqData.time}&start_time=${this.rqData.start_time}&end_time=${this.rqData.end_time}&order_sn=${this.rqData.order_sn}&trade_type=${this.rqData.trade_type}`
      },
      getExchangeData() {
        this._getUrl()
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
    flex: 1
    background: $color-white
    padding: 0 1.5vw
    display: flex
    overflow: hidden
    border-radius: 6px
    box-shadow: 0 1px 6px 0 rgba(0, 8, 39, 0.10)
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
    position: relative
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
    height: 50px
    white-space: nowrap
    border-bottom: 1px solid $color-line
    background: $color-big-background
    .list-item
      display: flex
      align-items: center
      font-family: $fontFamilyMeddle
      color: $color-text33

  .list
    display: flex
    flex-direction: column
    .list-box
      background: $color-white
      height: 60px
      overflow: hidden
      border-bottom: 1px solid $color-line
      &:last-child
        margin-bottom: 60px
      .list-item
        line-height: 16px
        color: $color-text33
        font-size: $font-size-medium14
        .pic-box
          height: 40px
          width: 40px
          overflow: hidden
          .pic
            width: 40px
      .list-item-tap
        font-size: $font-size-small12
        color: rgba(0, 0, 0, .1)
      .list-text
        no-wrap()
        width: 90%
        color: $color-text-66
        .bule
          color: $color-4985FC

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
    .sort
      display: flex
      flex-direction: column
      justify-content: space-between
      height: 19px
      margin-left: 10px
      .sort-item
        border: 4px solid $color-text99
        transition: all 0.4s
      .sort-top
        border-top: 4px solid transparent
        border-left: 4px solid transparent
        border-right: 4px solid transparent
      .sort-end
        border-bottom: 4px solid transparent
        border-left: 4px solid transparent
        border-right: 4px solid transparent
      .sort-top-active
        border: 4px solid $color-4985FC
        border-top: 4px solid transparent
        border-left: 4px solid transparent
        border-right: 4px solid transparent
        transition: all 0.4s
      .sort-end-active
        border: 4px solid $color-4985FC
        border-bottom: 4px solid transparent
        border-left: 4px solid transparent
        border-right: 4px solid transparent
        transition: all 0.4s
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
    width: 100%
    position: absolute
    bottom: 0
    color: $color-white
    height: 60px
    layout(row)
    align-items: center
</style>
