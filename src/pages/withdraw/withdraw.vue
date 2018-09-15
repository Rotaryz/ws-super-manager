<template>
  <div class="activity">
    <div class="ac-tab">
      <date-select @checkTime="checkTime"></date-select>
      <admin-select :select="activityType" role="activity" @setValue="setType"></admin-select>
      <div class="admin-input">
        <admin-select :select="inputType" role="activity" @setValue="setInput"></admin-select>
      </div>
      <div class="admin-search">
        <search @search="searchBtn" :placeholerTxt="inputText"></search>
      </div>
      <a :href="downUrl" class="excel">导出Excel</a>
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
          <div class="list-item list-text" @mouseenter="showNumber(index)" @mouseleave="hideNumber">
            <div class="hidden">
              *****
              <transition name="fade">
                <div class="hidden-number" v-show="bankIndex * 1 === index && bankNumber" @mouseenter="showNumber(index)">{{item.withdrawal_card}}</div>
              </transition>
            </div>
          </div>
          <div class="list-item list-text" @mouseenter="showText(index)" @mouseleave="hideText">
            <div class="text" v-if="item.status * 1 === 0">待审核</div>
            <div class="text" v-if="item.status * 1 === 1">微信受理成功</div>
            <div class="text" v-if="item.status * 1 === 2">审核不通过</div>
            <div class="text" v-if="item.status * 1 === 3">微信打款成功</div>
            <div class="text" v-if="item.status * 1 === 4">微信打款失败</div>
            <div class="text" v-if="item.status * 1 === 5">微信受理失败</div>
            <div class="icon" v-if="item.status * 1 === 2 || item.status * 1 === 5 || item.status * 1 === 4">
              <transition name="fade">
                <div class="hidden-number" v-show="text  && textIndex * 1 === index" @mouseenter="showText(index)">{{item.note || '未查到原因'}}</div>
              </transition>
            </div>
          </div>
          <div class="list-item list-text">
            <div class="item-text" v-if="item.status * 1 === 0 || item.status * 1 === 5 || item.status * 1 === 4" @click="showModel(item)">审核</div>
          </div>
        </div>
      </div>
      <div class="page">
        <!--:pageDtail="pageTotal" @addPage="_addPage"-->
        <page-detail ref="page" :pageDtail="withdrawPage" @addPage="goPage"></page-detail>
      </div>
    </div>
    <div class="model-box" :class="showActive ? 'model-active' : 'model-noactive'" v-show="showModels">
      <div class="model-top">
        <div class="model-text">审核</div>
        <div class="icon" @click="hideModel"></div>
      </div>
      <div class="textarea-box">
        <span class="after"></span>
        <textarea class="modelarea" placeholder="备注原因" v-model="noteText"></textarea>
        <span class="before"></span>
      </div>
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
  import {Exchange} from 'api'
  import {ERR_OK, BASE_URL, BEGIN_TIME} from 'common/js/config'
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
          children: [{content: '处理状态', data: [{title: '全部', status: 0}, {title: '待处理', status: 1}, {title: '已处理', status: 2}]}]
        }],
        inputType: [{
          select: false,
          show: false,
          children: [{content: '订单查询', data: [{title: '订单查询', status: 1}, {title: '账号查询', status: 2}]}]
        }],
        rqData: {
          time: BEGIN_TIME,
          start_time: 0,
          end_time: 0,
          withdraw_sn: '',
          mobile: '',
          status: 0,
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
        bankIndex: 0,
        text: false,
        showModels: false,
        showActive: false,
        withId: 0,
        noteText: '',
        textIndex: '',
        downUrl: '',
        inputText: '请输入订单编号',
        inputIndex: 1
      }
    },
    async created() {
      this._getUrl()
      await this.getAuditData()
    },
    destroyed() {
      this.$emit('hideShade')
    },
    methods: {
      _getUrl() {
        this.downUrl = BASE_URL.api + `/api/admin/withdraw-index-excel?access_token=${storage.get('aiToken')}&time=${this.rqData.time}&start_time=${this.rqData.start_time}&end_time=${this.rqData.end_time}&withdraw_sn=${this.rqData.withdraw_sn}&status=${this.rqData.status}&mobile=${this.rqData.mobile}`
      },
      showModel(item) {
        this.noteText = ''
        this.$emit('showShade')
        this.showModels = true
        this.showActive = true
        this.withId = item.id
      },
      hideModel() {
        this.showActive = false
        setTimeout(() => {
          this.$emit('hideShade')
          this.showModels = false
        }, 200)
      },
      upWithdrawAudit(index) {
        if (this.noteText.length === 0 && index * 1 === 2) {
          this.$emit('showToast', '请填写审核原因')
          return
        }
        let data = {
          status: index,
          id: this.withId,
          note: this.noteText
        }
        Exchange.withdrawAudit(data).then(res => {
          if (res.error === ERR_OK) {
            this.$emit('showToast', '提交成功')
            this.showActive = false
            this.getAuditData()
            setTimeout(() => {
              this.$emit('hideShade')
              this.showModels = false
            }, 200)
          } else {
            this.$emit('showToast', res.message)
            this.showActive = false
            this.getAuditData()
            setTimeout(() => {
              this.$emit('hideShade')
              this.showModels = false
            }, 200)
          }
        })
      },
      showNumber(index) {
        this.bankIndex = index
        this.bankNumber = true
      },
      hideNumber() {
        this.bankNumber = false
      },
      showText(index) {
        this.textIndex = index
        this.text = true
      },
      hideText() {
        this.text = false
      },
      getAuditData() {
        this._getUrl()
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
      setInput(type) {
        this.inputIndex = type.status
        if (type.status * 1 === 1) {
          this.inputText = '请输入订单编号'
        } else {
          this.inputText = '请输入账号编号'
        }
      },
      searchBtn(text) {
        if (this.inputIndex * 1 === 1) {
          this.rqData.mobile = ''
          this.rqData.withdraw_sn = text
        } else {
          this.rqData.mobile = text
          this.rqData.withdraw_sn = ''
        }
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
      overflow: visible !important
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
      flex: 1.3
    &:nth-child(9)
      overflow: visible !important
      white-space: normal !important
    &:nth-child(10)
      flex: 1.1
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
          padding: 10px
          border-radius: 3px
          bottom: 22px
          left: -95px
          z-index: 11
          text-align: center
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
            transition: all .4s ease-in-out

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

  .hidden
    position: relative
    .hidden-number
      position: absolute
      font-size: $font-size-medium14
      color: $color-text33
      font-family: $fontFamilyRegular
      min-width: 182px
      padding: 0 5px
      background: #fff
      height: 26px
      line-height: 26px
      text-align: center
      border-radius: 3px
      top: -30px
      left: -77px
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
        transition: all .4s ease-in-out

  .item-text
    font-family: $fontFamilyRegular
    font-size: $font-size-medium14
    color: $color-4985FC
    cursor: pointer

  .admin-input
    padding-left: 10px

  .admin-search
    margin-left: -5px

  .model-box
    box-shadow: 0 1px 6px 0 rgba(0, 8, 39, 0.10)
    background: $color-white
    height: 270px
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
      position: relative
      width: 474px
      border-1px()
      height: 90px
      margin: 27px auto 20px
      padding: 5px 10px
      text-align: justify
      z-index: 10
      resize: none
      border-radius: 4px
      font-family: $fontFamilyRegular
      font-size: $font-size-medium14
      color: $color-text33
      line-height: 18px
      border: 0.5px solid #d9d9d9
      outline: none
    .modelarea::-webkit-input-placeholder
      color: #ccc
    .modelarea:-moz-placeholder
      color: #ccc
    .modelarea::-moz-placeholder
      color: #ccc
    .modelarea:-ms-input-placeholder
      color: #ccc
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
        transition: all 0.4s ease-out
        &:nth-child(2)
          background: #EF705D
        &:hover
          transition: all 0.4s ease-out
          font-size: 17px

  .textarea-box
    position: relative
    transition: all 0.4s ease-out
    .after
      border-top: 0.5px solid transparent
      border-bottom: 0.5px solid transparent
      position: absolute
      z-index: 5
      height: 102px
      width: 0
      right: 19px
      top: 26px
      box-sizing: content-box
      border-radius 4px
      transition: all 0.4s ease-out
    .before
      border-right: 0.5px solid transparent
      border-left: 0.5px solid transparent
      position: absolute
      z-index: 5
      height: 0
      width: 496px
      top: 26px
      right: 18.5px
      box-sizing: content-box
      border-radius 4px
      transition: all 0.4s ease-out
    &:hover
      .modelarea
        border: 0.5px solid transparent
        transition: all 0.4s ease-out
      .after
        border-color: $color-text99
        transition: all 0.4s ease-out
        width: 496px
      .before
        border-color: $color-text99
        transition: all 0.4s ease-out
        height: 102px

  .model-active
    animation: layerFadeIn .3s
    -webkit-animation: layerFadeIn .3s
    -moz-animation: layerFadeIn .3s
    -ms-animation: layerFadeIn .3s
    -o-animation: layerFadeIn .3s

  .model-noactive
    animation: hideFadeIn .3s
    -webkit-animation: hideFadeIn .3s
    -moz-animation: hideFadeIn .3s
    -ms-animation: hideFadeIn .3s
    -o-animation: hideFadeIn .3s

  @keyframes layerFadeIn {
    0% {
      opacity: 0
      transform: scale(.5)
    }
    100% {
      opacity: 1
      transform: scale(1)
    }
  }

  @-webkit-keyframes layerFadeIn {
    0% {
      opacity: 0
      -webkit-transform: scale(.5)
    }
    100% {
      opacity: 1
      -webkit-transform: scale(1)
    }
  }

  @-moz-keyframes layerFadeIn {
    0% {
      opacity: 0
      -moz-transform: scale(.5)
    }
    100% {
      opacity: 1
      -moz-transform: scale(1)
    }
  }

  @-ms-keyframes layerFadeIn {
    0% {
      opacity: 0
      -ms-transform: scale(.5);
      filter: Alpha(opacity = 0)
    }
    100% {
      opacity: 1
      -ms-transform: scale(1);
      filter: Alpha(opacity = 100)
    }
  }

  @-o-keyframes layerFadeIn {
    0% {
      opacity: 0
      -o-transform: scale(.5)
    }
    100% {
      opacity: 1
      -o-transform: scale(1)
    }
  }

  @keyframes hideFadeIn {
    0% {
      opacity: 1;
      transform: scale(1)
    }
    100% {
      transform: scale(.5);
      opacity: 0
    }
  }

  @-webkit-keyframes hideFadeIn {
    0% {
      opacity: 1;
      -webkit-transform: scale(1)
    }
    100% {
      -webkit-transform: scale(.5);
      opacity: 0
    }
  }

  @-moz-keyframes hideFadeIn {
    0% {
      opacity: 1;
      -moz-transform: scale(1)
    }
    100% {
      -moz-transform: scale(.5);
      opacity: 0
    }
  }

  @-ms-keyframes hideFadeIn {
    0% {
      opacity: 1;
      -ms-transform: scale(1)
    }
    100% {
      -ms-transform: scale(.5);
      opacity: 0;
      filter: Alpha(opacity = 0)
    }
  }

  @-o-keyframes hideFadeIn {
    0% {
      opacity: 1;
      -webkit-transform: scale(1)
    }
    100% {
      -webkit-transform: scale(.5);
      opacity: 0
    }
  }
</style>
