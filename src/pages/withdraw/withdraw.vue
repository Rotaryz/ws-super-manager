<template>
  <div class="activity">
    <div class="ac-tab">
      <date-select @checkTime="checkTime"></date-select>
      <admin-select :select="activityType" role="activity" @setValue="setType"></admin-select>
      <search @search="searchBtn"></search>
      <a class="excel">导出Excel</a>
    </div>
    <div class="form-list">
      <div class="list-header">
        <div class="list-item" v-for="(item, index) in titleList" :key="index">
          {{item}}
        </div>
      </div>
      <div class="list">
        <div class="list-box" v-for="(item, index) in withdrawList" v-bind:key="index">
          <div class="list-item list-text">{{item.withdraw_sn}}</div>
          <div class="list-item list-text">{{item.created_at}}</div>
          <div class="list-item list-text">{{item.mobile}}</div>
          <div class="list-item list-text">{{item.remaining}}</div>
          <div class="list-item list-text">{{item.blocked_remaining}}</div>
          <div class="list-item list-text">{{item.money}}</div>
          <div class="list-item list-text">{{item.user_name}}</div>
          <div class="list-item list-text">{{item.bank}}</div>
          <div class="list-item list-text"  @mouseenter="showNumber" @mouseleave="hideNumber">
            <div class="hidden">
              *****
              <transition name="fade">
                <div class="hidden-number"  v-show="bankNumber" @mouseenter="showNumber">{{item.withdrawal_card}}</div>
              </transition>
            </div>
          </div>
          <div class="list-item list-text"   @mouseenter="showText" @mouseleave="hideText">
            <div class="text" v-if="item.status * 1 === 0">待审核</div>
            <div class="text" v-if="item.status * 1 === 1">微信受理成功</div>
            <div class="text" v-if="item.status * 1 === 2">审核不通过</div>
            <div class="text" v-if="item.status * 1 === 3">微信打款成功</div>
            <div class="text" v-if="item.status * 1 === 4">微信打款失败</div>
            <div class="text" v-if="item.status * 1 === 5">微信受理失败</div>
            <div class="icon" v-if="item.status * 1 === 2 || item.status * 1 === 5 || item.status * 1 === 4"><transition name="fade"><div class="hidden-number" v-show="text" @mouseenter="showText">{{item.note}}</div></transition></div>
          </div>
          <div class="list-item list-text">{{item.status}}
            <div class="item-text" v-if="item.status * 1 === 0 || item.status * 1 === 5 || item.status * 1 === 4" @click="showModel(item)">审核</div>
          </div>
        </div>
      </div>
      <div class="page">
        <!--:pageDtail="pageTotal" @addPage="_addPage"-->
        <page-detail ref="page" :pageDtail="withdrawPage" @addPage="goPage"></page-detail>
      </div>
    </div>
    <div class="model-box" v-show="showModels">
      <div class="model-top">
        <div class="model-text">审核</div>
        <div class="icon" @click="hideModel"></div>
      </div>
      <textarea class="modelarea"  placeholder="备注原因" v-model="noteText"></textarea>
      <div class="model-btn">
        <div class="btn" @click="upWithdrawAudit(1)">审核通过</div>
        <div class="btn" @click="upWithdrawAudit(2)">审核不通过</div>
      </div>
    </div>
  </div>
</template>

