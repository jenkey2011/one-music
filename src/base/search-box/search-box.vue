<template>
  <div class="search-box">
    <i class="icon-search"></i>
    <input ref="query"
           v-model="query"
           class="box"
           @focus="isOnfocus = true"
           :placeholder="placeholder" />
    <i @click="clear"
       v-show="query"
       class="icon-dismiss"></i>
  </div>
</template>

<script type="text/ecmascript-6">
  import { debounce } from 'common/js/util'

  // const HISTORY_KEY = 'SEARCH_HISTORY'

  export default {
    props: {
      placeholder: {
        type: String,
        default: '搜索歌曲、歌手'
      },
      fromHotKey: {
        type: String,
        default: ''
      }
    },
    data () {
      return {
        query: '',
        isOnfocus: false,
        queryList: []
      }
    },
    created () {
      this.$watch('query', debounce((newQuery) => {
        this.$emit('query', newQuery)
      }, 500))
    },
    methods: {
      clear () {
        this.query = ''
      },
      // onFocus () {
      //   this.isOnfocus = true
      // },
      blur () {
        if (this.isOnfocus) {
          this.$refs.query.blur()
          this.isOnfocus = false
        }
      }
    },
    watch: {
      fromHotKey (newKey) {
        this.query = newKey
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '~common/stylus/variable'
  .search-box
    display: flex
    align-items: center
    box-sizing: border-box
    width: 100%
    padding: 0 6px
    height: 40px
    background: $color-highlight-background
    border-radius: 6px
    .icon-search
      font-size: 24px
      color: $color-background
    .box
      flex: 1
      margin: 0 5px
      line-height: 18px
      background: $color-highlight-background
      color: $color-text
      font-size: $font-size-medium
      outline: none
      &::placeholder
        color: $color-text-d
    .icon-dismiss
      font-size: 16px
      color: $color-background
</style>