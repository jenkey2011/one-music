<template>
  <div class="progress-bar"
       ref="progressBar">
    <div class="bar-inner">
      <div class="progress"
           :style="{width:processWidth + 'px'}"
           ref="progress">
        <div class="progress-btn-wrapper"
             @touchstart.stop="progressStart"
             @touchmove.stop="progressMove"
             @touchend.stop="progressEnd"
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
        processWidth: 0,
        progressTouch: {}
      }
    },
    props: {
      percent: {
        type: Number,
        default: 0
      }
    },
    methods: {
      progressStart (e) {
        this.progressTouch.start = true
        this.progressTouch.initX = e.touches[0].pageX
        this.progressTouch.initWidth = this.processWidth
      },
      progressMove (e) {
        let nowX = e.touches[0].pageX
        this.progressTouch.deltX = nowX - this.progressTouch.initX
        this.processWidth = this.progressTouch.initWidth + this.progressTouch.deltX
        let newPercent = this.processWidth / this.$refs.progressBar.clientWidth
        this.$emit('progressChange', newPercent)
      },
      progressEnd (e) {
        this.progressTouch.start = false
        this.$emit('progressChangeEnd', false)
        // this.processWidth += this.progressTouch.deltX
      }
    },
    computed: {
    },
    watch: {
      percent (newPercent) {
        if (newPercent >= 0 && !this.progressTouch.start) {
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