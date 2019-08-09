<template>
  <div class="all">
    <calendar></calendar>
  </div>
</template>

<script>
// @ is an alias to /src
import calendar from '@/components/calendar.vue'

export default {
  name: 'home',
  components: {
    calendar
  }
}
</script>
<style scoped lang="less">
  .all {
  }
</style>
