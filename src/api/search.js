import jsonp from 'common/js/jsonp'
import { options } from './config'

export function getHotKey () {
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

export function search (query, page, zhida, perpage) {
  const url = 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp'

  const data = Object.assign(
    {},
    {
      g_tk: 5381,
      uin: 0,
      // format: 'json',
      inCharset: 'utf-8',
      outCharset: 'utf-8',
      notice: 0,
      platform: 'h5',
      needNewCode: 1,
      w: query,
      zhidaqu: 1,
      catZhida: zhida ? 1 : 0,
      t: 0,
      flag: 1,
      ie: 'utf-8',
      sem: 1,
      aggr: 0,
      perpage: perpage,
      n: 20,
      p: page,
      remoteplace: 'txt.mqq.all',
      _: +new Date().getTime()
    }
  )

  return jsonp(url, data, options)
}
