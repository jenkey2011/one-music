<template>
  <div class="player"
       ref="player"
       v-show="playlist.length>0">
    <transition name="normal">
      <div class="normal-player"
           v-show="fullScreen">
        <div class="background">
          <img width="100%"
               height="100%"
               :src="currentSong.image">
        </div>
        <div class="top">
          <div class="back"
               @click="back">
            <i class="icon-back"></i>
          </div>
          <h1 class="title"
              v-html="currentSong.name"></h1>
          <h2 class="subtitle"
              v-html="currentSong.singer"></h2>
        </div>
        <div class="middle"
             @touchstart.stop="lyricStart"
             @touchmove.stop="lyricMove"
             @touchend.stop="lyricEnd">
          <div class="middle-l"
               :style="{opacity:opacity}"
               ref="middleL">
            <div class="cd-wrapper"
                 ref="cdWrapper">
              <div class="cd"
                   :class="cdCls">
                <img class="image"
                     :src="currentSong.image">
              </div>
            </div>
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric">{{lineNode[lineIndex-1]}}</div>
              <div class="playing-lyric active">{{lineNode[lineIndex]}}</div>
              <div class="playing-lyric">{{lineNode[lineIndex+1]}}</div>
            </div>
          </div>

          <scroll class="middle-r"
                  :class="{show:lyricShow,transition:isTranstion}"
                  ref="lyricList"
                  :style="{transform:transformLyricX}">
            <div class="lyric-wrapper">
              <div>
                <p ref="lyricLine"
                   class="text"
                   v-for="(line,index) in lineNode"
                   :key="index"
                   :class="{'current': index === lineIndex}">{{line}}</p>
              </div>
            </div>
          </scroll>

        </div>
        <div class="bottom">
          <div class="dot-wrapper">
            <span class="dot"
                  :class="{'active':!lyricShow}"></span>
            <span class="dot"
                  :class="{'active':lyricShow}"></span>
          </div>
          <div class="progress-wrapper">
            <span class="time time-l">{{format(currentTime)}}</span>
            <div class="progress-bar-wrapper">
              <progress-bar :percent="percent"
                            @progressChange="progressChange"
                            @progressChangeEnd="progressChangeEnd"></progress-bar>
            </div>
            <span class="time time-r">{{format(currentSong.duration)}}
            </span>
          </div>
          <div class="operators">
            <div class="icon i-left">
              <i class="icon-sequence"></i>
            </div>
            <div class="icon i-left"
                 :class="disableCls">
              <i class="icon-prev"
                 @click="prev"></i>
            </div>
            <div class="icon i-center"
                 :class="disableCls">
              <i :class="playIcon"
                 @click="togglePlayingState"></i>
            </div>
            <div class="icon i-right"
                 :class="disableCls">
              <i class="icon-next"
                 @click="next"></i>
            </div>
            <div class="icon i-right">
              <i class="icon icon-not-favorite"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="mini">
      <div class="mini-player"
           @click="open"
           v-show="!fullScreen">
        <div class="icon">
          <img width="40"
               height="40"
               :class="cdCls"
               :src="currentSong.image">
        </div>
        <div class="text">
          <h2 class="name"
              v-html="currentSong.name"></h2>
          <p class="desc"
             v-html="currentSong.singer"></p>
        </div>
        <div class="control">
          <i :class="miniIcon"
             @click.stop="togglePlayingState"></i>
        </div>
        <div class="control">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>

    <!-- <playlist ref="playlist"></playlist>
     -->
    <audio ref="audio"
           @canplay="ready"
           @error="error"
           @timeupdate="updateTime"
           @ended="end"
           :src="currentSong.url"></audio>
  </div>
</template>

