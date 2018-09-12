<template>
  <div class="home" @click="hideRole">
    <navigation ref="nav"></navigation>
    <div class="content">
      <base-model ref="baseModel">
        <div slot="content" class="content-box">
          <router-view ref="mina" @showToast="showToast" @showShade="showShade" @hideShade="hideShade" @showImage="showImage"></router-view>
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
    created() {
    },
    methods: {
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
      overflow: hidden
      flex: 1
      overflow: hidden
</style>
