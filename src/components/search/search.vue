<template>
  <div class="search">
    <div class="search-box-wrapper">
      <search-box :fromHotKey="fromHotKey"
                  @query="queryChange"></search-box>
    </div>
    <div ref="shortcutWrapper"
         class="shortcut-wrapper"
         v-show="!fromHotKey">
      <div ref="shortcut"
           class="shortcut">
        <div>
          <div class="hot-key">
            <h1 class="title">热门搜索</h1>
            <ul>
              <li class="item"
                  @click="addQuery(item.k)"
                  v-for="(item,index) in hotKey"
                  :key="index">
                <span>{{item.k}}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div class="search-result"
         v-show="fromHotKey">
      <suggest :query="fromHotKey"></suggest>
    </div>
  </div>
</template>

<script>
  import SearchBox from 'base/search-box/search-box'
  import { getHotKey } from 'api/search'
  import { ERR_OK } from 'api/config'
  import Suggest from 'components/suggest/suggest'

  export default {
    data () {
      return {
        hotKey: [],
        fromHotKey: ''
      }
    },
    created () {
      this._getHotKey()
    },
    methods: {
      addQuery (key) {
        this.fromHotKey = key
      },
      queryChange (query) {
        this.fromHotKey = query
      },
      _getHotKey () {
        getHotKey().then((res) => {
          if (res.code === ERR_OK) {
            this.hotKey = res.data.hotkey.slice(0, 10)
          }
        })
      }
    },
    components: {
      SearchBox,
      Suggest
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import '~common/stylus/variable'
  @import '~common/stylus/mixin'
  .search
    .search-box-wrapper
      margin: 20px
    .shortcut-wrapper
      position: fixed
      top: 178px
      bottom: 0
      width: 100%
      .shortcut
        height: 100%
        overflow: hidden
        .hot-key
          margin: 0 20px 20px 20px
          .title
            margin-bottom: 20px
            font-size: $font-size-medium
            color: $color-text-l
          .item
            display: inline-block
            padding: 5px 10px
            margin: 0 20px 10px 0
            border-radius: 6px
            background: $color-highlight-background
            font-size: $font-size-medium
            color: $color-text-d
        .search-history
          position: relative
          margin: 0 20px
          .title
            display: flex
            align-items: center
            height: 40px
            font-size: $font-size-medium
            color: $color-text-l
            .text
              flex: 1
            .clear
              extend-click()
              .icon-clear
                font-size: $font-size-medium
                color: $color-text-d
    .search-result
      position: fixed
      width: 100%
      top: 178px
      bottom: 0
</style>