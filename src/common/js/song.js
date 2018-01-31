import { getLyric } from 'api/song'
import { ERR_OK } from 'api/config'
import { Base64 } from 'js-base64'

export default class Song {
  constructor({ id, mid, singer, name, album, duration, image, url }) {
    this.id = id
    this.mid = mid
    this.singer = singer
    this.name = name
    this.album = album
    this.duration = duration
    this.image = image
    this.url = url
  }

  getLyric () {
    if (this.lyric) {
      return
    }
    return new Promise((resolve, reject) => {
      getLyric(this.mid).then(res => {
        if (typeof res === 'string') {
          var reg = /^\w+\(({[^()]+})\)$/
          var matches = res.match(reg)
          if (matches) {
            res = JSON.parse(matches[1])
          }
        }
        if (res.retcode === ERR_OK) {
          let list = Base64.decode(res.lyric)
          this.lyric = _getLine(list)
          resolve(this.lyric)
        } else {
          //reject('no lyric')
        }
      })
    })
  }
}

function _getLine (list) {
  let lyricData = { timeArr: [], lineArr: [] }
  const timeReg = /\[[^\]]+\]/g
  const dotReg = /\[|\]/g
  let rowArr = list.split('\n').slice(5)
  rowArr.forEach(item => {
    let line = item.replace(timeReg, '')
    if (!line) {
      return
    }
    lyricData['lineArr'].push(line)

    let times = item
      .match(timeReg)[0]
      .replace(dotReg, '')
      .split(':')
    let time = parseInt(times[0]) * 60 + times[1] * 1
    lyricData['timeArr'].push(time)
  })
  return lyricData
}

export function createSong (musicData) {
  return new Song({
    id: musicData.songid,
    mid: musicData.songmid,
    singer: filterSinger(musicData.singer),
    name: musicData.songname,
    album: musicData.albumname,
    duration: musicData.interval,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${
      musicData.albummid
      }.jpg?max_age=2592000`,
    // 这里是使用的songmid
    // url: `http://thirdparty.gtimg.com/C100${musicData.songmid}.m4a?fromtag=38`
    //url: `http://isure.stream.qqmusic.qq.com/C100${musicData.songmid}.m4a?fromtag=32`
    url: `http://thirdparty.gtimg.com/C100${musicData.songmid}.m4a?fromtag=38`
  })
}

export function filterSinger (singer) {
  let ret = []
  if (!singer) {
    return ''
  }
  singer.forEach(s => {
    ret.push(s.name)
  })
  return ret.join('/')
}
