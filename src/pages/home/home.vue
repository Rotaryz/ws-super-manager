<template>
  <div class="home" @click="hideRole">
    <navigation ref="nav"></navigation>
    <div class="content">
      <base-model ref="baseModel" :showTag="showTag" :showNull="showNull">
        <div slot="content" class="content-box">
          <router-view ref="mina" @setNull="setNull" @showToast="showToast" @showShade="showShade"
                       @hideShade="hideShade" @showImage="showImage" @setTab="setTab"></router-view>
        </div>
      </base-model>
      <!--<router-view @showChild="showChild"/>-->
    </div>
  </div>
</template>

<script>
  // import { ERR_OK } from 'api/config'
  import Navigation from 'components/navigation/navigation'
  import BaseModel from 'components/base-model/base-model'

  export default {
    name: 'home',
    data() {
      return {
        showTag: true,
        showNull: false
      }
    },
    methods: {
      // 是否显示标题
      setTab(status) {
        this.showTag = status
      },
      // 是否显示空白页
      setNull(status = false) {
        this.showNull = status
      },
      hideRole() {
        this.$refs.nav.hideRole()
      },
      showChild(index) {
        this.$refs.nav.showChild(index)
      },
      showToast(content, time = 1000) {
        this.$refs.baseModel.showContent(content, time)
      },
      showShade(del, text, title) {
        this.del = del
        this.text = text || ''
        this.title = title || ''
        this.$refs.baseModel.showShade()
      },
      hideShade() {
        this.$refs.baseModel.hideShade()
      },
      showImage(img) {
        this.$refs.baseModel.showImage(img)
      }
    },
    components: {
      Navigation,
      BaseModel
    },
    watch: {
      '$route'(to) {
        this.setNull(false)
        this.hideShade(false)
      }
    }
  }
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import '~common/stylus/mixin'
  .home
    width: 100%
    display: flex
    height: 100vh
    .content
      overflow-y: auto
      flex: 1

  .content-box
    display: flex
    flex: 1

</style>
