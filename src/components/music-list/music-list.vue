<template>
  <div class="music-list">
    <div class="back"
         @click="back">
      <i class="icon-back"></i>
    </div>
    <h1 class="title"
        v-html="title"></h1>
    <div class="bg-image"
         :style="{backgroundImage: bgStyle, paddingTop: bgPaddingTop, zIndex: bgZIndex, transform: bgTransform, filter: bgFilter }"
         ref="bgImage">
      <div class="play-wrapper"
           v-show="!bgZIndex">
        <div class="play">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <div class="filter"
           ref="filter"></div>
    </div>
    <div class="bg-layer"
         ref="layer"
         :style="{ transform: layerTransform }"></div>
    <scroll @scroll="scroll"
            :listen-scroll="listenScroll"
            :probe-type="probeType"
            :data="songs"
            class="list"
            ref="list">
      <div class="song-list-wrapper">
        <song-list @select="selectItem"
                   :songs="songs"></song-list>
      </div>
      <div class="loading-container"
           v-show="!songs.length">
        <loading></loading>
      </div>
    </scroll>
  </div>
</template>

<script type="text/ecmascript-6">
  import Loading from 'base/loading/loading'
  import Scroll from 'base/scroll/scroll'
  import SongList from 'base/song-list/song-list'
  import { mapActions } from 'vuex'

  const BAR_HEIGHT = 40

  export default {
    props: {
      bgImage: {
        type: String,
        default: ''
      },
      songs: {
        type: Array,
        default: []
      },
      title: {
        type: String,
        default: ''
      },
      rank: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        scrollY: 0,
        layerTransform: '',
        bgPaddingTop: '',
        bgZIndex: 0,
        bgTransform: '',
        bgFilter: ''
      }
    },
    created () {
      this.probeType = 3
      this.listenScroll = true
    },
    methods: {
      scroll (pos) {
        this.scrollY = pos.y
      },
      back () {
        this.$router.back()
      },
      selectItem (item, index) {
        this.selectPlay({
          list: this.songs,
          index
        })
      },
      ...mapActions([
        'selectPlay'
      ])
    },
    watch: {
      scrollY (newY) {
        let translateY = Math.max(this.minTranslateY, newY)
        let scale = 1
        let blur = 0
        this.layerTransform = `translate3d(0, ${translateY}px, 0)`
        let percent = Math.abs(newY / this.imgHeight)
        if (newY < this.minTranslateY) {
          this.bgZIndex = 10
          this.bgPaddingTop = `${BAR_HEIGHT}px`
        } else {
          this.bgZIndex = 0
          this.bgPaddingTop = `70%`
        }
        if (newY > 0) {
          scale = 1 + percent
          this.bgZIndex = 10
        } else {
          blur = Math.min(5 * percent, 2)
        }
        this.bgTransform = `scale(${scale})`
        this.bgFilter = `blur(${blur}px)`
      }
    },
    computed: {
      bgStyle () {
        return `url(${this.bgImage})`
      }
    },
    components: {
      SongList,
      Scroll,
      Loading
    },
    mounted () {
      this.imgHeight = this.$refs.bgImage.clientHeight
      this.minTranslateY = BAR_HEIGHT - this.imgHeight
      this.$refs.list.$el.style.top = `${this.imgHeight}px`
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '~common/stylus/variable'
  @import '~common/stylus/mixin'
  .music-list
    position: fixed
    z-index: 100
    top: 0
    left: 0
    bottom: 0
    right: 0
    background: $color-background
    .back
      position: absolute
      top: 0
      left: 6px
      z-index: 50
      .icon-back
        display: block
        padding: 10px
        font-size: $font-size-large-x
        color: $color-theme
    .title
      position: absolute
      top: 0
      left: 10%
      z-index: 40
      width: 80%
      no-wrap()
      text-align: center
      line-height: 40px
      font-size: $font-size-large
      color: $color-text
    .bg-image
      position: relative
      width: 100%
      height: 0
      padding-top: 70%
      transform-origin: top
      background-size: cover
      .play-wrapper
        position: absolute
        bottom: 20px
        z-index: 50
        width: 100%
        .play
          box-sizing: border-box
          width: 135px
          padding: 7px 0
          margin: 0 auto
          text-align: center
          border: 1px solid $color-theme
          color: $color-theme
          border-radius: 100px
          font-size: 0
          .icon-play
            display: inline-block
            vertical-align: middle
            margin-right: 6px
            font-size: $font-size-medium-x
          .text
            display: inline-block
            vertical-align: middle
            font-size: $font-size-small
      .filter
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
        background: rgba(7, 17, 27, 0.4)
    .bg-layer
      position: relative
      height: 100%
      background: $color-background
    .list
      position: fixed
      top: 0
      bottom: 0
      width: 100%
      background: $color-background
      .song-list-wrapper
        padding: 20px 30px
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>