<template>
  <div class="agent-order">
    <div class="content-top">
      <div class="left">
        <DateSelect @checkTime="checkTime"></DateSelect>
        <Search @search="search"></Search>
      </div>
      <a :href="excelUrl" class="excel">导出Excel</a>
    </div>
    <div class="content-list">
      <div class="list-header">
        <span class="header-key" v-for="item in headerList">{{item}}</span>
      </div>
      <div class="list-content">
        <div class="list-item" v-for="val in data">
          <div class="item">
            <img class="head-img" :src="val.avatar" alt="">
          </div>
          <span class="item">{{val.nickname}}</span>
          <span class="item">{{val.sex && val.sex * 1 === 1 ? '男' : '女'}}</span>
          <span class="item area">{{val.area}}</span>
          <span class="item">{{val.mobile}}</span>
          <div class="long-item">
            <span>收货人：{{val.receiver_name}}</span>
            <span>手机号：{{val.receiver_mobile}}</span>
            <p class="address">收货地址：{{val.receiver_address}}</p>
          </div>
          <span class="item">{{val.order_count}}</span>
          <span class="item">{{val.order_sum}}</span>
          <span class="item">{{val.created_at}}</span>
        </div>
      </div>
    </div>
    <PageDetail :pageDtail="pageDetail" @addPage="addPage"></PageDetail>
    <toast ref="toast"></toast>
  </div>
</template>

<script>
  import Search from 'components/search/search' // 搜索框
  import AdminSelect from 'components/admin-select/admin-select' // 下拉框
  import DateSelect from 'components/date-select/date-select' // 下拉框
  import PageDetail from 'components/page-detail/page-detail' // 下拉框
  import {Customers} from 'api'
  import {ERR_OK, BASE_URL} from 'common/js/config'
  import Toast from 'components/toast/toast'
  import storage from 'storage-controller'

  export default {
    name: 'agent-order',
    data() {
      return {
        headerList: ['客户头像', '客户昵称', '性别', '地区', '手机号', '收货地址', '完成订单', '消费金额', '加入时间'],
        data: [],
        requestData: {
          time: 'today',
          start_time: '',
          end_time: '',
          name: '',
          page: 1
        },
        pageDetail: {
          total: 1,
          per_page: 10,
          total_page: 1
        },
        excelUrl: ''
      }
    },
    components: {
      Search,
      AdminSelect,
      DateSelect,
      PageDetail,
      Toast
    },
    created() {
      this.getCustomersList()
      this.getExcelUrl()
    },
    methods: {
      checkTime(status) {
        if (status instanceof Array) {
          this.requestData.start_time = status[0]
          this.requestData.end_time = status[1]
          this.requestData.time = ''
        } else {
          this.requestData.time = status
          this.requestData.start_time = ''
          this.requestData.end_time = ''
        }
        this.getCustomersList()
      },
      search(inputTxt) {
        this.requestData.name = inputTxt
        this.getCustomersList()
      },
      getCustomersList() {
        Customers.getAgentOrderList(this.requestData)
          .then((res) => {
            if (res.error !== ERR_OK) {
              this.$refs.toast.show(res.message)
              return
            }
            this.data = res.data
            this.pageDetail.total = res.meta.total
            this.pageDetail.total_page = res.meta.last_page
            this.getExcelUrl()
          })
      },
      addPage(num) {
        this.requestData.page = num
      },
      getExcelUrl() {
        this.excelUrl = `${BASE_URL.api}/api/admin/consumption-index-excel?access_token=${storage.get('aiToken')}&time=${this.requestData.time}&start_time=${this.requestData.start_time}&end_time=${this.requestData.end_time}&name=${this.requestData.name}&page=${this.requestData.page}`
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
          &:nth-of-type(4)
            flex: 1.4
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
            &.area
              flex: 1.4
              no-wrap()
          .long-item
            flex: 3.8
            line-height: 18px
            no-wrap()
            .address
              no-wrap()
          .head-img
            height: 40px
            width: 40px

</style>
