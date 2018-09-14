<template>
  <div class="navigation">
    <div class="big-show" :class="{'big-hide': showAnimation}">
      <div class="herder" @click.stop>
        <img src="./pic-logo@2x.png" class="icon">
        <p class="header-name hand" @click="_checkRole">{{roleName}}</p>
      </div>
      <ul class="nav-big">
        <li class="nav-item" v-for="(item , index) in navList" :key="index" @click="showChild(index)" :style="{'height':item.showHeight+'px'}">
          <router-link :to="{path: item.url}" v-if="item.children.length === 1" class="nav-tap" :class="{'nav-tap-active':bigChild === index,'nav-item-no-border':item.children.length > 1}">
            <span class="nav-icon"><img :src="item.icon" class="nav-pic"></span>
            <div class="nav-title" v-show="!showAnimation">
              <span>{{item.title}}</span>
            </div>
            <i class="nav" :class="{'nav-active': item.showHeight !== 58}" v-show="!showAnimation"></i>
          </router-link>
          <div v-if="item.children.length > 1" class="nav-tap" :class="{'nav-tap-active':bigChild === index,'nav-item-no-border':item.children.length > 1}">
            <span class="nav-icon"><img :src="item.icon" class="nav-pic"></span>
            <div class="nav-title" v-show="!showAnimation">
              <span>{{item.title}}</span>
            </div>
            <i class="nav" :class="{'nav-active': item.showHeight !== 58}" v-show="!showAnimation"></i>
          </div>
          <ul class="nav-big-child" v-if="item.children">
            <li class="nav-item" v-for="(items , idx) in item.children" :key="idx" @click.stop="bigChildren(idx)">
              <router-link :to="{path: items.url}" class="nav-tap-small">
                <span class="nav-icon"><img src=""></span>
                <div class="nav-title">
                  <span v-for="(child , index) in items.title" :key="index">{{child}}</span>
                </div>
              </router-link>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  const HEIGHT = 69
  const SMALLHEIGHT = 58
  const NAVLIST = [
    {
      title: '数据概况',
      url: '/data-overview',
      icon: require('./icon-data@2x.png'),
      childrenIndex: -1,
      children: [{
        title: '数据概况',
        url: '/data-overview'
      }],
      showHeight: HEIGHT
    }, {
      title: '商家管理',
      url: '/member-list',
      icon: require('./icon-shop_select@2x.png'),
      childrenIndex: -1,
      children: [{
        title: '团队列表',
        url: '/member-list'
      }, {
        title: '商家列表',
        url: '/business-list'
      }],
      showHeight: HEIGHT
    }, {
      title: '客户管理',
      url: '/agent-order',
      icon: require('./icon-client_select@2x.png'),
      childrenIndex: -1,
      children: [{
        title: '消费客户',
        url: '/agent-order'
      }, {
        title: '潜在客户',
        url: '/retail-order'
      }],
      showHeight: HEIGHT
    }, {
      title: '商品管理',
      icon: require('./icon-goods_select@2x.png'),
      url: '/commodity',
      childrenIndex: -1,
      children: [{
        title: '商品管理',
        url: '/commodity'
      }],
      showHeight: HEIGHT
    }, {
      title: '活动管理',
      icon: require('./icon-activity_select@2x.png'),
      url: '/activity',
      childrenIndex: -1,
      children: [{
        title: '活动管理',
        url: '/activity'
      }],
      showHeight: HEIGHT
    }, {
      title: '订单管理',
      icon: require('./icon-order_select@2x.png'),
      url: '/goods-order',
      childrenIndex: -1,
      children: [{
        title: '商品订单',
        url: '/goods-order'
      }, {
        title: '开通门店',
        url: '/open-order'
      }],
      showHeight: HEIGHT
    }, {
      title: '财务管理',
      icon: require('./icon-money_select@2x.png'),
      url: '/exchange',
      childrenIndex: -1,
      children: [{
        title: '交易记录',
        url: '/exchange'
      }, {
        title: '提现申请',
        url: '/withdraw'
      }],
      showHeight: HEIGHT
    }
  ]
  export default {
    data() {
      return {
        smallIndex: 0,
        navList: NAVLIST,
        bigChild: 1,
        showHeight: HEIGHT,
        timer: null,
        recodIndex: -1,
        showAnimation: false,
        sortTimer: null,
        showRole: false,
        loginRole: 0,
        roleName: '商家管理平台'
      }
    },
    created() {
      let path = this.$route.fullPath
      path = path.split('?')
      this.info(path[0])
    },
    methods: {
      hideRole() {
        this.showRole = false
      },
      _checkRole() {
        this.showRole = !this.showRole
      },
      info(path) {
        let type = path
        this.navList.forEach((item, idx) => {
          if (item.children.length > 1) {
            item.children.forEach((items, index) => {
              if (items.url.includes(type)) {
                this.navList[idx].childrenIndex = index
                this.showChild(idx, false, false)
                this.bigChildren(index)
              } else {
                item.showHeight = HEIGHT
              }
            })
          } else {
            if (item.url.includes(type)) {
              this.showChild(idx)
              sessionStorage.setItem('title', [item.title])
            }
          }
        })
      },
      showChild(index, status = true, go = true) {
        this.smallIndex = index
        clearInterval(this.timer)
        if (this.navList[index].children.length === 1) {
          if (this.recodIndex !== -1) {
            this.timer = setInterval(() => {
              if (this.navList[this.recodIndex].showHeight <= HEIGHT) {
                this.navList[this.recodIndex].showHeight = HEIGHT
                clearInterval(this.timer)
                return false
              }
              this.navList[this.recodIndex].showHeight -= 20
            }, 30)
          }
          this.bigChild = index
        } else if (this.navList[index].children.length > 1) {
          clearInterval(this.timer)
          let childCode = this.navList[index].childrenIndex === -1 ? 0 : this.navList[index].childrenIndex
          if (go) {
            this.navList[index].url = this.navList[index].children[childCode].url
            this.$router.push(this.navList[index].url)
          }
          this.recodIndex = index
          this.navList[this.recodIndex].childrenIndex = childCode
          this.bigChild = -1
          clearInterval(this.timer)
          for (let i = 0; i < this.navList.length; i++) {
            if (i !== index && this.navList[i].showHeight > HEIGHT) {
              clearInterval(this.sortTimer)
              this.sortTimer = setInterval(() => {
                if (this.navList[i].showHeight <= HEIGHT) {
                  this.navList[i].showHeight = HEIGHT
                  clearInterval(this.sortTimer)
                  return
                }
                this.navList[i].showHeight -= 20
              }, 30)
            } else {
              clearInterval(this.timer)
              let num = index === 0 ? 1 : this.navList[index].children.length
              if (this.navList[index].showHeight === HEIGHT) {
                let target = num * SMALLHEIGHT + HEIGHT
                this.timer = setInterval(() => {
                  if (this.navList[index].showHeight >= target) {
                    this.navList[index].showHeight = target
                    clearInterval(this.timer)
                    return
                  }
                  this.navList[index].showHeight += 20
                }, 30)
              } else {
                if (status) {
                  this.timer = setInterval(() => {
                    if (this.navList[index].showHeight <= HEIGHT) {
                      this.navList[index].showHeight = HEIGHT
                      clearInterval(this.timer)
                      return
                    }
                    this.navList[index].showHeight -= 20
                  }, 30)
                }
              }
            }
          }
        }
      },
      bigChildren(index) {
        this.navList[this.recodIndex].childrenIndex = index
        let num = this.recodIndex
        this.navList[num].url = this.navList[num].children[this.navList[num].childrenIndex].url
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import '~common/stylus/mixin'
  .navigation
    background: $color-menu-background
    float: left
    color: $color-white
    height: 100vh
    position: relative
    z-index: 1000
    white-space: nowrap
    .big-show
      width: 200px
      .herder
        font-size: $font-size-large20
        height: 80px
        position: relative
        display: flex
        align-items: center
        justify-content: center
        box-sizing: border-box
        color: $color-white
        font-family: PingFangSC-Semibold
        border-bottom: 1px solid #3B3B43
        .icon
          margin-right: 4.4px
          overflow: hidden
          height: 24px
      .nav-big
        .nav-item
          overflow: hidden
          border-bottom: 1px solid #3B3B43
          .nav-tap
            height: 58px
            margin: 5.5px 0
            transition: all 0.2s
            align-items: center
            color: $color-white
            display: flex
            width: 100%
            position: relative
            box-sizing: border-box
            border-left: 6px solid $color-menu-background
            .nav-icon
              height: 100%
              width: 55px
              position: relative
              .nav-pic
                height: 19px
                col-center()
                left: 28px
            .nav-title
              width: 64px
              display: flex
              font-family: 'PingFangSC-Light'
              font-size: $font-size-medium16
              justify-content: space-between
            .nav
              col-center()
              height: 10px
              width: 10px
              right: 23px
              icon-image('icon-arrow_right')
              transform-origin: 50% 0%
              transform: rotate(0deg) translateY(-50%)
              transition: transform 0.2s
            .nav-active
              transform-origin: 50% 0%
              transform: rotate(90deg) translateY(-50%)
              transition: transform 0.2s
            &:hover
              background: rgba(255, 255, 255, 0.1)
              border-color: transparent
              transition: all 0.2s
          .router-link-active
            background: rgba(255, 255, 255, .1)
            border-left: 6px solid $color-4985FC !important
        .nav-big-child
          .nav-item
            height: 58px
            border-bottom: none
            display: flex
            .nav-tap-small
              width: 100%
              height: 58px
              display: flex
              align-items: center
              border-left: 6px solid $color-menu-background
              &:hover
                background: rgba(255, 255, 255, 0.1)
                border-color: transparent
                transition: all 0.2s
              .nav-icon
                width: 46px
            .router-link-active
              background: rgba(255, 255, 255, 0.1)
              border-left: 6px solid $color-4985FC !important
          .nav-title
            color: $color-white

      .big-hide
        width: 79px
        transition: all .2s

</style>
