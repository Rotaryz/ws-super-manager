<template>
  <div class="business-list">
    <div class="content-top">
      <div class="left">
        <date-select @checkTime="checkTime"></date-select>
        <admin-select :select="activityType1" @setValue="setValue1"></admin-select>
        <admin-select :select="activityType2" @setValue="setValue2"></admin-select>
        <admin-select :select="activityType3" @setValue="setValue3"></admin-select>
        <search @search="search" placeholerTxt="请输入商家名称、帐号"></search>
      </div>
      <a :href="excelUrl" class="excel">导出Excel</a>
    </div>
    <div class="content-list">
      <div class="list-header">
        <div class="header-key" v-for="(item, index) in headerList" @click="handleClick(index)" :class="{'handle': index === 7 || index === 8 || index === 9}">
          <span class="contxt" :class="`${headClass[`class${index}`]}`">{{item}}</span>
        </div>
      </div>
      <div class="list-content">
        <div class="list-item">
          <div class="item" v-for="(item, index) in headerList">
            <span v-if="index !== 12">数据</span>
            <div v-if="index === 12" class="list-handle">
              <span class="handle-item" @click="openPop('open')">开通</span>
              <span class="handle-item" @click="openPop('freeze')">冻结</span>
              <span class="handle-item" @click="openPop('authority')">越权</span>
              <span class="handle-item" @click="openPop('shop')">店铺</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <page-detail :pageDtail="pageDetail" @addPage="addPage"></page-detail>
    <toast ref="toast"></toast>
    <div class="pop-box" v-if="showPop">
      <div class="pop-content">
        <header class="title">
          <span>冻结“XXX”商家</span>
          <span class="closePop" @click="closePop"></span>
        </header>
        <div class="pop-main" v-if="showPopContent === 0">
          <p class="end-time">
            <span class="type">到期时间: </span>
            2018-09-31
          </p>
          <p class="add-time">
            <span class="type">延迟至</span>
            <el-date-picker
              v-model="addTime"
              type="date"
              placeholder="选择日期"
              size="mini"
            >
            </el-date-picker>
          </p>
          <div class="content-btn">
            <a class="btn" href="javascript:;">取消</a>
            <a class="btn active" href="javascript:;">确定</a>
          </div>
        </div>
        <div class="pop-main" v-if="showPopContent === 1">
          <textarea v-model="popTxt" class="popTxt" placeholder="备注原因"></textarea>
          <div class="content-btn">
            <a class="btn" href="javascript:;">取消</a>
            <a class="btn active" href="javascript:;">冻结</a>
          </div>
        </div>
        <div class="pop-main" v-if="showPopContent === 2">
          <div class="add-call">
            操作人手机号：
            <input class="phone-num" type="number" v-model="authorityNum">
          </div>
          <div class="content-btn">
            <a class="btn active" href="javascript:;">确定</a>
          </div>
        </div>
        <div class="pop-main" v-if="showPopContent === 3">
          <img src="" alt="" class="xcx-img">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Search from 'components/search/search' // 搜索框
  import AdminSelect from 'components/admin-select/admin-select'
  import DateSelect from 'components/date-select/date-select' // 下拉框
  import PageDetail from 'components/page-detail/page-detail' // 下拉框
  import {Customers} from 'api'
  import {ERR_OK, BASE_URL} from 'common/js/config'
  import Toast from 'components/toast/toast'
  import storage from 'storage-controller'

  const headerList = ['商家名称', '商家帐号', '商家身份', '帐号状态', '商家状态', '商家版本', '开通方式', '用户数', '客户数', '订单数', '注册时间', '到期时间', '操作']
  export default {
    name: 'business-list',
    data() {
      return {
        headerList,
        arr: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        activityType1: [{
          select: false,
          show: false,
          children: [{content: '账号状态', data: [{title: '全部', status: ''}]}]
        }],
        activityType2: [{
          select: false,
          show: false,
          children: [{content: '商家版本', data: [{title: '全部', status: ''}]}]
        }],
        activityType3: [{
          select: false,
          show: false,
          children: [{content: '开通方式', data: [{title: '全部', status: ''}]}]
        }],
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
        handleIndex: 0,
        headClass: {
          class7: '',
          class8: '',
          class9: ''
        },
        excelUrl: '',
        showList: true,
        popTxt: '',
        showPop: false,
        showPopContent: false,
        addTime: '',
        authorityNum: '',
        popTile: ['开通', '冻结', '解冻', '越权', '浏览']
      }
    },
    created() {
      this.getBusinessList()
      this.getExcelUrl()
    },
    methods: {
      setValue1(item) {
        this.activityType[0].children[0].content = item.title
        this.statusEnd = item.status
      },
      setValue2(item) {
        this.activityType[0].children[0].content = item.title
        this.statusEnd = item.status
      },
      setValue3(item) {
        this.activityType[0].children[0].content = item.title
        this.statusEnd = item.status
      },
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
        this.getBusinessList()
      },
      search(inputTxt) {
        this.requestData.name = inputTxt
        this.getBusinessList()
      },
      handleClick(num) {
        if (this.handleIndex === num) {
          if (this.headClass[`class${num}`] === 'down') {
            this.headClass[`class${num}`] = 'up'
          } else {
            this.headClass[`class${num}`] = 'down'
          }
        } else {
          this.handleIndex = num
          for (let val in this.headClass) {
            this.headClass[val] = ''
          }
          this.headClass[`class${num}`] = 'down'
        }
      },
      getBusinessList() {
        Customers.getRetailOrderList(this.requestData)
          .then((res) => {
            if (res.error !== ERR_OK) {
              this.$emit('setNull', true)
              this.$refs.toast.show(res.message)
              return
            }
            this.data = res.data
            this.$emit('setNull', !this.data.length)
            this.pageDetail.total = res.meta.total
            this.pageDetail.total_page = res.meta.last_page
            this.getExcelUrl()
          })
      },
      addPage(num) {
        this.requestData.page = num
        this.getBusinessList()
      },
      getExcelUrl() {
        this.excelUrl = `${BASE_URL.api}/api/admin/potential-index-excel?access_token=${storage.get('aiToken')}&time=${this.requestData.time}&start_time=${this.requestData.start_time}&end_time=${this.requestData.end_time}&name=${this.requestData.name}&page=${this.requestData.page}`
      },
      openPop(type) { // 打开弹窗
        this.showPop = true
        switch (type) {
          case 'open':
            this.showPopContent = 0
            break
          case 'freeze':
            this.showPopContent = 1
            break
          case 'authority':
            this.showPopContent = 2
            break
          case 'shop':
            this.showPopContent = 3
            break
        }
      },
      closePop() { // 关闭弹窗
        this.showPop = false
      },
      addDate() {
        console.log(this.addTime, this.addTime.toLocaleDateString().replace(/\//g, '-'))
      }
    },
    computed: {
      popTitleTxt() {
        return this.popTitle[this.showPopContent]
      }
    },
    watch: {
      addTime(date, oldDate) {
        this.addDate()
      }
    },
    components: {
      Search,
      DateSelect,
      AdminSelect,
      PageDetail,
      Toast
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import '~common/stylus/mixin'

  .business-list
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
        text-align: left
        justify-content: space-between
        padding-left: 40px
        color: $color-text33
        border-bottom: 1px solid $color-line
        .header-key
          flex: 1
          cursor: pointer
          &:last-child
            flex: 2.2
        .handle
          .contxt
            position: relative
            &:before
            &:after
              content:''
              display: inline-block
              width: 0
              height: 0
              border: 4px solid $color-text99
              border-top-color: transparent
              border-right-color: transparent
              border-bottom-color: transparent
              position: absolute
              right: -16px
              top: 1px
              transition: all 0.4s
              transform: rotate(-90deg)
            &:after
              transform: rotate(90deg)
              top: 12px
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
            &:last-child
              flex: 2.2
            .list-handle
              color: $color-4985FC
              white-space: nowrap
              .handle-item
                padding: 0 7px
                border-left: 1px solid $color-line
                cursor: pointer
                &:first-child
                  border-left: 0
          .head-img
            width: 40px
            heihgt: 40px
    .pop-box
      position: fixed
      left: 0
      right: 0
      top: 0
      bottom: 0
      background: rgba(50,50,58,0.6)
      z-index: 1
      .pop-content
        width: 530px
        min-height: 260px
        background: $color-white
        border-radius: 3px
        all-center()
        box-shadow: 0 0 5px 0 rgba(12,6,14,0.6)
        .title
          height: 60px
          border-bottom: 1px solid #DADADA
          font-size: 16px
          padding: 0 30px
          box-sizing: border-box
          color: $color-text33
          display: flex
          justify-content: space-between
          align-items: center
          .closePop
            bg-image('./icon-del2')
            width: 16px
            height: 16px
            background-size: 100% 100%
        .pop-main
          padding: 20px 30px
          text-align: left
          .popTxt
            padding: 8px
            resize: vertical
            font-size: 14px
            width: 100%
            height: 90px
            box-sizing: border-box
            border: 1px solid $color-line
            &::-webkit-input-placeholder
              color: $color-ccc
          .content-btn
            display: flex
            justify-content: flex-end
            margin-top: 27px
            .btn
              width: 96px
              height: 40px
              border: 1px solid $color-ccc
              border-radius: 3px
              text-align: center
              line-height: 40px
              font-size: 16px
              color: $color-text33
              &.active
                background: $color-4985FC
                color: $color-white
                margin-left: 20px



          .type
            display: inline-block
            width: 70px
          .end-time
            margin-top: 17px
          .add-time
            margin-top: 20px
          .content-btn
            margin-top: 40px
          .xcx-img
            width: 238px
            height: 216px
            margin: 0 auto
            margin-top: 20px
          .add-call
            margin-top: 20px
            display: flex
            align-items: center
            .phone-num
              margin-left: 10px
              width: 180px
              height: 30px
              line-height: 30px
              border: 1px solid $color-line
              border-radius: 3px
              padding: 0 5px
              box-sizing: border-box
</style>
