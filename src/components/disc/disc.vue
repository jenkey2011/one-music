<template>
  <!-- <transition name="slide"> -->
  <music-list :title="title"
              :bg-image="bgImage"
              :songs="songs"></music-list>
  <!-- </transition> -->
</template>

<script type="text/ecmascript-6">
  import MusicList from 'components/music-list/music-list'
  import { mapGetters } from 'vuex'
  import { getCdInfo } from 'api/recommend'
  import { ERR_OK } from 'api/config'
  import { createSong } from 'common/js/song'

  export default {
    data () {
      return {
        songs: []
      }
    },
    computed: {
      title () {
        return this.disc.dissname
      },
      bgImage () {
        return this.disc.imgurl
      },
      ...mapGetters([
        'disc'
      ])
    },
    components: {
      MusicList
    },
    created () {
      this._getCdInfo()
    },
    methods: {
      _getCdInfo () {
        if (!this.disc.dissid) {
          return
        }
        getCdInfo(this.disc.dissid).then((res) => {
          if (res.code === ERR_OK) {
            let list = res.cdlist[0].songlist
            this.songs = this._normalizeSongs(list)
          }
        })
      },
      _normalizeSongs (list) {
        let ret = []
        list.forEach((musicData) => {
          // let { musicData } = item
          if (musicData.songid && musicData.albummid) {
            ret.push(createSong(musicData))
          }
        })
        return ret
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s
  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>