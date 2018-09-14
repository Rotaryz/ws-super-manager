<template>
  <div class="member-list">
    <div class="content-top">
      <div class="left">
        <date-select @checkTime="checkTime"></date-select>
        <search @search="search" placeholerTxt="请输入团长名称"></search>
      </div>
    </div>
    <div class="content-list">
      <div class="list-header">
        <!--<span class="header-key">团长</span>-->
        <!--<span class="header-key">激活码</span>-->
        <!--<div class="header-key" @click="handleClick(0)"><span class="contxt" :class="headClass.class0" >成员数</span></div>-->
        <!--<div class="header-key" @click="handleClick(1)"><span class="contxt" :class="headClass.class1" >潜在客户数</span></div>-->
        <!--<div class="header-key" @click="handleClick(2)"><span class="contxt" :class="headClass.class2" >消费客户数</span></div>-->
        <!--<div class="header-key" @click="handleClick(3)"><span class="contxt" :class="headClass.class3" >订单数</span></div>-->
        <div class="header-key" v-for="(item, index) in headerList" @click="handleClick(index)" :class="{'handle': index === 2 || index === 3 || index === 4 || index === 5}">
          <span class="contxt" :class="`${headClass[`class${index}`]}`">{{item}}</span>
        </div>
      </div>
      <div class="list-content">
        <div class="list-item" v-for="val in arr">
          <span class="item">某某某</span>
          <span class="item">100</span>
          <span class="item">100</span>
          <span class="item">100</span>
          <span class="item">100</span>
          <span class="item">100</span>
        </div>
      </div>
    </div>
    <page-detail :pageDtail="pageDetail" @addPage="addPage"></page-detail>
    <toast></toast>
  </div>
</template>

<script>
  import Search from 'components/search/search' // 搜索框
  import DateSelect from 'components/date-select/date-select' // 下拉框
  import PageDetail from 'components/page-detail/page-detail' // 下拉框
  import {Business} from 'api'
  import {ERR_OK} from 'common/js/config'
  import Toast from 'components/toast/toast'
  // import storage from 'storage-controller'

  export default {
    name: 'member-list',
    data() {
      return {
        arr: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        headerList: ['团长', '激活码', '成员数', '潜在客户数', '消费客户数', '订单数'],
        // headClass: ['on', 'on', 'on', 'on'],
        data: [],
        handleIndex: 0,
        headClass: {
          class2: '',
          class3: '',
          class4: '',
          class5: ''
        },
        handleType: {
          type2: 1,
          type3: 1,
          type4: 1,
          type5: 1
        },
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
        }
      }
    },
    methods: {
      checkTime(status) {
        console.log(status)
      },
      getMemberList() {
        Business.getMemberList()
          .then((res) => {
            if (res.error !== ERR_OK) {
              this.$emit('setNull', true)
              this.$refs.toast.show(res.message)
              return
            }
            this.data = res.data
            this.$emit('setNull', !this.data.length)
          })
      },
      search(inputTxt) {
        this.requestData.name = inputTxt
        this.getMemberList()
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
      addPage(num) {
        this.requestData.page = num
        this.getMemberList()
      }
    },
    components: {
      Search,
      DateSelect,
      PageDetail,
      Toast
    },
    mounted() {
      // this.$emit('showShade')
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import '~common/stylus/mixin'
  .member-list
    display: flex
    flex-direction: column
    background: $color-white
    border-radius: 5px
    box-shadow: 0 1px 6px 0 rgba(0, 8, 39, 0.10)
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
          cursor: pointer
        .handle
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
</style>
