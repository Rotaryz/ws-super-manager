<template>
  <div class="dataOverView">
    <div class="data-top">
      <div class="data-left">
        <div class="left-con">
          <div class="title">实时概况</div>
          <div class="line-box">
            <div class="data-number">
              <div class="number-left">
                <div class="text">交易金额(元)</div>
                <div class="number">{{totalMoeny}}</div>
              </div>
              <div class="number-right">
                <div class="text">昨天全天(元)</div>
                <div class="number">{{yesterMoney}}</div>
              </div>
            </div>
            <div id="myLine"></div>
          </div>
        </div>
      </div>
      <div class="data-right">
        <div class="data-item" v-for="(item, index) in dataOverview" v-bind:key="index">
          <div class="item-box">
            <div class="item-title">
              <div class="icon" :class="item.icon"></div><div class="text">{{item.title}}</div>
            </div>
            <div class="big-munber">{{item.number}}</div>
            <div class="all-text">累计</div>
            <div class="all-number">{{item.allNumber}}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="data-bottom">
      <div class="echart-top">
        <div class="echart-left">
          <div class="text">数据统计</div>
          <DateSelect :arrTitle="typeList" @checkTime="checkType"></DateSelect>
        </div>
        <DateSelect :arrTitle="navList" @checkTime="checkTime"></DateSelect>
      </div>
      <div class="echart-box">
        <div id="echartLine"></div>
      </div>
    </div>
  </div>
</template>

