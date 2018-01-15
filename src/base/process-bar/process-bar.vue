<template>
  <div class="progress-bar"
       ref="progressBar">
    <div class="bar-inner">
      <div class="progress"
           :style="{width:processWidth + 'px'}"
           ref="progress">
        <div class="progress-btn-wrapper"
             ref="progressBtn">
          <div class="progress-btn"></div>
        </div>
      </div>

    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    data () {
      return {
        processWidth: 0
      }
    },
    props: {
      percent: {
        type: Number,
        default: 0
      }
    },
    computed: {
    },
    watch: {
      percent (newPercent) {
        if (newPercent >= 0) {
          this.processWidth = (this.$refs.progressBar.clientWidth * newPercent)
        }
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '~common/stylus/variable'
  .progress-bar
    height: 30px
    .bar-inner
      position: relative
      top: 13px
      height: 4px
      border-radius: 2px
      background: rgba(0, 0, 0, 0.3)
      .progress
        position: absolute
        height: 100%
        border-radius: 2px
        background: $color-theme
      .progress-btn-wrapper
        position: absolute
        right: -15px
        top: -13px
        width: 30px
        height: 30px
        opacity: 1
        .progress-btn
          position: relative
          top: 7px
          left: 7px
          box-sizing: border-box
          width: 16px
          height: 16px
          border: 5px solid $color-text
          border-radius: 50%
          background: $color-theme
</style>