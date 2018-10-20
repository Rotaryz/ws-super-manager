<template>
  <div class="dataOverView">
    <div class="data-top">
      <div class="data-right">
        <div class="data-item" v-for="(item, index) in dataOverview" v-bind:key="index">
          <div class="item-box">
            <div class="item-title">
              <div class="icon" :class="item.icon"></div>
              <div class="text">{{item.title}}</div>
              <div class="data-icon hand" @mouseenter="_showTip(index)" @mouseleave="_hideTip">
                <transition name="fade">
                  <div class="data-show-tip" v-show="showTipIndex === index">实时数据，两小时统计一次并刷新数据</div>
                </transition>
              </div>
            </div>
            <div class="big-munber">{{item.number}}</div>
            <div class="all-text">
              <span>昨日：{{item.yesterday}}</span>
              <span>{{item.text}}：{{item.allNum}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="data-center">
      <div class="data-center-item">
        <div class="data-center-item-top">
          <p class="data-center-name">客户统计</p>
          <DateSelect ref="times" :arrTitle="navList" :tabActive="3" @checkTime="_custmerDate" :tabIndex="2"></DateSelect>
        </div>
        <div class="customer-box">
          <div id="customer"></div>
        </div>
      </div>
      <div class="data-center-item">
        <div class="data-center-item-top">
          <p class="data-center-name">开店统计</p>
          <DateSelect ref="times2" :arrTitle="navList" :tabActive="3" @checkTime="_openDate" :tabIndex="2"></DateSelect>
        </div>
        <div class="customer-box">
          <div id="openShop"></div>
        </div>
      </div>
    </div>
    <!--        <div id="echartLine"></div>-->
    <div class="data-center">
      <div class="data-center-item">
        <div class="data-center-item-top">
          <p class="data-center-name">订单统计</p>
          <DateSelect ref="times3" :arrTitle="navList" :tabActive="3" @checkTime="_orderDate" :tabIndex="2"></DateSelect>
        </div>
        <div class="customer-box">
          <div id="echartLine"></div>
        </div>
      </div>
      <div class="data-center-item">
        <div class="data-center-item-top">
          <p class="data-center-name">交易金额统计</p>
          <DateSelect ref="times4" :arrTitle="navList" :tabActive="3" @checkTime="_moneyDate" :tabIndex="2"></DateSelect>
        </div>
        <div class="customer-box">
          <div id="myLine"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Search from 'components/search/search' // 搜索框
  import AdminSelect from 'components/admin-select/admin-select' // 下拉框
  import DateSelect from 'components/date-select/date-select' // 下拉框
  import PageDetail from 'components/page-detail/page-detail' // 下拉框
  import {Data} from 'api'
  import {ERR_OK, BEGIN_TIME} from 'common/js/config'

  const OVERVIEW = [{icon: 'user', number: 0, title: '新用户', allNum: 0, yesterday: 0, text: '总客户数'}, {icon: 'shop', number: 0, title: '正式版店铺', allNum: 0, yesterday: 0, text: '总店铺数'}, {icon: 'order', number: 0, title: '成交订单', allNum: 0, yesterday: 0, text: '总成交订单数'}, {icon: 'amount', number: 0, title: '交易金额', allNum: 0, yesterday: 0, text: '总交易金额'}]
  const NAVLIST = [{title: '昨天', status: 'allNum'}, {title: '7天', status: 'week'}, {title: '30天', status: 'month'}, {title: '自定义', status: 'set'}]
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
        navIndex: BEGIN_TIME,
        typeIndex: 1,
        showTipIndex: null
      }
    },
    components: {
      Search,
      AdminSelect,
      DateSelect,
      PageDetail
    },
    created() {
      // this.getExchangeData()
      this.getTotalMode()
      this.totalChart(1)
      this.totalChart(2)
      this.totalChart(3)
      this.totalChart(4)
      this.$emit('setNull', false)
    },
    mounted() {
      this.$emit('setTab', false)
      let that = this
      window.onresize = () => {
        return (() => {
          if (that.$route.path === '/data-overview') {
            // this.getTotalMode()
            // this.totalChart(1)
            // this.totalChart(2)
            // this.totalChart(3)
            // this.totalChart(4)
          }
        })()
      }
    },
    destroyed() {
      this.$emit('setTab', true)
    },
    methods: {
      _showTip(index) {
        this.showTipIndex = index
      },
      _hideTip() {
        this.showTipIndex = null
      },
      // getExchangeData() {
      //   Data.exchangeMoney().then(res => {
      //     if (res.error === ERR_OK) {
      //       this.totalMoeny = res.data.total_payment
      //       this.yesterMoney = res.data.allNum_payment
      //       this.yesDay = res.data
      //       this.totalChart(1)
      //       this.totalChart(2)
      //       this.totalChart(3)
      //       this.totalChart(4)
      //     } else {
      //       this.$emit('showToast', res.message)
      //     }
      //   })
      // },
      getTotalMode() {
        Data.totalMode().then(res => {
          if (res.error === ERR_OK) {
            let data = OVERVIEW
            data.forEach((item) => {
              if (item.icon === 'user') {
                item.number = res.data.new_customer.today_num
                item.yesterday = res.data.new_customer.yesterday_num
                item.allNum = res.data.new_customer.total_num
              }
              if (item.icon === 'shop') {
                item.number = res.data.formal_shop.today_num
                item.allNum = res.data.formal_shop.total_num
                item.yesterday = res.data.formal_shop.yesterday_num
              }
              if (item.icon === 'order') {
                item.number = res.data.success_order.today_num
                item.yesterday = res.data.success_order.yesterday_num
                item.allNum = res.data.success_order.total_num
              }
              if (item.icon === 'amount') {
                item.number = res.data.success_order_amount.today_amount
                item.yesterday = res.data.success_order_amount.yesterday_amount
                item.allNum = res.data.success_order_amount.total_amount
              }
            })
          } else {
            this.$emit('showToast', res.message)
          }
        })
      },
      totalChart(type, time = 'month', start = '', end = '') {
        let data = {stats_type: type, date_type: time, start_date: start, end_date: end}
        Data.totalChart(data).then(async res => {
          this.$refs.times.setDate(1)
          this.$refs.times2.setDate(1)
          this.$refs.times3.setDate(1)
          this.$refs.times4.setDate(1)
          this.$refs.times.setIndex(2)
          this.$refs.times2.setIndex(2)
          this.$refs.times3.setIndex(2)
          this.$refs.times4.setIndex(2)
          if (res.error === ERR_OK) {
            // console.log(res.data)
            switch (type) {
              case 1:
                let date = this._infoDate(res.data)
                let between = this._infoDate(res.data, 'at_between')
                let arr = this._infoData(res.data)
                await this.drawCustomer(date, arr, between)
                break
              case 2:
                let date2 = this._infoDate(res.data)
                let arr2 = this._infoData(res.data)
                let between2 = this._infoDate(res.data, 'at_between')
                await this.drawOpenShop(date2, arr2, between2)
                break
              case 3:
                let date3 = this._infoDate(res.data)
                let arr3 = this._infoData(res.data)
                let between3 = this._infoDate(res.data, 'at_between')
                this.drawTotalLine(date3, arr3, between3)
                break
              case 4:
                let date4 = this._infoDate(res.data)
                let arr4 = this._infoData(res.data)
                let between4 = this._infoDate(res.data, 'at_between')
                this.drawLine(date4, arr4, between4)
                break
            }
            // console.log(res)
            // this.totalDay = res.data
            // this.drawTotalLine()
          } else {
            this.$emit('showToast', res.message)
          }
        })
      },
      _infoDate(data, type = 'at') {
        if (!data.length) {
          return false
        }
        let date = []
        data.forEach((item) => {
          date.push(item[type])
        })
        return date
      },
      _infoData(data) {
        if (!data.length) {
          return
        }
        let arr = {}
        for (let value in data[0]) {
          if (value !== 'at') {
            arr[value] = []
          }
        }
        data.forEach((item) => {
          for (let value in item) {
            if (value !== 'at') {
              arr[value].push(item[value])
            }
          }
        })
        return arr
      },
      drawOpenShop(data, arr, between) {
        data = data || ['2:00', '4:00', '06:00', '8:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00', '24:00']
        between = between || ['0:00 ~ 2:00', '2:00 ~ 4:00', '4:00 ~ 6:00', '6:00 ~ 8:00', '8:00 ~ 10:00', '10:00 ~ 12:00', '12:00 ~ 14:00', '14:00 ~ 16:00', '16:00 ~ 18:00', '18:00 ~ 20:00', '20:00 ~ 22:00', '22:00 ~ 24:00']
        arr = arr || {online_num: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], platform_num: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], agent_num: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], invite_code_num: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], experience_num: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]}
        let myChart = this.$echarts.init(document.getElementById('openShop'))
        myChart.setOption({
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            },
            formatter: function (params) {
              let tatol = 0
              params.forEach((item) => {
                tatol = tatol * 1 + item.data * 1
              })
              let arr = `<p style="text-align: left;margin: 0px 10px 6px;font-size: 16px;font-family: PingFangSC-Regular">${between[params[0].dataIndex]}(合计: ${tatol})</p>`
              params.forEach((item) => {
                let marker = `<span style="display:inline-block;margin-right:8px;border-radius:50%;width:5px;height:5px;background-color:${item.color}"></span>`
                arr += `<p style="text-align: left; margin: 0px 10px 6px; font-size: 14px; font-family: PingFangSC-Regular">${marker}${item.seriesName} ${item.data}</p>`
              })
              return arr
            }
          },
          legend: {
            itemWidth: 14,
            itemHeight: 14,
            borderRadius: 0,
            bottom: 19
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '63',
            containLabel: true
          },
          xAxis: [
            {
              type: 'category',
              data: data
            }
          ],
          yAxis: [
            {
              minInterval: 1,
              splitLine: {
                show: true,
                lineStyle: {
                  color: '#EFEFEF',
                  width: 0.5,
                  type: 'dotted'
                }
              },
              type: 'value'
            }
          ],
          series: [
            {
              name: '线上开通',
              type: 'bar',
              stack: '1',
              data: arr.online_num,
              barWidth: 16,
              color: '#2D4692'
            },
            {
              name: '平台开通',
              type: 'bar',
              stack: '1',
              color: '#6ED1F5',
              barWidth: 16,
              data: arr.platform_num
            },
            {
              name: '代理开通',
              type: 'bar',
              stack: '1',
              color: '#C74855',
              barWidth: 16,
              data: arr.agent_num
            },
            {
              name: '激活码开通',
              type: 'bar',
              stack: '1',
              color: '#FB703F',
              barWidth: 16,
              data: arr.invite_code_num
            },
            {
              name: '体验版',
              type: 'bar',
              stack: '1',
              color: '#FFD15B',
              barWidth: 16,
              data: arr.experience_num
            }
          ]
        })
        myChart.resize()
      },
      _custmerDate(data) {
        this._infoTime(1, data)
      },
      _openDate(data) {
        this._infoTime(2, data)
      },
      _orderDate(data) {
        this._infoTime(3, data)
      },
      _moneyDate(data) {
        this._infoTime(4, data)
      },
      _infoTime(type, data) {
        if (typeof data === 'string') {
          this.totalChart(type, data)
          return
        }
        this.totalChart(type, '', data[0], data[1])
      },
      async drawCustomer(data, arr, between) {
        data = data || ['2:00', '4:00', '06:00', '8:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00', '24:00']
        between = between || ['0:00 ~ 2:00', '2:00 ~ 4:00', '4:00 ~ 6:00', '6:00 ~ 8:00', '8:00 ~ 10:00', '10:00 ~ 12:00', '12:00 ~ 14:00', '14:00 ~ 16:00', '16:00 ~ 18:00', '18:00 ~ 20:00', '20:00 ~ 22:00', '22:00 ~ 24:00']
        arr = arr || {potential_num: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], consume_num: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]}
        let myChart = this.$echarts.init(document.getElementById('customer'))
        myChart.setOption({
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            },
            formatter: function (params) {
              let tatol = 0
              params.forEach((item) => {
                tatol = tatol * 1 + item.data * 1
              })
              let arr = `<p style="text-align: left;margin: 0px 10px 6px;font-size: 16px;font-family: PingFangSC-Regular">${between[params[0].dataIndex]}(合计: ${tatol})</p>`
              params.forEach((item) => {
                let marker = `<span style="display:inline-block;margin-right:8px;border-radius:50%;width:5px;height:5px;background-color:${item.color}"></span>`
                arr += `<p style="text-align: left; margin: 0px 10px 6px; font-size: 14px; font-family: PingFangSC-Regular">${marker}${item.seriesName} ${item.data}</p>`
              })
              return arr
            }
          },
          legend: {
            itemWidth: 14,
            itemHeight: 14,
            borderRadius: 0,
            bottom: 19
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '63',
            containLabel: true
          },
          xAxis: [
            {
              type: 'category',
              data: data
            }
          ],
          yAxis: [
            {
              minInterval: 1,
              splitLine: {
                show: true,
                lineStyle: {
                  color: '#EFEFEF',
                  width: 0.5,
                  type: 'dotted'
                }
              },
              type: 'value'
            }
          ],
          series: [
            {
              name: '潜在用户',
              type: 'bar',
              stack: '开店统计',
              data: arr.potential_num,
              barWidth: 16,
              color: '#2D4692'
            },
            {
              name: '消费用户',
              type: 'bar',
              stack: '开店统计',
              color: '#6ED1F5',
              barWidth: 16,
              data: arr.consume_num
            }
          ]
        })
        myChart.resize()
      },
      drawLine(data, arr, between) {
        data = data || ['2:00', '4:00', '06:00', '8:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00', '24:00']
        arr = arr || {pay_amount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]}
        between = between || ['0:00 ~ 2:00', '2:00 ~ 4:00', '4:00 ~ 6:00', '6:00 ~ 8:00', '8:00 ~ 10:00', '10:00 ~ 12:00', '12:00 ~ 14:00', '14:00 ~ 16:00', '16:00 ~ 18:00', '18:00 ~ 20:00', '20:00 ~ 22:00', '22:00 ~ 24:00']
        let myChart = this.$echarts.init(document.getElementById('myLine'))
        myChart.setOption({
          // formatter: function (params) {
          //   let tatol = 0
          //   params.forEach((item) => {
          //     tatol += parseFloat(item.data)
          //   })
          //   let arr = `<p style="text-align: left;margin: 0px 10px 6px;font-size: 16px;font-family: PingFangSC-Regular">${between[params[0].dataIndex]}(合计: ${tatol})</p>`
          //   params.forEach((item) => {
          //     let marker = `<span style="display:inline-block;margin-right:8px;border-radius:50%;width:5px;height:5px;background-color:${item.color}"></span>`
          //     arr += `<p style="text-align: left; margin: 0px 10px 6px; font-size: 14px; font-family: PingFangSC-Regular">${marker}${item.seriesName} ${item.data}</p>`
          //   })
          //   return arr
          // },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '63',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: data,
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
            },
            padding: [10, 50, 10, 20]
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
            name: '交易金额',
            data: arr.pay_amount,
            type: 'line',
            // smooth: true,
            // showSymbol: false,
            // symbol: 'circle',
            // smoothMonotone: 'x',
            // symbolSize: 3,
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
                // borderColor: '#fff',
                // shadowColor: 'rgba(73,133,252,1)',
                // shadowOffsetY: 0,
                // shadowOffsetX: 0,
                // shadowBlur: 10,
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
      drawTotalLine(data, arr, between) {
        data = data || ['2:00', '4:00', '06:00', '8:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00', '24:00']
        arr = arr || {refund_num: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], pay_num: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], submit_num: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]}
        let myChart = this.$echarts.init(document.getElementById('echartLine'))
        myChart.setOption({
          // formatter: function (params) {
          //   if (typeof params !== 'object') {
          //     return params
          //   }
          //   let tatol = 0
          //   params.forEach((item) => {
          //     tatol += parseFloat(item.data)
          //   })
          //   let arr = `<p style="text-align: left;margin: 0px 10px 6px;font-size: 16px;font-family: PingFangSC-Regular">${between[params[0].dataIndex]}(合计: ${tatol})</p>`
          //   params.forEach((item) => {
          //     let marker = `<span style="display:inline-block;margin-right:8px;border-radius:50%;width:5px;height:5px;background-color:${item.color}"></span>`
          //     arr += `<p style="text-align: left; margin: 0px 10px 6px; font-size: 14px; font-family: PingFangSC-Regular">${marker}${item.seriesName} ${item.data}</p>`
          //   })
          //   return arr
          // },
          legend: {
            itemWidth: 14,
            itemHeight: 14,
            borderRadius: 0,
            bottom: 19,
            data: [
              {name: '提交订单', icon: 'rect'},
              {name: '支付订单', icon: 'rect'},
              {name: '退款订单', icon: 'rect'}
            ]
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '63',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: data,
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
            },
            padding: [10, 50, 10, 20]
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
            name: '提交订单',
            data: arr.submit_num,
            type: 'line',
            areaStyle: {
              color: {
                type: 'linear',
                x: 0,
                x2: 0,
                y: 0,
                y2: 1,
                colorStops: [{
                  offset: 0, color: 'rgba(169,129,255,0.3)'
                }, {
                  offset: 1, color: 'rgba(169,129,255,0.3)'
                }],
                globalCoord: false
              }
            },
            itemStyle: {
              normal: {
                color: 'rgba(169,129,255,1)',
                borderWidth: 1,
                // borderColor: '#fff',
                // shadowColor: 'rgba(73,133,252,1)',
                // shadowOffsetY: 0,
                // shadowOffsetX: 0,
                // shadowBlur: 10,
                lineStyle: {
                  color: 'rgba(169,129,255,1)',
                  width: 3
                }
              }
            }
          }, {
            name: '支付订单',
            data: arr.pay_num,
            type: 'line',
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
                // borderColor: '#fff',
                // shadowColor: 'rgba(73,133,252,1)',
                // shadowOffsetY: 0,
                // shadowOffsetX: 0,
                // shadowBlur: 10,
                lineStyle: {
                  color: 'rgba(73,133,252,1)',
                  width: 3
                }
              }
            }
          }, {
            name: '退款订单',
            data: arr.refund_num,
            type: 'line',
            areaStyle: {
              color: {
                type: 'linear',
                x: 0,
                x2: 0,
                y: 0,
                y2: 1,
                colorStops: [{
                  offset: 0, color: 'rgba(104,212,165,0.28)'
                }, {
                  offset: 1, color: 'rgba(104,212,165,0.28)'
                }],
                globalCoord: false
              }
            },
            itemStyle: {
              normal: {
                color: 'rgba(79,209,102,1)',
                borderWidth: 1,
                // borderColor: '#fff',
                // shadowColor: 'rgba(73,133,252,1)',
                // shadowOffsetY: 0,
                // shadowOffsetX: 0,
                // shadowBlur: 10,
                lineStyle: {
                  color: 'rgba(79,209,102,1)',
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
    border-radius: 6px
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
        box-shadow: 0 1px 3px 0 rgba(0, 8, 39, 0.10)
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
      width: 100%
      layout(row)
      justify-content: space-between
      .data-item
        width: 23.7%
        height: 180px
        text-align: left
        .item-box
          height: 180px
          background: $color-white
          box-shadow: 0 1px 3px 0 rgba(0, 8, 39, 0.10)
          border-radius: 6px
          width: 100%
          padding: 30px
          .item-title
            layout(row)
            align-items: center
            margin-bottom: 12px
            .data-icon
              position: relative
              margin-left: 4px
              height: 14px
              width: 14px
              icon-image('icon-help')
              .data-show-tip
                position: absolute
                bottom: -48px
                left: -87px
                font-size: $font-size-medium14
                color: $color-white
                font-family: $fontFamilyRegular
                height: 42px
                line-height: 42px
                width: 278px
                text-align: center
                border-radius: 4px
                background: rgba(50, 50, 58, .8)
                &.fade-enter, &.fade-leave-to
                  opacity: 0
                &.fade-enter-to, &.fade-leave-to
                  transition: all .3s ease-in-out
                &:after
                  content: ''
                  position: absolute
                  top: -8px
                  left: 90px
                  border: 4px solid rgba(50, 50, 58, .8)
                  border-top: 4px solid transparent
                  border-left: 4px solid transparent
                  border-right: 4px solid transparent
            .icon
              width: 18px
              height: 18px
              margin-right: 10px
              background-size: 18px
              &.shop
                bg-image(icon-shop)
              &.amount
                bg-image(icon-amount)
              &.order
                bg-image(icon-ordercount)
              &.user
                bg-image(icon-newuser)
            .text
              font-family: $fontFamilyRegular
              font-size: $font-size-medium14
              color: $color-text33
          .big-munber
            font-family: $fontFamilyMeddle
            font-size: 30px
            margin: 31px 0
            color: $color-text33
            text-align: center
          .all-text
            font-family: $fontFamilyRegular
            font-size: $font-size-small12
            color: $color-text99
            display: flex
            justify-content: space-between
          .all-number
            font-family: $fontFamilyMeddle
            font-size: $font-size-large18
            color: $color-text-66
            padding-left: 80px

  .data-center
    display: flex
    justify-content: space-between
    .data-center-item
      width: 49.2%
      background: $color-white
      height: 427px
      box-sizing: border-box
      border-radius: 6px
      display: flex
      margin-bottom: 25px
      flex-direction: column
      box-shadow: 0 1px 6px 0 rgba(0, 8, 39, 0.10)
      .data-center-item-top
        height: 58px
        padding: 0 150px 0 15px
        box-sizing: border-box
        display: flex
        align-items: center
        justify-content: space-between
        border-bottom-1px($color-line-E1)
        .data-center-name
          color: $color-text33
          font-family: $fontFamilyRegular
          font-size: $font-size-large18
      .customer-box
        #customer, #openShop, #echartLine, #myLine
          height: 367px
          width: 100%

  .data-bottom
    background: $color-white
    box-shadow: 0 1px 3px 0 rgba(0, 8, 39, 0.10)
    border-radius: 6px
    flex: 1
    min-height: 300px
    flex-direction: column
    display: flex
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
      flex: 1
      width: 100%
      position: relative
      #echartLine
        width: 100%
        height: 100%

  .z
    width: 1px
</style>
