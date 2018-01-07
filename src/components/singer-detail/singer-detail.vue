<template>
  <transition name="slide">
    <div class="singer-detail"></div>
  </transition>
</template>

<script>
  export default {}
</script>

<style lang="stylus">
  @import "~common/stylus/variable"

  .singer-detail
    position: fixed
    left: 0
    top: 0
    right: 0
    bottom: 0
    z-index: 100
    background: $color-background

  .slide-enter-active, .slide-leave-active
    transition: all 0.3s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>