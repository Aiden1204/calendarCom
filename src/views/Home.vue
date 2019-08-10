<template>
  <div class="all">
    <calendar :weekSortMark="flag"></calendar>
  </div>
</template>

<script>
// @ is an alias to /src
import calendar from '@/components/calendar.vue'

export default {
  name: 'home',
  components: {
    calendar
  },
  data(){
    return {
      flag:"日"
    }
  }
}
</script>
<style scoped lang="less">
  .all {
  }
</style>
