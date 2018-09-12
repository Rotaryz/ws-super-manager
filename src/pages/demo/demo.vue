<template>
  <div class="demo">
    <!--<DateSelect></DateSelect>-->
    <!--<AdminSelect></AdminSelect>-->
    <!--<Search></Search>-->
    <!--<div class="excel">导出excel</div>-->
    <!--<PageDetail></PageDetail>-->
  </div>
</template>

<script>
  import Search from 'components/search/search' // 搜索框
  import AdminSelect from 'components/admin-select/admin-select' // 下拉框
  import DateSelect from 'components/date-select/date-select' // 下拉框
  import PageDetail from 'components/page-detail/page-detail' // 下拉框

  export default {
    name: 'demo',
    components: {
      Search,
      AdminSelect,
      DateSelect,
      PageDetail
    },
    mounted() {
      // this.$emit('showShade')
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import '~common/stylus/mixin'
  .demo
    display: flex
</style>
