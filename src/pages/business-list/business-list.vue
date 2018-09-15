<template>
  <div class="business-list">
    <div class="content-top">
      <div class="left">
        <date-select @checkTime="checkTime" ref="dateSelect"></date-select>
        <admin-select :select="activityType1" @setValue="setValue"></admin-select>
        <admin-select :select="activityType2" @setValue="setValue"></admin-select>
        <admin-select :select="activityType3" @setValue="setValue"></admin-select>
        <search @search="search" placeholerTxt="请输入商家名称、帐号" :txt="requestData.keyword"></search>
      </div>
      <a :href="excelUrl" class="excel">导出Excel</a>
    </div>
    <div class="content-list">
      <div class="list-header">
        <div class="header-key" v-for="(item, index) in headerList" @click="handleClick(index)"
             :class="{'handle': index === 7 || index === 8 || index === 9}">
          <span class="contxt" :class="`${headClass[`class${index}`]}`">{{item}}</span>
        </div>
      </div>
      <div class="list-content">
        <div class="list-item" v-for="(item, index) in data">
          <span class="item">{{item.name || '---'}}</span>
          <span class="item">{{item.mobile || '---'}}</span>
          <span class="item">{{item.role_name || '---'}}</span>
          <span class="item">{{item.is_freeze_str || '---'}}</span>
          <span class="item">{{item.status_str || '---'}}</span>
          <span class="item">{{item.service_version || '---'}}</span>
          <span class="item">{{item.open_type_str || '---'}}</span>
          <span class="item">{{item.latent_customer_count || '---'}}</span>
          <span class="item">{{item.customer_count || '---'}}</span>
          <span class="item">{{item.order_count || '---'}}</span>
          <span class="item">{{item.created_at || '---'}}</span>
          <span class="item">{{item.expiration_time || '---'}}</span>
          <div class="list-handle item">
            <span class="handle-item"
                  @click="openPop('open', item.name, item.id, item.is_freeze_str, item.expiration_time)">开通</span>
            <span class="handle-item" @click="openPop('freeze', item.name, item.id, item.is_freeze_str)">{{item.is_freeze_str === '正常' ? '冻结' : '解冻'}}</span>
            <span class="handle-item" @click="openPop('authority', item.name, item.id, item.is_freeze_str)">越权</span>
            <span class="handle-item" @click="openPop('shop', item.name, item.id, item.is_freeze_str)">店铺</span>
          </div>
        </div>
      </div>
    </div>
    <page-detail ref="pageDetail" :pageDtail="pageDetail" @addPage="addPage"></page-detail>
    <toast ref="toast"></toast>
    <div class="pop-box" v-show="showPop">
      <div class="pop-content" :class="showActive ? 'model-active' : 'model-noactive'">
        <header class="title">
          <span>{{popTile[showPopContent]}}“{{popName}}”商家</span>
          <span class="closePop" @click="closePop"></span>
        </header>
        <div class="pop-main" v-if="showPopContent === 0">
          <p class="end-time">
            <span class="type">到期时间: </span>
            {{endTime}}
          </p>
          <p class="add-time">
            <span class="type">延迟至</span>
            <el-date-picker
              v-model="addTime"
              type="date"
              placeholder="选择日期"
              size="mini"
              style="width:180px"
            >
            </el-date-picker>
          </p>
          <div class="content-btn">
            <div class="btn" @click="closePop">取消</div>
            <div class="btn active" @click="openBusiness">确定</div>
          </div>
        </div>
        <div class="pop-main" v-if="showPopContent === 1 || showPopContent === 2">
          <div class="input-box-big">
            <span class="after"></span>
            <textarea v-model="popTxt" class="popTxt" :placeholder="showPopContent === 1?'备注原因':'冻结原因'"></textarea>
            <span class="before"></span>
          </div>
          <div class="content-btn">
            <div class="btn" @click="closePop">取消</div>
            <div class="btn active" @click="operate">{{showPopContent === 1 ? '冻结' : '解冻'}}</div>
          </div>
        </div>
        <div class="pop-main" v-if="showPopContent === 3">
          <div class="add-call">
            操作人手机号：
            <div class="phone-box">
              <span class="before"></span>
              <input class="phone-num" type="number" v-model="authorityNum">
              <span class="after"></span>
            </div>
          </div>
          <div class="content-btn">
            <div class="btn active" @click="overPower">确定</div>
          </div>
        </div>
        <div class="pop-main code" v-if="showPopContent === 4">
          <img v-if="!loadImg" :src="codeUrl" alt="" class="xcx-img">
          <img v-if="loadImg" src="./loading.gif" alt="" class="load-img">
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
  import { Business } from 'api'
  import { ERR_OK, BASE_URL } from 'common/js/config'
  import Toast from 'components/toast/toast'
  import storage from 'storage-controller'

  const headerList = ['商家名称', '商家帐号', '商家身份', '帐号状态', '商家状态', '商家版本', '开通方式', '潜在客户数', '消费客户数', '订单数', '注册时间', '到期时间', '操作']
  export default {
    name: 'business-list',
    data() {
      return {
        headerList,
        activityType1: [{
          select: false,
          show: false,
          children: [{
            content: '账号状态',
            data: [{title: '全部', status: '', type: 0}, {title: '正常', status: '0', type: 0}, {
              title: '冻结',
              status: '1',
              type: 0
            }]
          }]
        }],
        activityType2: [{
          select: false,
          show: false,
          children: [{
            content: '商家版本',
            data: [{title: '全部', status: '', type: 1}, {title: '试用版', status: '0', type: 1}, {
              title: '付费版',
              status: '1',
              type: 1
            }]
          }]
        }],
        activityType3: [{
          select: false,
          show: false,
          children: [{
            content: '开通方式',
            data: [{title: '全部', status: '', type: 2}, {title: '自费开通', status: '0', type: 2}, {
              title: '激活码开通',
              status: '1',
              type: 2
            }]
          }]
        }],
        data: [],
        requestData: {
          keyword: '',
          time: 'today',
          sort_type: '',
          start_time: '',
          end_time: '',
          is_freeze: '',
          service_version: '',
          open_type: '',
          page: 1,
          limit: 10
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
        showActive: false,
        showPopContent: false,
        addTime: '',
        authorityNum: '',
        popTile: ['开通', '冻结', '解冻', '越权', '浏览'],
        popType: 'open',
        popName: '',
        merchant_id: '',
        expire_time: '',
        codeUrl: '',
        endTime: '',
        loadImg: false
      }
    },
    created() {
      this.requestData.keyword = this.$route.query.num || ''
      let index = this.$route.query.num ? -1 : 0
      setTimeout(() => {
        this.$refs.dateSelect.setIndex(index)
      }, 200)
      this.requestData.time = this.$route.query.num ? '' : 'today'
      this.getBusinessList()
      this.getExcelUrl()
    },
    methods: {
      setValue(item) {
        switch (item.type) {
          case 0 :
            this.activityType1[0].children[0].content = item.title
            this.requestData.is_freeze = item.status
            break
          case 1 :
            this.activityType2[0].children[0].content = item.title
            this.requestData.service_version = item.status
            break
          case 2:
            this.activityType3[0].children[0].content = item.title
            this.requestData.open_type = item.status
            break
        }
        this.requestData.page = 1
        this.$refs.pageDetail.beginPage()
        this.getBusinessList()
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
        this.requestData.page = 1
        this.$refs.pageDetail.beginPage()
        this.getBusinessList()
      },
      search(inputTxt) {
        this.requestData.keyword = inputTxt
        this.requestData.page = 1
        this.$refs.pageDetail.beginPage()
        for (let val in this.headClass) {
          this.headClass[val] = ''
        }
        this.requestData.sort_type = ''
        this.getBusinessList()
      },
      handleClick(num) {
        if (this.handleIndex === num) {
          if (this.headClass[`class${num}`] === 'down') {
            this.headClass[`class${num}`] = 'up'
            switch (num) {
              case 7:
                this.requestData.sort_type = 2
                break
              case 8:
                this.requestData.sort_type = 4
                break
              case 9:
                this.requestData.sort_type = 6
                break
            }
          } else {
            this.headClass[`class${num}`] = 'down'
            switch (num) {
              case 7:
                this.requestData.sort_type = 1
                break
              case 8:
                this.requestData.sort_type = 3
                break
              case 9:
                this.requestData.sort_type = 5
                break
            }
          }
        } else {
          this.handleIndex = num
          for (let val in this.headClass) {
            this.headClass[val] = ''
          }
          this.headClass[`class${num}`] = 'down'
          switch (num) {
            case 7:
              this.requestData.sort_type = 1
              break
            case 8:
              this.requestData.sort_type = 3
              break
            case 9:
              this.requestData.sort_type = 5
              break
          }
        }
        this.requestData.page = 1
        this.$refs.pageDetail.beginPage()
        this.getBusinessList()
      },
      addPage(num) {
        this.requestData.page = num
        this.getBusinessList()
      },
      getExcelUrl() {
        let query = ''
        for (let item in this.requestData) {
          if (item !== 'limit' && item !== 'page') {
            query += `&${item}=${this.requestData[item]}`
          }
        }
        let accessToken = `access_token=${storage.get('aiToken')}`
        this.excelUrl = `${BASE_URL.api}/api/admin/merchant-list-export?${accessToken}&${query}`
      },
      openPop(type, name, id, status, endTime) { // 打开弹窗
        this.$emit('showShade')
        this.showPop = true
        this.showActive = true
        this.popName = name
        this.merchant_id = id
        switch (type) {
          case 'open':
            this.endTime = endTime
            this.showPopContent = 0
            break
          case 'freeze':
            if (status === '正常') {
              this.showPopContent = 1
            } else {
              this.showPopContent = 2
            }
            break
          case 'authority':
            this.showPopContent = 3
            break
          case 'shop':
            this.previewMerchant()
            this.showPopContent = 4
            break
        }
      },
      closePop() { // 关闭弹窗
        this.$emit('hideShade')
        setTimeout(() => {
          this.showPop = false
        }, 200)
        this.showActive = false
        this.popTxt = ''
        this.authorityNum = ''
      },
      addDate() {
        console.log(this.addTime)
        this.expire_time = this.addTime.toLocaleDateString().replace(/\//g, '-').replace(/\b\d\b/g, '0$&')
        // this.addTime.toLocaleDateString().replace(/\//g, '-')
      },
      operate() {
        if (this.showPopContent === 1) {
          this.frozenBusiness()
        } else {
          this.unfreezeBusiness()
        }
        this.closePop()
      },
      getBusinessList() {
        Business.getBusinessList(this.requestData)
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
      openBusiness() {
        if (!this.expire_time) {
          this.$refs.toast.show('请选择延迟日期')
          return
        }
        Business.openBusiness({merchant_id: this.merchant_id, expire_time: this.expire_time})
          .then((res) => {
            if (res.error !== ERR_OK) {
              this.$refs.toast.show(res.message)
              return
            }
            this.$refs.toast.show(res.message)
          })
        this.closePop()
      },
      frozenBusiness() {
        if (!this.popTxt || this.popTxt.replace(/^\s+|\s+$/g, '') === '') {
          this.$refs.toast.show('请填写冻结原因')
          return
        }
        Business.frozenBusiness({merchant_id: this.merchant_id, remark: this.popTxt})
          .then((res) => {
            if (res.error !== ERR_OK) {
              this.$refs.toast.show(res.message)
              return
            }
            this.$refs.toast.show(res.message)
            this.getBusinessList()
          })
      },
      unfreezeBusiness() {
        Business.unfreezeBusiness({merchant_id: this.merchant_id, remark: this.popTxt})
          .then((res) => {
            if (res.error !== ERR_OK) {
              this.$refs.toast.show(res.message)
              return
            }
            this.$refs.toast.show(res.message)
            this.getBusinessList()
          })
      },
      overPower() {
        if (!this.authorityNum) {
          this.$refs.toast.show('输入手机号')
        }
        if (!/^1[3|4|5|6|7|8][0-9]{9}$/.test(this.authorityNum)) {
          this.$refs.toast.show('请正确输入手机号')
        }
        Business.overPower({merchant_id: this.merchant_id, mobile: this.authorityNum})
          .then((res) => {
            if (res.error !== ERR_OK) {
              this.$refs.toast.show(res.message)
              return
            }
            this.$refs.toast.show(res.message)
          })
        this.closePop()
      },
      previewMerchant() {
        this.loadImg = true
        Business.previewMerchant({merchant_id: this.merchant_id})
          .then((res) => {
            if (res.error !== ERR_OK) {
              this.$refs.toast.show(res.message)
              return
            }
            this.loadImg = false
            this.codeUrl = res.message.qrcode_url
          })
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
      },
      authorityNum(val, oldVal) { // 防止输入超过11位
        val = val.match(/\d{0,11}/) ? val.match(/\d{0,11}/)[0] : ''
        this.authorityNum = val
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
    flex: 1
    flex-direction: column
    background: $color-white
    border-radius: 5px
    box-shadow: 0 1px 6px 0 rgba(0, 8, 39, 0.10)
    padding: 30px
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
        height: 50px
        line-height: 50px
        font-family: $fontFamilyMeddle
        display: flex
        text-align: left
        justify-content: space-between
        padding-left: 40px
        color: $color-text33
        border-bottom-1px($color-line)
        .header-key
          flex: 1
          overflow: hidden
          &:nth-of-type(2)
            flex: 1.2
          &:last-child
            flex: 2.2
        .handle
          cursor: pointer
          .contxt
            position: relative
            &:before
            &:after
              content: ''
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
        .list-item
          height: 60px
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
            no-wrap()
            line-height: 18px
            &:nth-of-type(2)
              flex: 1.2
          .list-handle
            flex: 2.2
            color: $color-4985FC
            white-space: nowrap
            .handle-item
              padding: 0 7px
              border-left: 1px solid $color-line
              cursor: pointer
              &:first-child
                border-left: 0
                padding-left: 0
          .head-img
            width: 40px
            heihgt: 40px
    .pop-box
      z-index: 888
      position: fixed
      top: 0
      left: 200px
      bottom: 0
      right: 0
      display: flex
      align-items: center
      justify-content: center
      .pop-content
        width: 530px
        min-height: 260px
        background: $color-white
        border-radius: 3px
        box-shadow: 0 0 5px 0 rgba(12, 6, 14, 0.6)
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
            cursor: pointer
            background-size: 100% 100%
        .pop-main
          padding: 20px 30px
          text-align: left
          .input-box-big
            input-animate($color-text99, 0px, 471px, 91px)
          .popTxt
            padding: 8px
            resize: none
            font-size: 14px
            width: 100%
            height: 90px
            outline: none
            box-sizing: border-box
            border: 0.5px solid $color-line
            &::-webkit-input-placeholder
              color: $color-ccc
          .content-btn
            display: flex
            justify-content: flex-end
            margin-top: 27px
            .btn
              width: 96px
              height: 40px
              cursor: pointer
              border: 1px solid $color-ccc
              border-radius: 3px
              text-align: center
              box-sizing: border-box
              font-family: $fontFamilyRegular
              line-height: 40px
              font-size: 16px
              color: $color-text33
              transition: all 0.4s ease-out
              &.active
                background: $color-4985FC
                color: $color-white
                border: 0
                margin-left: 20px
              &:hover
                transition: all 0.4s ease-out
                font-size: 17px
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
          .load-img
            width: 40px
            height: 40px
          .add-call
            margin-top: 20px
            display: flex
            align-items: center
            .phone-box
              margin-left: 10px
              input-animate($color-text99, 3px, 181px, 31px, -1px, -1px, -1px)
            .phone-num
              width: 180px
              height: 30px
              outline: none
              line-height: 30px
              border: 1px solid $color-line
              border-radius: 3px
              padding: 0 5px
              box-sizing: border-box
        .code
          display: flex
          height: 260px
          justify-content: center
          align-items: center

  .model-active
    animation: layerFadeIn .3s

  .model-noactive
    animation: hideFadeIn .3s

  @keyframes layerFadeIn {
    0% {
      opacity: 0;
      transform: scale(.5)
    }
    100% {
      opacity: 1;
      transform: scale(1)
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
</style>
