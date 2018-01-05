<template>
  <scroll 
   @scroll="scroll"
          :listen-scroll="listenScroll"
          :probe-type="probeType"
          :data="data"
          class="listview"
          ref="listview"
    >
    <ul>
      <li v-for="(group, index) in data" 
          :key="index" 
          class="list-group"
          ref="listGroup">
        <h2 class="list-group-title">{{ group.title }}</h2>
        <ul>
          <li v-for="item in group.items" :key="item.id" class="list-group-item">
            <img class="avatar" v-lazy="item.avatar" alt="">
            <span class="name">{{ item.name }}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="list-shortcut" @touchstart.stop.prevent="onShortTouchStart" @touchmove.stop.prevent="onShortTouchMove">
      <ul>
        <li v-for=" (item,index) in shortcutList " 
        :key="index" 
        class="item" 
        :data-index="index" 
        :class="{'current': index === currentIndex}">
          {{ item }}
        </li>
      </ul>
    </div>
  </scroll>
</template>

<script>
import Scroll from 'base/scroll/scroll'
import {getData} from 'common/js/dom'
const ANCHOR_HEIGHT = 18
export default {
  created() {
    this.touch = {}
    this.listenScroll = true
    this.probeType = 3
    this.listHeight = []
  },
  data() {
    return {
      currentIndex: 0,
      scrollY: -1,
      scrollX: -1
    }
  },
  props: {
    data: {
      type: Array,
      default: []
    }
  },
  computed: {
    shortcutList() {
      return this.data.map((group) => {
        return group.title.substr(0, 1)
      })
    }
  },
  methods: {
    onShortTouchStart(e) {
      let anchorIndex = parseInt(getData(e.target, 'index'))
      if (!anchorIndex && anchorIndex !== 0){
        return
      }
      let firstTouch = e.touches[0]
      this.touch.y1 = firstTouch.pageY
      this.touch.anchorIndex = anchorIndex
      this._scrollTo(anchorIndex)
    },
    onShortTouchMove(e) {
      let firstTouch = e.touches[0]
      this.touch.y2 = firstTouch.pageY
      let delta = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0
      let anchorIndex = parseInt(this.touch.anchorIndex) + delta
      // let anchorIndex = parseInt(this.touch.anchorIndex) + delta < 0 ? 0 : parseInt(this.touch.anchorIndex) + delta 
      // anchorIndex = anchorIndex > this.$refs.listGroup.length-1 ? this.$refs.listGroup.length-1 : anchorIndex
      this._scrollTo(anchorIndex)
    },
    scroll(pos) {
      this.scrollY = pos.y
    },
    _scrollTo(index){
      this.currentIndex = index
      this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0)
    },
    _calculatHeight() {
      this.listHeight = []
      const list = this.$refs.listGroup
      let height = 0
      this.listHeight.push(height)
      for (let i = 0; i < list.length; i++) {
        let item = list[i]
        height += item.clientHeight
        this.listHeight.push(height)
      }
    }
  },
  watch: {
    data() {
      setTimeout(() => {
        this._calculatHeight()
        console.log(this.listHeight)
      }, 20)
    },
    scrollY(newY){
      const listHeight = this.listHeight
      for (let i = 0; i < listHeight.length; i++) {
        let height1 = listHeight[i]
        let height2 = listHeight[i+1]
        if (height2 && (-newY > height1 && -newY < height2)) {
          this.currentIndex = i
          return
        }
      }
      this.currentIndex = 0
    },
    currentIndex(){
      this.currentIndex = this.currentIndex < 0 ? 0 : this.currentIndex
      this.currentIndex = this.currentIndex > this.$refs.listGroup.length-1 ? this.$refs.listGroup.length-1 : this.currentIndex
    }
  },
  components: {
    Scroll
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .listview
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .list-shortcut
      position: absolute
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
    .list-fixed
      position: absolute
      top: 0
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>

