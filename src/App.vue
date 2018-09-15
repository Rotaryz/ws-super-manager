<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script type="text/ecmascript-6">
  import {mapActions} from 'vuex'

  export default {
    name: 'App',
    created() {
    },
    methods: {
      ...mapActions(['setTitleArr'])
    },
    watch: {
      '$route'(to) {
        let title = to.meta.title
        if (!title) {
          return
        }
        let titleArr = title.split(',')
        this.setTitleArr(titleArr)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  #app
    width: 100vw
    height: 100vh
    box-sizing: border-box
    /*min-width: 1513px*/
    overflow: hidden
    font-family: PingFangSC-Regular, 'Avenir', Helvetica, Arial, sans-serif
    -webkit-font-smoothing: antialiased
    -moz-osx-font-smoothing: grayscale
    text-align: center
    color: #2c3e50

</style>