<script>
  import { mapGetters, mapMutations } from 'vuex'
  import ProgressBar from 'base/progress-bar/progress-bar'
  import Scroll from 'base/scroll/scroll'

  export default {
    data () {
      return {
        songReady: false,
        currentTime: 0,
        percent: 0,
        newStyle: 'width:30px;height:30px;',
        timeNode: [],
        lineNode: [],
        lineIndex: 0,
        lyricShow: 0,
        lyricX: 0,
        lyricMoveData: {},
        width: 1,
        nowTranslateX: 0,
        isTranstion: 0,
        opacity: 1
      }
    },
    computed: {
      transformLyricX () {
        let percent = this.lyricX * 120 / this.lyricMoveData.wrapperWidth + this.nowTranslateX
        this.opacity = 1 - percent / -100
        this.translatePercent = Math.max(-100, percent)
        return `translateX(${this.translatePercent}%)`
      },
      cdCls () {
        return this.playing ? 'play' : 'play pause'
      },
      playIcon () {
        return this.playing ? 'icon-pause' : 'icon-play'
      },
      miniIcon () {
        return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
      },
      disableCls () {
        return this.songReady ? '' : 'disable'
      },
      ...mapGetters([
        'fullScreen',
        'playlist',
        'currentSong',
        'playing',
        'currentIndex'
      ])
    },
    methods: {
      updateTime (e) {
        this.currentTime = e.target.currentTime
        this.percent = this.currentTime / this.currentSong.duration
        this._getIndex(this.currentTime)
      },
      format (interval) {
        interval = interval | 0
        let minute = (interval / 60) | 0
        let second = interval % 60
        second = this._pad(second)
        return `${minute}:${second}`
      },
      progressChange (newPercent) {
        this.currentTime = this.currentSong.duration * newPercent
        this.$refs.audio.currentTime = this.currentTime
        this.$refs.audio.volume = 0
      },
      progressChangeEnd () {
        this.$refs.audio.volume = 1
        if (!this.playing) {
          this.togglePlayingState()
        }
      },
      _pad (num, n = 2) {
        let len = num.toString().length
        while (len < n) {
          num = '0' + num
          len++
        }
        return num
      },
      next () {
        if (!this.songReady) {
          return
        }
        let index = this.currentIndex + 1
        if (index === this.currentIndex.length) {
          index = 0
        }
        this.toggleSongs(index)
      },
      prev () {
        if (!this.songReady) {
          return
        }
        let index = this.currentIndex - 1
        if (index === -1) {
          index = this.currentIndex.length - 1
        }
        this.toggleSongs(index)
      },
      end () {
        this.next()
      },
      toggleSongs (index) {
        this.setCurrentIndex(index)
        if (!this.playing) {
          this.togglePlayingState()
        }
        this.songReady = false
      },
      ready () {
        this.songReady = true
      },
      error () { },

      back () {
        this.setFullScreen(false)
      },
      open () {
        this.setFullScreen(true)
      },
      togglePlayingState () {
        this.setPlayingState(!this.playing)
      },
      lyricStart (e) {
        this.lyricMoveData.intial = true
        this.lyricMoveData.intialX = e.touches[0].pageX
        this.lyricMoveData.wrapperWidth = this.$refs.player.clientWidth
        this.lyricShow = 0
        this.isTranstion = 0
      },
      lyricMove (e) {
        let nowX = e.touches[0].pageX
        this.lyricX = nowX - this.lyricMoveData.intialX
      },
      lyricEnd (e) {
        this.lyricMoveData.intial = false
        this.isTranstion = 1
        if (this.translatePercent <= -90) {
          this.lyricShow = 1
          this.nowTranslateX = this.translatePercent
        } else {
          console.log(9)
          this.lyricShow = 0
          this.nowTranslateX = 0
          this.lyricX = 0
        }

        // this.
      },
      ...mapMutations({
        setFullScreen: 'SET_FULL_SCREEN',
        setPlayingState: 'SET_PLAYING_STATE',
        setCurrentIndex: 'SET_CURRENT_INDEX'
      }),
      _getIndex (newTime) {
        let timeArray = this.timeNode
        for (let i = 0; i < timeArray.length; i++) {
          let prev = timeArray[i]
          let next = timeArray[i + 1]
          if (prev <= newTime && next >= newTime) {
            this.lineIndex = i
            return
          }
          if (!next && newTime > 10) {
            this.lineIndex = i
            return
          }
        }
      },
      _scrollToCurrentLine (index) {
        let lyrics = this.$refs.lyricLine
        let elementFirst = lyrics[0]
        if (index > 5) {
          let element = lyrics[index - 5]
          this.$refs.lyricList.scrollToElement(element, 500)
        } else {
          this.$refs.lyricList.scrollToElement(elementFirst, 500)
        }
      }
    },
    watch: {
      currentSong () {
        this.$nextTick(() => {
          this.$refs.audio.play()
          this.currentSong.getLyric().then(lyric => {
            this.timeNode = lyric.timeArr
            this.lineNode = lyric.lineArr
          })
        })
      },
      playing (newPlaying) {
        const audio = this.$refs.audio
        this.$nextTick(() => {
          newPlaying ? audio.play() : audio.pause()
        })
      },
      lineIndex (index) {
        this._scrollToCurrentLine(index)
      }
    },
    components: {
      ProgressBar,
      Scroll
    }
  }
</script>

