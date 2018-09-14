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
        <div class="header-key" v-for="(item, index) in headerList" @click="handleClick(index)" :class="{'handle': index === 2 || index === 3 || index === 4 || index === 5}">
          <span class="contxt" :class="`${headClass[`class${index}`]}`">{{item}}</span>
        </div>
      </div>
      <div class="list-content">
        <div class="list-item" v-for="item in data">
          <span class="item">{{item.name}}</span>
          <span class="item">{{item.active_code}}</span>
          <span class="item">{{item.groups_num}}</span>
          <span class="item">{{item.potential_num}}</span>
          <span class="item">{{item.consume_num}}</span>
          <span class="item">{{item.order_num}}</span>
        </div>
      </div>
    </div>
    <page-detail ref="pageDetail" :pageDtail="pageDetail" @addPage="addPage"></page-detail>
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

  export default {
    name: 'member-list',
    data() {
      return {
        headerList: ['团长', '激活码', '成员数', '潜在客户数', '消费客户数', '订单数'],
        data: [],
        handleIndex: 0,
        headClass: {
          class2: '',
          class3: '',
          class4: '',
          class5: ''
        },
        requestData: {
          time: 'today',
          keyword: '',
          sort_type: '',
          start_time: '',
          end_time: '',
          page: 1,
          limit: 10
        },
        pageDetail: {
          total: 1,
          per_page: 10,
          total_page: 1
        }
      }
    },
    created() {
      this.getMemberList()
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
        this.requestData.page = 1
        this.$refs.pageDetail.beginPage()
        this.getMemberList()
      },
      getMemberList() {
        Business.getMemberList(this.requestData)
          .then((res) => {
            if (res.error !== ERR_OK) {
              this.$emit('setNull', true)
              this.$refs.toast.show(res.message)
              return
            }
            this.data = res.data
            this.pageDetail.total = res.meta.total
            this.pageDetail.total_page = res.meta.last_page
            this.$emit('setNull', !this.data.length)
          })
      },
      search(inputTxt) {
        this.requestData.keyword = inputTxt
        this.requestData.page = 1
        this.$refs.pageDetail.beginPage()
        for (let val in this.headClass) {
          this.headClass[val] = ''
        }
        this.requestData.sort_type = ''
        this.getMemberList()
      },
      handleClick(num) {
        if (this.handleIndex === num) {
          if (this.headClass[`class${num}`] === 'down') {
            this.headClass[`class${num}`] = 'up'
            switch (num) {
              case 2:
                this.requestData.sort_type = 8
                break
              case 3:
                this.requestData.sort_type = 2
                break
              case 4:
                this.requestData.sort_type = 4
                break
              case 5:
                this.requestData.sort_type = 6
                break
            }
          } else {
            this.headClass[`class${num}`] = 'down'
            switch (num) {
              case 2:
                this.requestData.sort_type = 7
                break
              case 3:
                this.requestData.sort_type = 1
                break
              case 4:
                this.requestData.sort_type = 3
                break
              case 5:
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
            case 2:
              this.requestData.sort_type = 7
              break
            case 3:
              this.requestData.sort_type = 1
              break
            case 4:
              this.requestData.sort_type = 3
              break
            case 5:
              this.requestData.sort_type = 5
              break
          }
        }
        this.getMemberList()
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
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import '~common/stylus/mixin'
  .member-list
    display: flex
    flex: 1
    flex-direction: column
    background: $color-white
    border-radius: 5px
    box-shadow: 0 1px 6px 0 rgba(0,8,39,0.10)
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
      text-align: left
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
        justify-content: space-between
        padding-left: 40px
        color: $color-text33
        border-bottom: 1px solid $color-line
        .header-key
          flex: 1
          overflow: hidden
        .handle
          cursor: pointer
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
            line-height: 18px
            no-wrap()
</style>
