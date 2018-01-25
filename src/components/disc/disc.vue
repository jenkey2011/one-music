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

  export default {
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
        getCdInfo(this.disc.dissid).then((res) => {
          console.log(res)
          if (res.code === ERR_OK) {
            this.songs = res.data
          }
        })
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