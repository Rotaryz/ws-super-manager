<template>
  <div class="total">
    <div>每页{{pageDtail.per_page}}条，共{{pageDtail.total}}条数据</div>
    <div class="page">
      <div class="page-icon" @click="subtract" :style="{'cursor': isHand.handLeft}" @mouseenter="notAllowed">
      </div>
      <div class="pade-detail">{{page}}/{{pageDtail.total_page}}</div>
      <div class="page-icon page-icon-two" @click="addPage" @mouseenter="notAllowed" :style="{'cursor': isHand.handRight}">
      </div>
      <div class="page-box" :class="{'input-height': pageDetail}">
        <div class="border-page page-total input-height-item" @click.stop="showPageDetail">
          {{page}}/{{pageDtail.total_page}}
          <span class="page-tap">
                <i class="page-top" :class="{'page-bottom':pageDetail}"></i>
              </span>
          <transition name="fade">
            <ul class="page-list" v-show="pageDetail">
              <li class="page-item"
                  v-for="item in pageDtail.total_page"
                  :key="item"
                  :class="{'page-item-active': pageIndex === item}"
                  @click.stop="detailPage(item)">
                {{item}}/{{pageDtail.total_page}}
              </li>
            </ul>
          </transition>
        </div>
      </div>
      <div class="input-box">
        <input type="number" class="border-page input-height-item" v-model="pageInput" />
      </div>
      <div class="border-page input-height-item" @click="goPage" @mouseenter="notAllowed" :style="{'cursor': isHand.handGo}">跳转</div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'page-detail',
    props: {
      pageDtail: {
        type: Object,
        default: () => {
          return {
            total: 1, // 总数量
            per_page: 10, // 一页条数
            total_page: 0 // 总页数
          }
        }
      }
    },
    data() {
      return {
        pageDetail: false,
        pageInput: '',
        isHand: {handLeft: 'pointer', handRight: 'pointer', handGo: 'pointer'},
        pageIndex: 0,
        page: 1
      }
    },
    created() {
      window.onkeydown = (e) => {
        if (e.keyCode === 13) {
          if (this.pageInput !== '') {
            if (this.pageInput > this.pageDtail.total_page) {
              this.pageInput = this.pageDtail.total_page
            } else if (this.pageInput * 1 <= 0) {
              this.pageInput = 1
            }
            this.pageInput = Math.floor(this.pageInput * 1)
            this.page = this.pageInput
            this.$emit('addPage', this.page)
          }
        }
      }
      window.onclick = () => {
        this.hidePageDetail()
      }
    },
    methods: {
      subtract() {
        if (this.page > 1) {
          this.page--
          this.$emit('addPage', this.page)
        }
        this.notAllowed()
      },
      notAllowed() {
        this.page === 1 ? this.isHand.handLeft = 'not-allowed' : this.isHand.handLeft = 'pointer'
        this.page === this.pageDtail.total_page ? this.isHand.handRight = 'not-allowed' : this.isHand.handRight = 'pointer'
        this.pageInput === '' ? this.isHand.handGo = 'not-allowed' : this.isHand.handGo = 'pointer'
      },
      addPage() {
        if (this.page < this.pageDtail.total_page) {
          this.page++
          this.$emit('addPage', this.page)
        }
      },
      showPageDetail() {
        this.pageDetail = !this.pageDetail
      },
      detailPage(page) {
        this.page = page
        this.pageIndex = page
        setTimeout(() => {
          this.hidePageDetail()
        }, 100)
        this.$emit('addPage', this.page)
      },
      hidePageDetail() {
        this.pageDetail = false
        this.focus = false
      },
      goPage() {
        if (this.pageInput !== '') {
          this.pageInput = Math.floor(this.pageInput * 1)
          if (this.pageInput > this.pageDtail.total_page) {
            this.pageInput = this.pageDtail.total_page
          } else if (this.pageInput * 1 <= 0) {
            this.pageInput = 1
          }
          this.page = this.pageInput
          this.$emit('addPage', this.page)
        }
      },
      beginPage(page = 1) {
        this.pageInput = ''
        this.page = page
      }
    }
  }
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import '~common/stylus/mixin'
  .total
    width: 100%
    height: 100%
    display: flex
    align-items: center
    justify-content: space-between
    color: $color-text33
    font-size: $font-size-medium14
    .page
      display: flex
      align-items: center
      .pade-detail
        margin-right: 10px
      .page-icon
        cursor: pointer
        icon-image('icon-before')
        margin-right: 10px
        height: 25px
        width: 25px
        &:hover
          icon-image('icon-before_hover')
      .page-icon-two
        icon-image('icon-later')
        &:hover
          icon-image('icon-later_hover')
      .border-page
        display: flex
        line-height: 25px
        border-radius: 3px
        margin-right: 10px
        border: 1px solid $color-lineCC
        font-size: $font-size-medium
      div.border-page
        margin-right: 0
        padding: 0 15px
        height: 25px
        line-height: 25px
        cursor: pointer
      div.page-total
        cursor: pointer
        padding-right: 33px
        position: relative
        .page-tap
          position: absolute
          right: 0
          top: 0
          height: 23px
          display: inline-block
          width: 18px
          border-left: 1px solid $color-lineCC
          .page-top
            row-center()
            top: 44%
            display: inline-block
            height: 0
            border: 5px solid $color-text33
            border-bottom: 5px solid transparent
            border-left: 5px solid transparent
            border-right: 5px solid transparent
            transform-origin: 0.5px 2px
            transform: rotate(0deg) translateX(-43%)
            transition: all 0.2s
          .page-bottom
            display: inline-block
            height: 0
            transform-origin: 0.5px 2px
            transform: rotate(180deg) translateX(-43%)
            transition: all 0.2s
        .page-list
          position: absolute
          width: 100%
          left: 0
          box-shadow: 0 1px 5px 0 rgba(12, 6, 14, 0.20)
          text-align: center
          background: $color-white
          border-radius: 3px
          bottom: 30px
          font-size: $font-size-medium
          color: $color-text-66
          max-height: 290px
          overflow-y: auto
          &.fade-enter, &.fade-leave-to
            opacity: 0
          &.fade-enter-to, &.fade-leave-to
            transition: all .2s ease-in-out
          .page-item
            cursor: pointer
            height: 29px
            line-height: 29px
            &:hover
              background: $color-big-background
          .page-item-active
            background: $color-big-background
      input.border-page
        height: 25px
        width: 39px
        text-align: center
      .input-box
        border: 2px solid $color-white
        height: 29px
        width: 43px
        margin-right: 10px
      .page-box
        border: 2px solid $color-white
        height: 29px
        margin-right: 10px
</style>
