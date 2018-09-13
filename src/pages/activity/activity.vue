<template>
  <div class="activity">
    <div class="ac-tab">
      <date-select @checkTime="_checkTime"></date-select>
      <admin-select :select="activityType" role="activity"  @setValue="setValue"></admin-select>
      <search @search="_search" placeholerTxt="请输入商品名称"></search>
      <a class="excel">导出Excel</a>
    </div>
    <div class="form-list">
      <div class="list-header">
        <div class="list-item" v-for="(item, index) in titleList" :key="index">
          {{item}}
        </div>
      </div>
      <div class="list">
        <div class="list-box">
          <div class="list-item list-text">
            <div class="pic-box">
              <img src="" class="pic">
            </div>
          </div>
          <div class="list-item list-text">{{'---'}}</div>
          <div class="list-item list-text">{{'---'}}</div>
          <div class="list-item list-text">---</div>
          <div class="list-item list-text">---</div>
          <div class="list-item list-text">{{'---'}}</div>
          <div class="list-item list-text">{{'---'}}
          </div>
        </div>
      </div>
      <div class="page">
        <!--:pageDtail="pageTotal" @addPage="_addPage"-->
        <page-detail ref="page"></page-detail>
      </div>
    </div>
  </div>
</template>

<script>
  import Search from 'components/search/search' // 搜索框
  import AdminSelect from 'components/admin-select/admin-select' // 下拉框
  import DateSelect from 'components/date-select/date-select' // 下拉框
  import PageDetail from 'components/page-detail/page-detail' // 下拉框
  import {ERR_OK, BASE_URL} from '../../common/js/config' // 下拉框
  import storage from 'storage-controller'
  import {Goods} from 'api'

  const TITLELIST = ['活动图片', '活动标题', '活动价', '活动类型', '活动状态', '活动来源', '创建时间']

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
        date: 'today',
        keyWord: '',
        startTime: '',
        endTime: '',
        fiDate: 'today',
        fiStart: '',
        fiEnd: '',
        status: '',
        statusEnd: '',
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
      setValue(item) {
        this.activityType[0].children[0].content = item.title
        this.statusEnd = item.status
      },
      _getUrl() {
        this.downUrl = BASE_URL.api + `/api/admin/goods-export?access_token=${storage.get('aiToken')}&limit=10&title=${this.keyWord}&time=${this.date}&sort_type=${this.sortType}&start_time=${this.startTime}&end_time=${this.endTime}`
      },
      async _search(word) {
        this.page = 1
        this.keyWord = word
        this.date = this.fiDate
        this.startTime = this.fiStart
        this.endTime = this.fiEnd
        this.status = this.statusEnd
        this.$refs.page.beginPage()
        await this._getGoodsList()
      },
      _checkTime(time) {
        if (typeof time === 'string') {
          this.fiDate = time
          this.fiStart = ''
          this.fiEnd = ''
          return
        }
        this.fiDate = ''
        this.fiStart = time[0]
        this.fiEnd = time[1]
      },
      async _getGoodsList() {
        let data = {limit: 10, page: this.page, time: this.date, activity_name: this.keyWord, start_time: this.startTime, end_time: this.endTime, rule_id: this.status}
        let res = await Goods.activities(data)
        if (res.error !== ERR_OK) {
          this.$emit('setNull', true)
          this.$emit('showToast', res.message)
          return
        }
        let pages = res.meta
        this.pageTotal = Object.assign({}, {
          total: pages.total,
          per_page: pages.per_page,
          total_page: pages.last_page
        })
        this.goodsList = res.data
        this.$emit('setNull', !this.goodsList.length)
        console.log(this.goodsList)
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
    .list-box
      height: 10%
      overflow: hidden
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
    &:nth-child(2)
      flex: 1.5

  .list-box-active
    background: $color-background

  .page
    height: 9.1%
</style>
