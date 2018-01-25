import axios from 'axios'

export function getLyric(mid) {
  const url = '/api/lyric'

  const data = Object.assign(
    {},
    {
      pcachetime: +new Date(),
      songmid: mid,
      g_tk: 5381,
      loginUin: 0,
      hostUin: 0,
      format: 'json',
      inCharset: 'utf8',
      outCharset: 'utf-8',
      notice: 0,
      platform: 'yqq',
      needNewCode: 0
    }
  )

  return axios
    .get(url, {
      params: data
    })
    .then(res => {
      return Promise.resolve(res.data)
    })
}