<script>
  import Search from 'components/search/search' // 搜索框
  import AdminSelect from 'components/admin-select/admin-select' // 下拉框
  import DateSelect from 'components/date-select/date-select' // 下拉框
  import PageDetail from 'components/page-detail/page-detail' // 下拉框
  import { Exchange } from 'api'
  import {ERR_OK, BASE_URL} from 'common/js/config'
  import storage from 'storage-controller'

  const TITLELIST = ['订单号', '提交时间', '账号', '可提现金额 ', '冻结金额', '提现金额', '真实姓名', '银行类型', '银行卡号', '提现状态', '操作']
  export default {
    name: 'withdraw',
    data() {
      return {
        titleList: TITLELIST,
        activityType: [{
          select: false,
          show: false,
          children: [{content: '处理状态', data: [{title: '待处理', status: 1}, {title: '已处理', status: 2}]}]
        }],
        rqData: {
          time: 'today',
          start_time: 0,
          end_time: 0,
          withdraw_sn: '',
          status: 1,
          page: 1,
          limit: 10
        },
        withdrawPage: {
          total: 0, // 总数量
          per_page: 10, // 一页条数
          total_page: 1 // 总页数
        },
        withdrawList: [],
        bankNumber: false,
        text: false,
        showModels: false,
        withId: '',
        noteText: '',
        downUrl: ''
      }
    },
    async created() {
      this._getUrl()
      await this.getAuditData()
    },
    methods: {
      _getUrl() {
        this.downUrl = BASE_URL.api + `/api/admin/withdraw-index-excel?access_token=${storage.get('aiToken')}&limit=10&time=${this.rqData.time}&start_time=${this.rqData.start_time}&end_time=${this.rqData.end_time}&withdraw_sn=${this.rqData.withdraw_sn}&status=${this.rqData.status}`
      },
      showModel(item) {
        this.$emit('showShade')
        this.showModels = true
        this.withId = item.id
      },
      hideModel() {
        this.$emit('hideShade')
        this.showModels = false
      },
      upWithdrawAudit(index) {
        if (this.note.length === 0) {
          this.$emit('showToast', '请填写审核原因')
        }
        let data = {
          status: index,
          id: this.withId,
          note: this.noteText
        }
        Exchange.withdrawAudit(data).then(res => {
          if (res.error === ERR_OK) {
            this.$emit('showToast', '提交成功')
            this.$emit('hideShade')
            this.showModels = false
          } else {
            this.$emit('showToast', res.message)
            this.$emit('hideShade')
            this.showModels = false
          }
        })
      },
      showNumber() {
        this.bankNumber = true
      },
      hideNumber() {
        this.bankNumber = false
      },
      showText() {
        this.text = true
      },
      hideText() {
        this.text = false
      },
      getAuditData() {
        Exchange.withdrawList(this.rqData).then((res) => {
          if (res.error === ERR_OK) {
            this.withdrawList = res.data
            this.withdrawPage.total = res.meta.total
            this.withdrawPage.per_page = res.meta.per_page
            this.withdrawPage.total_page = res.meta.last_page
            this.$emit('setNull', !this.withdrawList.length)
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
        this.getAuditData()
      },
      setType(type) {
        this.rqData.status = type.status
        this.rqData.page = 1
        this.$refs.page.beginPage()
        this.getAuditData()
      },
      searchBtn(text) {
        this.rqData.withdraw_sn = text
        this.rqData.page = 1
        this.$refs.page.beginPage()
        this.getAuditData()
      },
      goPage(page) {
        this.rqData.page = page
        this.getAuditData()
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
    overflow: visible !important
    .list-box
      height: 10%
      overflow: visible
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
        .hidden
          position: relative
          .hidden-number
            position: absolute
            font-size: $font-size-medium14
            color: $color-text33
            font-family: $fontFamilyRegular
            min-width: 182px
            background: #fff
            height: 26px
            text-align: center
            border-radius:3px
            top: -30px
            left: -72px
            z-index: 11
            margin: auto
            box-shadow: 0 1px 4px 0 rgba(12, 6, 14, 0.20)
            &:after
              content: ''
              position: absolute
              height: 0
              left: 0
              right: 0
              margin: auto
              width: 0
              bottom: -6px
              border: 3px solid #fff
              border-bottom: 3px solid transparent
              border-left: 3px solid transparent
              border-right: 3px solid transparent
            &.fade-enter, &.fade-leave-to
              opacity: 0
            &.fade-enter-to, &.fade-leave-to
              transition: all .2s ease-in-out
        .item-text
          font-family: $fontFamilyRegular
          font-size: $font-size-medium14
          color: $color-4985FC
          cursor: pointer
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
      flex: 1.3
    &:nth-child(2)
      flex: 1.3
    &:nth-child(9)
      overflow: visible !important
      white-space: normal !important
    &:nth-child(10)
      overflow: visible !important
      white-space: normal !important
      layout(row)
      align-items: center
      .icon
        width: 14px
        height: 14px
        position: relative
        background-size: 14px
        bg-image(icon-reason)
        margin-left: 4px
        .hidden-number
          position: absolute
          font-size: $font-size-medium14
          color: $color-text33
          font-family: $fontFamilyRegular
          min-width: 182px
          background: #fff
          text-align: center
          padding: 5px
          border-radius:3px
          bottom: 22px
          left: -90px
          z-index: 11
          text-align: left
          box-shadow: 0 1px 4px 0 rgba(12, 6, 14, 0.20)
          &:after
            content: ''
            position: absolute
            height: 0
            left: 0
            right: 0
            margin: auto
            width: 0
            bottom: -6px
            border: 3px solid #fff
            border-bottom: 3px solid transparent
            border-left: 3px solid transparent
            border-right: 3px solid transparent
          &.fade-enter, &.fade-leave-to
            opacity: 0
          &.fade-enter-to, &.fade-leave-to
            transition: all .2s ease-in-out

  .list-box-active
    background: $color-background
  .model-box
    background: $color-white
    height: 261px
    width: 534px
    position: fixed
    top: 0
    bottom: 0
    left: 0
    right: 0
    z-index: 999
    margin: auto
    .model-top
      height: 60px
      layout(row)
      align-items: center
      justify-content: space-between
      padding: 0 30px
      border-bottom-1px()
      .model-text
        font-family: $fontFamilyRegular
        font-size: $font-size-medium16
        color: $color-text33
      .icon
        width: 16px
        height: 16px
        background-size: 16px
        bg-image(icon-del2)
        cursor: pointer
    .modelarea
      width: 474px
      border-1px()
      height: 90px
      margin: 27px auto 20px
    .model-btn
      layout(row)
      align-items: center
      justify-content: center
      .btn
        width: 94px
        height: 40px
        line-height: 40px
        background: $color-4985FC
        border-radius: 3px
        margin: 0 27px
        font-family: $fontFamilyRegular
        font-size: $font-size-medium16
        color: $color-white
        cursor: pointer
        &:nth-child(2)
          background: #EF705D
  .page
    height: 9.1%
</style>
