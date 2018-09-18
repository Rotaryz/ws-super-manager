<template>
  <div class="activity">
    <div class="ac-tab">
      <date-select @checkTime="_checkTime"></date-select>
      <admin-select :select="activityType" role="activity" @setValue="setValue"></admin-select>
      <search @search="_search" placeholerTxt="请输入商家名称、活动名称"></search>
      <a :href="downUrl" target="_blank" class="excel">导出Excel</a>
    </div>
    <div class="form-list">
      <div class="list-header">
        <div class="list-item" v-for="(item, index) in titleList" :key="index">
          {{item}}
        </div>
      </div>
      <div class="list">
        <div class="list-box" v-for="(item, index) in goodsList" :key="index">
          <div class="list-item list-text">
            <div class="pic-box">
              <img :src="item.goods_image_url" class="pic">
            </div>
          </div>
          <div class="list-item list-text text-overflow-two ">{{item.activity_name || '---'}}</div>
          <div class="list-item list-text">{{item.price || '---'}}</div>
          <div class="list-item list-text">{{item.rule_id === 1 ? '火爆拼团' : item.rule_id === 3 ? '疯狂砍价' : '---'}}</div>
          <div class="list-item list-text">{{item.activity_status_str || '---'}}</div>
          <div class="list-item list-text text-overflow-two ">{{item.goods_title || '---'}}</div>
          <div class="list-item list-text">
            <router-link tag="a" target="_blank" :to="'/business-list?num='+ item.merchant_account" class="bule hand">{{item.merchant_name || '---'}}</router-link>
          </div>
          <div class="list-item list-text">{{item.created_at || '---'}}
          </div>
        </div>
      </div>
      <div class="page">
        <!---->
        <page-detail ref="page" :pageDtail="pageTotal" @addPage="_addPage"></page-detail>
      </div>
    </div>
  </div>
</template>

<script>
  import Search from 'components/search/search' // 搜索框
  import AdminSelect from 'components/admin-select/admin-select' // 下拉框
  import DateSelect from 'components/date-select/date-select' // 下拉框
  import PageDetail from 'components/page-detail/page-detail' // 下拉框
  import {ERR_OK, BASE_URL, BEGIN_TIME} from '../../common/js/config' // 下拉框
  import storage from 'storage-controller'
  import {Goods} from 'api'

  const TITLELIST = ['活动图片', '活动标题', '活动价', '活动类型', '活动状态', '关联商品', '活动来源', '创建时间']

  export default {
    name: 'activity',
    data() {
      return {
        titleList: TITLELIST,
        activityType: [{
          select: false,
          show: false,
          children: [{content: '活动类型', data: [{title: '全部', status: ''}, {title: '火爆拼团', status: '1'}, {title: '疯狂砍价', status: '3'}]}]
        }],
        page: 1,
        date: BEGIN_TIME,
        keyWord: '',
        startTime: '',
        endTime: '',
        status: '',
        showIndex: 0,
        goodsList: [],
        pageTotal: {
          total: 1,
          per_page: 10,
          total_page: 1
        },
        downUrl: ''
      }
    },
    async created() {
      this._getUrl()
      await this._getGoodsList()
    },
    methods: {
      async setValue(item) {
        this.activityType[0].children[0].content = item.title
        this.status = item.status
        await this._getGoodsList()
      },
      _getUrl() {
        this.downUrl = BASE_URL.api + `/api/admin/activity-export?access_token=${storage.get('aiToken')}&activity_name=${this.keyWord}&time=${this.date}&rule_id=${this.status}&start_time=${this.startTime}&end_time=${this.endTime}`
      },
      async _search(word) {
        this.page = 1
        this.keyWord = word
        this.$refs.page.beginPage()
        await this._getGoodsList()
      },
      async _checkTime(time) {
        if (typeof time === 'string') {
          this.date = time
          this.startTime = ''
          this.endTime = ''
        } else {
          this.date = ''
          this.startTime = time[0]
          this.endTime = time[1]
        }
        this.page = 1
        this.$refs.page.beginPage()
        await this._getGoodsList()
      },
      async _getGoodsList() {
        let data = {limit: 10, page: this.page, time: this.date, activity_name: this.keyWord, start_time: this.startTime, end_time: this.endTime, rule_id: this.status}
        let res = await Goods.activities(data)
        if (res.error !== ERR_OK) {
          this.$emit('setNull', true)
          this.$emit('showToast', res.message)
          return
        }
        this._getUrl()
        let pages = res.meta
        this.pageTotal = Object.assign({}, {
          total: pages.total,
          per_page: pages.per_page,
          total_page: pages.last_page
        })
        this.goodsList = res.data
        this.$emit('setNull', !this.goodsList.length)
      },
      async _addPage(page) {
        this.page = page
        await this._getGoodsList()
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
    min-height: 88px
    max-height: 88px
    box-sizing: border-box
    display: flex
    align-items: center
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
        -webkit-box-orient: vertical
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
    &:nth-child(2),&:nth-child(6)
      flex: 1.5
      word-break: break-all
      line-height: 18px
      overflow: hidden
      text-overflow: ellipsis
      display: -webkit-box
      -webkit-line-clamp: 2
      white-space: normal !important
      text-align: left
      padding-right: 30px

  .list-box-active
    background: $color-background

  .page
    display: flex
    align-items: center
    width: 100%
    position: absolute
    bottom: 0
    color: $color-white
    height: 60px
</style>
