<template>
  <div class="activity">
    <div class="ac-tab">
      <date-select @checkTime="checkTime"></date-select>
      <admin-select :select="activityType" role="activity" @setValue="setType"></admin-select>
      <search @search="searchBtn"></search>
      <a :href="downUrl" class="excel" target="_blank">导出Excel</a>
    </div>
    <ul class="tab-list">
      <li class="item" v-for="(item, index) in tabStatus" v-bind:key="index"
          :class="indexActive === index ? 'active' : ''" @click="checkTab(item, index)">{{item.text}}
      </li>
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
  import {ERR_OK, BASE_URL, BEGIN_TIME} from 'common/js/config'
  import storage from 'storage-controller'

  const TITLELIST = ['订单号', '商品信息', '单价', '数量', '实付金额', '业务类型', '下单用户', '下单时间', '状态']
  const ORDERSTATUS = [{text: '全部订单', status: 0}, {text: '待付款', status: 1}, {text: '待发货', status: 2}, {text: '待收货', status: 3}, {text: '已完成', status: 4}, {text: '已关闭', status: 5}]
  const GROUPONORDERSTATUS = [{text: '全部订单', status: 0}, {text: '待付款', status: 1}, {text: '待发货', status: 2}, {text: '待收货', status: 3}, {text: '已完成', status: 4}, {text: '已关闭', status: 5}, {text: '待成团', status: 6}, {text: '已退款', status: 7}]

  export default {
    name: 'goods-order',
    data() {
      return {
        titleList: TITLELIST,
        activityType: [{
          select: false,
          show: false,
          children: [{content: '业务类型', data: [{title: '全部', status: '0'}, {title: '商品', status: 'c_common'}, {title: '团购', status: 'c_groupon'}, {title: '砍价', status: 'c_bargain'}]}]
        }],
        tabStatus: ORDERSTATUS,
        rqData: {
          time: BEGIN_TIME,
          start_time: 0,
          end_time: 0,
          order_sn: '',
          page: 1,
          source: 0,
          status: 0,
          limit: 10
        },
        goodsList: [],
        goodsPage: {
          total: 0, // 总数量
          per_page: 10, // 一页条数
          total_page: 1 // 总页数
        },
        indexActive: 0,
        downUrl: ''
      }
    },
    async created() {
      this._getUrl()
      await this.getGoodsOrdersData()
    },
    methods: {
      _getUrl() {
        this.downUrl = BASE_URL.api + `/api/admin/order-index-excel?access_token=${storage.get('aiToken')}&time=${this.rqData.time}&start_time=${this.rqData.start_time}&end_time=${this.rqData.end_time}&order_sn=${this.rqData.order_sn}&source=${this.rqData.source}&status=${this.rqData.status}`
      },
      getGoodsOrdersData() {
        this._getUrl()
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
        this.rqData.source = type.status
        if (type.status === 'c_groupon') {
          this.tabStatus = GROUPONORDERSTATUS
          this.indexActive = 0
          this.rqData.status = 0
        } else {
          this.tabStatus = ORDERSTATUS
          this.indexActive = 0
          this.rqData.status = 0
        }
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
    flex: 1
    background: $color-white
    display: flex
    overflow: hidden
    border-radius: 6px
    box-shadow: 0 1px 6px 0 rgba(0, 8, 39, 0.10)
    flex-direction: column

  .ac-tab
    min-height: 88px
    max-height: 88px
    box-sizing: border-box
    padding: 0 1.5vw
    display: flex
    align-items: center
    position: relative
    .excel
      right: 1.5vw
      col-center()

  .form-list
    position: relative
    font-size: $font-size-medium14
    font-family: $fontFamilyRegular
    flex: 1
    padding: 0 1.5vw

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
    &:nth-child(1)
      flex: 1.3
    &:nth-child(2)
      flex: 2.2
      white-space: normal !important
      padding-right: 5px
      word-break: break-all

  .list-box-active
    background: $color-background

  .tab-list
    layout(row)
    margin-bottom: 20px
    border-bottom-1px()
    padding: 0 1.5vw
    .item
      cursor: pointer
      background: $color-FAFAFA
      width: 90px
      font-size: $font-size-medium14
      font-family: $fontFamilyRegular
      color: #222
      height: 36px
      line-height: 36px
      border-top: 1px solid #e1e4e5
      border-right: 1px solid #e1e4e5
      box-sizing: border-box
      transition: all 0.4s ease-out
      position: relative
      &:after
        content: ""
        position: absolute
        bottom: -2px
        left: 0
        width: 0
        border-bottom: 3px solid transparent
      &:before
        content: ""
        position: absolute
        top: 0
        left: 0
        width: 0
        border-bottom: 4px solid transparent
      &:nth-child(1)
        border-left: 1px solid #e1e4e5
      &.active
        background: #fff
        position: relative
        transition: all 0.4s ease-out
        &:after
          width: 100%
          border-bottom: 3px solid #fff
          transition: all 0.4s ease-out
        &:before
          width: 100%
          border-bottom: 4px solid #4985FC
          transition: all 0.4s ease-out

  .page
    width: 100%
    position: absolute
    bottom: 0
    left: 0
    padding: 0 1.5vw
    box-sizing: border-box
    color: $color-white
    height: 60px
    layout(row)
    align-items: center
</style>