<style scoped  lang="stylus" rel="stylesheet/stylus">
  @import '~common/stylus/variable'
  @import '~common/stylus/mixin'
  .player
    .normal-player
      position: fixed
      left: 0
      right: 0
      top: 0
      bottom: 0
      z-index: 150
      background: $color-background
      &.normal-enter-active, &.normal-leave-active
        transition: all 0.3s
        .top, .bottom, .middle
          transition: all 0.3s ease-in-out
      &.normal-enter, &.normal-leave-to
        opacity: 0
        .top
          transform: translate3d(0, -100px, 0)
        .bottom
          transform: translate3d(0, 100px, 0)
        .middle
          transform: scale(0)
      .background
        position: absolute
        left: 0
        top: 0
        width: 100%
        height: 100%
        z-index: -1
        opacity: 0.6
        filter: blur(20px)
      .top
        position: relative
        margin-bottom: 25px
        .back
          position: absolute
          top: 0
          left: 6px
          z-index: 50
          .icon-back
            display: block
            padding: 9px
            font-size: $font-size-large-x
            color: $color-theme
            transform: rotate(-90deg)
        .title
          width: 70%
          margin: 0 auto
          line-height: 40px
          text-align: center
          no-wrap()
          font-size: $font-size-large
          color: $color-text
        .subtitle
          line-height: 20px
          text-align: center
          font-size: $font-size-medium
          color: $color-text
      .middle
        position: fixed
        width: 100%
        top: 80px
        bottom: 170px
        white-space: nowrap
        font-size: 0
        transform-origin: 40px 530px
        .middle-l
          display: inline-block
          // display:none
          vertical-align: top
          position: relative
          width: 100%
          height: 0
          padding-top: 80%
          .cd-wrapper
            position: absolute
            left: 10%
            top: 0
            width: 80%
            height: 100%
            .cd
              width: 100%
              height: 100%
              box-sizing: border-box
              border: 10px solid rgba(255, 255, 255, 0.1)
              border-radius: 50%
              &.play
                animation: rotate 20s linear infinite
              &.pause
                animation-play-state: paused
              .image
                position: absolute
                left: 0
                top: 0
                width: 100%
                height: 100%
                border-radius: 50%
          .playing-lyric-wrapper
            width: 80%
            margin: 30px auto 0 auto
            overflow: hidden
            text-align: center
            .playing-lyric
              line-height: 1.8
              font-size: $font-size-medium
              color: $color-text-l
              &.active
                color: $color-text
        .middle-r
          display: inline-block
          vertical-align: top
          width: 100%
          height: 100%
          overflow: hidden
          &.transition
            transition: all 0.5s
          // transition: all 0.1s
          &.show
            transform: translateX(-100%)
          &.noshow
            transform: translateX(0%)
          .lyric-wrapper
            width: 80%
            margin: 0 auto
            overflow: hidden
            text-align: center
            .text
              line-height: 32px
              color: $color-text-l
              font-size: $font-size-medium
              &.current
                color: $color-text
                // color: #31c27c
      .bottom
        position: absolute
        bottom: 50px
        width: 100%
        .dot-wrapper
          text-align: center
          font-size: 0
          .dot
            display: inline-block
            vertical-align: middle
            margin: 0 4px
            width: 8px
            height: 8px
            border-radius: 50%
            background: $color-text-l
            &.active
              width: 20px
              border-radius: 5px
              background: $color-text-ll
        .progress-wrapper
          display: flex
          align-items: center
          width: 90%
          margin: 0px auto
          padding: 10px 0
          .time
            color: $color-text
            font-size: 10px
            flex: 0 0 36px
            line-height: 30px
            width: 30px
            &.time-l
              text-align: left
            &.time-r
              text-align: right
          .progress-bar-wrapper
            flex: 1
        .operators
          display: flex
          align-items: center
          .icon
            flex: 1
            color: $color-theme
            &.disable
              color: $color-theme-d
            i
              font-size: 30px
          .i-left
            text-align: right
          .i-center
            padding: 0 20px
            text-align: center
            i
              font-size: 40px
          .i-right
            text-align: left
          .icon-favorite
            color: $color-sub-theme
    .mini-player
      display: flex
      align-items: center
      position: fixed
      left: 0
      bottom: 0
      z-index: 180
      width: 100%
      height: 60px
      background: $color-highlight-background
      &.mini-enter-active, &.mini-leave-active
        transition: all 0.3s
      &.mini-enter, &.mini-leave-to
        opacity: 0
      .icon
        flex: 0 0 40px
        width: 40px
        padding: 0 10px 0 20px
        img
          border-radius: 50%
          &.play
            animation: rotate 10s linear infinite
          &.pause
            animation-play-state: paused
      .text
        display: flex
        flex-direction: column
        justify-content: center
        flex: 1
        line-height: 20px
        overflow: hidden
        .name
          margin-bottom: 2px
          no-wrap()
          font-size: $font-size-medium
          color: $color-text
        .desc
          no-wrap()
          font-size: $font-size-small
          color: $color-text-d
      .control
        flex: 0 0 30px
        width: 30px
        padding: 0 10px
        position: relative
        .icon-play-mini, .icon-pause-mini, .icon-playlist
          font-size: 30px
          color: $color-theme-d
        .icon-mini
          font-size: 32px
          position: absolute
          left: 0
          top: 0
  .control
    .circle-progress
      width: 30px
      height: 30px
      position: absolute
      left: 0
      top: 0
      >>> svg
        width: 30px
        height: 30px
  @keyframes rotate
    0%
      transform: rotate(0)
    100%
      transform: rotate(360deg)
</style>
