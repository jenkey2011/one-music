<template>
  <div class="search-list">
    <transition-group name="list"
                      tag="ul">
      <li :key="index"
          class="search-item"
          v-for="(item,index) in searchHistory">
        <span class="text">{{item}}</span>
        <span class="icon"
              @click.stop="deleteOne(index)">
          <i class="icon-delete"></i>
        </span>
      </li>
    </transition-group>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      searchHistory: {
        type: Array,
        default: []
      }
    },
    methods: {
      deleteOne () {

      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '~common/stylus/variable'
  .search-list
    .search-item
      display: flex
      align-items: center
      height: 40px
      overflow: hidden
      &.list-enter-active, &.list-leave-active
        transition: all 0.1s
      &.list-enter, &.list-leave-to
        height: 0
      .text
        flex: 1
        color: $color-text-l
      .icon
        extend-click()
        .icon-delete
          font-size: $font-size-small
          color: $color-text-d
</style>