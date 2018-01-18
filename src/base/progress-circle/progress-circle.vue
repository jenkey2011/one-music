<template>
  <div>
    <svg width="10"
         height="10"
         viewbox="0 0 100 100"
         version="1.1"
         xmlns="http://www.w3.org/2000/svg">
      <circle class="background-circle"
              cx="50"
              cy="50"
              r="50"
              stroke-width="5"
              :stroke="backgroundStrokeColor"
              fill="none"></circle>
      <circle class="progress-circle"
              cx="50"
              cy="50"
              r="50"
              stroke-width="5"
              :stroke="progressStrokeColor"
              fill="none"
              :stroke-dasharray="dashArray"></circle>
    </svg>
    <slot></slot>
  </div>
</template>
<script>
  export default {
    props: {
      backgroundStrokeColor: {
        type: String,
        default: 'rgba(255, 205, 49, 0.5)'
      },
      progressStrokeColor: {
        type: String,
        default: '#ffcd32'
      },
      progress: {
        type: Number,
        default: 0
      },
      newStyle: {
        type: String,
        default: ''
      }
    },
    computed: {
      dashArray () {
        return 60
      }
    }
  }
</script>
<style scoped lang="stylus">
  @import '~common/stylus/variable'
  svg
    transform: scale(0.9)
</style>