<script>
  import Search from 'components/search/search' // 搜索框
  import AdminSelect from 'components/admin-select/admin-select' // 下拉框
  import DateSelect from 'components/date-select/date-select' // 下拉框
  import PageDetail from 'components/page-detail/page-detail' // 下拉框
  import { Data } from 'api'
  import { ERR_OK } from 'common/js/config'

  const OVERVIEW = [{icon: 'shop', number: 0, title: '商家数量', allNumber: 0}, {icon: 'pay', number: 0, title: '付费店铺数', allNumber: 0}, {icon: 'order', number: 0, title: '交易订单数量', allNumber: 0}, {icon: 'amount', number: 0, title: '交易金额(元)', allNumber: 0}]
  const NAVLIST = [{title: '今天', status: '1'}, {title: '昨天', status: '2'}, {title: '7天', status: '3'}, {title: '30天', status: '4'}]
  const TYPELIST = [{title: '商家', status: '1'}, {title: '付费店铺', status: '2'}, {title: '交易订单', status: '3'}, {title: '交易金额', status: '4'}]
  export default {
    name: 'data-overview',
    data() {
      return {
        dataOverview: OVERVIEW,
        navList: NAVLIST,
        typeList: TYPELIST,
        number: 0,
        totalMoeny: 0,
        yesterMoney: 0,
        yesDay: {},
        totalDay: {},
        navIndex: 1,
        typeIndex: 1
      }
    },
    components: {
      Search,
      AdminSelect,
      DateSelect,
      PageDetail
    },
    created() {
      this.getExchangeData()
      this.getTotalMode()
      this.totalChart()
      this.$emit('setNull', false)
    },
    mounted() {
      this.$emit('setTab', false)
      let that = this
      window.onresize = () => {
        return (() => {
          if (that.$route.path === '/data-overview') {
            that.drawLine()
            that.drawTotalLine()
          }
        })()
      }
    },
    destroyed() {
      this.$emit('setTab', true)
    },
    methods: {
      getExchangeData() {
        Data.exchangeMoney().then(res => {
          if (res.error === ERR_OK) {
            this.totalMoeny = res.data.totalPayment
            this.yesterMoney = res.data.yesterdayPayment
            this.yesDay = res.data
            this.drawLine()
          } else {
            this.$emit('showToast', res.message)
          }
        })
      },
      getTotalMode() {
        Data.totalMode().then(res => {
          if (res.error === ERR_OK) {
            let data = OVERVIEW
            data.forEach((item) => {
              if (item.icon === 'shop') {
                item.number = res.data.Merchant[0]
                item.allNumber = res.data.Merchant[1]
              }
              if (item.icon === 'pay') {
                item.number = res.data.shop[0]
                item.allNumber = res.data.shop[1]
              }
              if (item.icon === 'order') {
                item.number = res.data.orderNUM[0]
                item.allNumber = res.data.orderNUM[1]
              }
              if (item.icon === 'amount') {
                item.number = res.data.orderToatal[0]
                item.allNumber = res.data.orderToatal[1]
              }
            })
          } else {
            this.$emit('showToast', res.message)
          }
        })
      },
      totalChart() {
        Data.totalChart(this.typeIndex, this.navIndex).then(res => {
          if (res.error === ERR_OK) {
            this.totalDay = res.data
            this.drawTotalLine()
          } else {
            this.$emit('showToast', res.message)
          }
        })
      },
      drawLine() {
        let myChart = this.$echarts.init(document.getElementById('myLine'))
        myChart.setOption({
          grid: {
            top: 105,
            left: 30,
            right: 8,
            bottom: 15,
            containLabel: true
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: this.yesDay.line,
            splitLine: {
              show: false,
              lineStyle: {
                color: '#E6E6E6',
                width: 0.5
              }
            },
            axisLabel: {
              color: '#666',
              fontSize: 12,
              align: 'center'
            },
            axisTick: {
              lineStyle: {
                color: '#ccc',
                width: 0.5
              }
            },
            axisLine: {
              lineStyle: {
                color: '#ccc',
                width: 0.5
              }
            }
          },
          tooltip: {
            trigger: 'axis',
            textStyle: {
              align: 'left'
            },
            axisPointer: {
              lineStyle: {
                color: '#ccc',
                width: 0.5
              }
            }
          },
          yAxis: {
            minInterval: 1,
            type: 'value',
            splitLine: {
              show: true,
              lineStyle: {
                color: '#EFEFEF',
                width: 0.5,
                type: 'dotted'
              }
            },
            axisTick: {
              show: false,
              lineStyle: {
                color: '#c4c4c4',
                width: 0.5
              }
            },
            axisLabel: {
              formatter: '{value}',
              color: '#666'
            },
            axisLine: {
              show: false,
              lineStyle: {
                color: '#c4c4c4',
                width: 0.5
              }
            }
          },
          series: [{
            name: '昨天',
            data: this.yesDay.yesterday,
            type: 'line',
            smooth: true,
            showSymbol: false,
            symbol: 'circle',
            symbolSize: 3,
            smoothMonotone: 'x',
            areaStyle: {
              color: {
                type: 'linear',
                x: 0,
                x2: 0,
                y: 0,
                y2: 1,
                colorStops: [{
                  offset: 0, color: 'rgba(1,202,169,0.55)'
                }, {
                  offset: 1, color: 'rgba(1,202,169,0.05)'
                }],
                globalCoord: false
              }
            },
            itemStyle: {
              normal: {
                color: '#01CAA9',
                borderWidth: 1,
                shadowColor: '#01CAA9',
                shadowOffsetY: 0,
                shadowOffsetX: 0,
                shadowBlur: 10,
                borderColor: '#fff',
                opacity: 1,
                lineStyle: {
                  color: '#01CAA9',
                  width: 3
                }
              }
            }
          }, {
            name: '今天',
            data: this.yesDay.today,
            type: 'line',
            smooth: true,
            showSymbol: false,
            symbol: 'circle',
            smoothMonotone: 'x',
            symbolSize: 3,
            areaStyle: {
              color: {
                type: 'linear',
                x: 0,
                x2: 0,
                y: 0,
                y2: 1,
                colorStops: [{
                  offset: 0, color: 'rgba(73,133,252, 0.55)'
                }, {
                  offset: 1, color: 'rgba(73,133,252, 0.05)'
                }],
                globalCoord: false
              }
            },
            itemStyle: {
              normal: {
                color: 'rgba(73,133,252,1)',
                borderWidth: 1,
                borderColor: '#fff',
                shadowColor: 'rgba(73,133,252,1)',
                shadowOffsetY: 0,
                shadowOffsetX: 0,
                shadowBlur: 10,
                lineStyle: {
                  color: 'rgba(73,133,252,1)',
                  width: 3
                }
              }
            }
          }]
        })
        myChart.resize()
      },
      drawTotalLine() {
        let myChart = this.$echarts.init(document.getElementById('echartLine'))
        myChart.setOption({
          grid: {
            top: 60,
            left: '30px',
            right: '30px',
            bottom: 15,
            containLabel: true
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: this.totalDay.line,
            splitLine: {
              show: false,
              lineStyle: {
                color: '#E6E6E6',
                width: 0.5
              }
            },
            axisLabel: {
              color: '#666',
              fontSize: 12,
              align: 'center'
            },
            axisTick: {
              lineStyle: {
                color: '#ccc',
                width: 0.5
              }
            },
            axisLine: {
              lineStyle: {
                color: '#ccc',
                width: 0.5
              }
            }
          },
          tooltip: {
            trigger: 'axis',
            textStyle: {
              align: 'left'
            },
            axisPointer: {
              lineStyle: {
                color: '#ccc',
                width: 0.5
              }
            }
          },
          yAxis: {
            minInterval: 1,
            type: 'value',
            splitLine: {
              show: true,
              lineStyle: {
                color: '#EFEFEF',
                width: 0.5,
                type: 'dotted'
              }
            },
            axisTick: {
              show: false,
              lineStyle: {
                color: '#c4c4c4',
                width: 0.5
              }
            },
            axisLabel: {
              formatter: '{value}',
              color: '#666'
            },
            axisLine: {
              show: false,
              lineStyle: {
                color: '#c4c4c4',
                width: 0.5
              }
            }
          },
          series: [{
            name: '',
            data: this.totalDay.today,
            type: 'line',
            smooth: true,
            showSymbol: false,
            symbol: 'circle',
            smoothMonotone: 'x',
            symbolSize: 3,
            areaStyle: {
              color: {
                type: 'linear',
                x: 0,
                x2: 0,
                y: 0,
                y2: 1,
                colorStops: [{
                  offset: 0, color: 'rgba(73,133,252, 0.55)'
                }, {
                  offset: 1, color: 'rgba(73,133,252, 0.05)'
                }],
                globalCoord: false
              }
            },
            itemStyle: {
              normal: {
                color: 'rgba(73,133,252,1)',
                borderWidth: 1,
                borderColor: '#fff',
                shadowColor: 'rgba(73,133,252,1)',
                shadowOffsetY: 0,
                shadowOffsetX: 0,
                shadowBlur: 10,
                lineStyle: {
                  color: 'rgba(73,133,252,1)',
                  width: 3
                }
              }
            }
          }]
        })
        myChart.resize()
      },
      checkTime(index) {
        this.navIndex = index
        this.totalChart()
      },
      checkType(index) {
        this.typeIndex = index
        this.totalChart()
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import '~common/stylus/mixin'
  *
    box-sizing: border-box
    -moz-box-sizing: border-box
    -webkit-box-sizing: border-box
  .dataOverView
    flex: 1
    display: flex
    overflow: hidden
    border-radius: 6px
    box-shadow: 0 1px 6px 0 rgba(0, 8, 39, 0.10)
    flex-direction: column
  .data-top
    layout(row)
    width: 100%
    margin-bottom: 20px
    .data-left
      width: 55.5%
      padding-right: 20px
      .left-con
        height: 380px
        background: #fff
        width: 100%
        box-shadow: 0 1px 3px 0 rgba(0,8,39,0.10)
        border-radius: 3px
        padding-right: 30px
        .title
          font-family: $fontFamilyRegular
          font-size: $font-size-large18
          color: $color-text33
          padding-left: 30px
          height: 60px
          line-height: 60px
          text-align: left
          border-bottom-1px()
        .data-number
          position: absolute
          width: 100%
          top: 26px
          left: 0
          padding-left: 30px
          layout(row)
          justify-content: space-between
          .number-left
            text-align: left
            .text
              font-family: $fontFamilyRegular
              font-size: $font-size-medium14
              color: $color-text99
              margin-bottom: 12px
            .number
              font-family: $fontFamilyMeddle
              font-size: 26px
              color: $color-text33
          .number-right
            padding-right: 8px
            .text
              font-family: $fontFamilyRegular
              font-size: $font-size-small12
              color: $color-text99
              margin-bottom: 10px
            .number
              font-family: $fontFamilyMeddle
              font-size: $font-size-large18
              color: $color-text-66
        .line-box
          height: 320px
          width: 100%
          position: relative
          #myLine
            width: 100%
            height: 320px
    .data-right
      height: 380px
      width: 44.5%
      layout(row)
      align-content: space-between
      .data-item
        width: 50%
        height: 180px
        text-align: left
        &:nth-child(odd)
          padding-right: 10px
        &:nth-child(even)
          padding-left: 10px
        .item-box
          height: 180px
          background: $color-white
          box-shadow: 0 1px 3px 0 rgba(0,8,39,0.10)
          border-radius: 3px
          width:100%
          padding-top: 30px
          .item-title
            layout(row)
            align-items: center
            padding-left: 54px
            margin-bottom: 12px
            .icon
              width: 18px
              height: 18px
              margin-right: 8px
              background-size: 18px
              &.shop
                bg-image(icon-shopcount)
              &.amount
                bg-image(icon-amount)
              &.order
                bg-image(icon-ordercount)
              &.pay
                bg-image(icon-payshop)
            .text
              font-family: $fontFamilyRegular
              font-size: $font-size-medium14
              color: $color-text99
          .big-munber
            font-family: $fontFamilyMeddle
            font-size: 26px
            margin-bottom: 30px
            color: $color-text33
            padding-left: 80px
          .all-text
            font-family: $fontFamilyRegular
            font-size: $font-size-small12
            margin-bottom: 8px
            color: $color-text99
            padding-left: 80px
          .all-number
            font-family: $fontFamilyMeddle
            font-size: $font-size-large18
            color: $color-text-66
            padding-left: 80px
  .data-bottom
    background: $color-white
    box-shadow: 0 1px 3px 0 rgba(0,8,39,0.10)
    border-radius: 3px
    .echart-top
      height: 60px
      layout(row)
      align-items: center
      justify-content: space-between
      border-bottom-1px()
      padding: 0 30px
      .echart-left
        layout(row)
        align-items: center
        .text
          text-align: left
          font-family: $fontFamilyRegular
          font-size: $font-size-large18
          color: $color-text33
          margin-right: 46px
    .echart-box
      height: 320px
      width: 100%
      position: relative
      #echartLine
        width: 100%
        height: 320px
  .z
    width: 1px
</style>
