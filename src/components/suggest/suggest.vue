<template>
  <scroll ref="suggest"
          class="suggest"
          :pullUp="pullUp"
          :data="result"
          :beforeScroll="beforeScroll"
          @scrollToEnd="searchMore"
          @beforeScroll="lisenScroll">
    <ul class="suggest-list">
      <li class="suggest-item"
          @click="selectItem(item, index)"
          v-for="(item,index) in result"
          :key="index">
        <div class="icon">
          <i :class="getIconCls(item)"></i>
        </div>
        <div class="name">
          <p class="text"
             v-html="getDisplayName(item)"></p>
        </div>
      </li>
      <loading :title="'正在加载更多'"
               v-show="hasMore"></loading>
    </ul>
    <div v-show="!hasMore && !result.length"
         class="no-result-wrapper">
      <no-result title="抱歉，暂无搜索结果"></no-result>
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/scroll'
  import Loading from 'base/loading/loading'
  import NoResult from 'base/no-result/no-result'
  import { search } from 'api/search'
  import { ERR_OK } from 'api/config'
  import { createSong } from 'common/js/song'
  import { mapMutations, mapActions } from 'vuex'
  import Singer from 'common/js/singer'
  import { history } from 'common/js/util'

  const TYPE_SINGER = 'singer'
  const HISTORY_KEY = 'HISTORY'
  const perpage = 20

  export default {
    props: {
      showSinger: {
        type: Boolean,
        default: true
      },
      query: {
        type: String,
        default: ''
      }
    },
    data () {
      return {
        result: [],
        pullUp: true,
        hasMore: true,
        beforeScroll: true,
        page: 1,
        historyList: []
      }
    },
    created () {
      // this.historyList = history.get(HISTORY_KEY)
    },
    methods: {
      selectItem (item, index) {
        if (item.type === TYPE_SINGER) {
          const singer = new Singer({
            id: item.singermid,
            name: item.singername
          })
          this.$router.push({
            path: `/search/${singer.id}`
          })
          this.setSinger(singer)
        } else {
          this.songs = this.result
          this.selectPlay({
            list: this.songs,
            index
          })
        }
      },
      search () {
        if (!this.query) {
          return
        }
        this.result = []
        this.page = 1
        this.$refs.suggest.scrollTo(0, 0)
        this.hasMore = true
        this._search()
        this.$emit('search')
        this.historyList.push(this.query)
        let list = this.historyList
        history.save(HISTORY_KEY, list)
        this.setSearchHistory(list)
      },
      searchMore () {
        if (!this.hasMore) {
          return
        }
        this.page++
        this._search()
      },
      lisenScroll () {
        this.$emit('beforeScroll')
      },
      _search () {
        search(this.query, this.page, this.showSinger, perpage).then((res) => {
          if (res.code === ERR_OK) {
            this.result = this.result.concat(this._genResult(res.data))
            this._checkMore(res.data)
          }
        })
      },
      _checkMore (data) {
        const song = data.song
        if (!song.list.length || (song.curnum + song.curpage * perpage) <= song.list.length) {
          this.hasMore = false
        }
      },
      getIconCls (item) {
        if (item.type === TYPE_SINGER) {
          return 'icon-mine'
        } else {
          return 'icon-music'
        }
      },
      getDisplayName (item) {
        if (item.type === TYPE_SINGER) {
          return item.singername
        } else {
          return `${item.name} - ${item.singer}`
        }
      },
      _genResult (data) {
        let ret = []
        if (data.zhida && data.zhida.singerid) {
          ret.push({ ...data.zhida, ...{ type: TYPE_SINGER } })
        }
        if (data.song) {
          ret = ret.concat(this._normalizeSongs(data.song.list))
        }
        return ret
      },
      _normalizeSongs (list) {
        let ret = []
        list.forEach((musicData) => {
          if (musicData.songid && musicData.albummid) {
            ret.push(createSong(musicData))
          }
        })
        return ret
      },
      ...mapMutations({
        setSinger: 'SET_SINGER',
        setSearchHistory: 'SET_SEARCH_HISTORY'
      }),
      ...mapActions([
        'selectPlay'
      ])
    },
    watch: {
      query (newQuery) {
        this.search(newQuery)
      }
    },
    components: {
      Scroll,
      Loading,
      NoResult
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '~common/stylus/variable'
  @import '~common/stylus/mixin'
  .suggest
    height: 100%
    overflow: hidden
    .suggest-list
      padding: 0 30px
      .suggest-item
        display: flex
        align-items: center
        padding-bottom: 20px
      .icon
        flex: 0 0 30px
        width: 30px
        [class^='icon-']
          font-size: 14px
          color: $color-text-d
      .name
        flex: 1
        font-size: $font-size-medium
        color: $color-text-d
        overflow: hidden
        .text
          no-wrap()
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>