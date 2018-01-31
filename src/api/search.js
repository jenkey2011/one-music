import jsonp from 'common/js/jsonp'
import { options } from './config'

export function getHotKey() {
  const url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg'

  const data = Object.assign(
    {},
    {
      platform: 'h5',
      uin: 0,
      needNewCode: 1,
      format: 'jsonp',
      g_tk: 5381,
      // format:json
      inCharset: 'utf-8',
      outCharset: 'utf-8',
      notice: 0,
      _: +new Date().getTime()
    }
  )

  return jsonp(url, data, options)
}
