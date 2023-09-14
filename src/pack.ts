import { copyFileSync, existsSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import * as cheerio from 'cheerio'
import AdmZip from 'adm-zip'

export function pack(dist: string) {
  console.log('===== pack start =====')
  const cwd = process.cwd()
  dist = resolve(cwd, dist)
  // 1. copy manifest.json
  const manifestPath = resolve(cwd, 'manifest.json')
  copyFileSync(manifestPath, resolve(dist, 'manifest.json'))
  const pluginId = JSON.parse(readFileSync(manifestPath, 'utf-8')).id
  if (!pluginId) throw new Error('no "id" in manifest.json')
  // 2. copy icon.png
  const iconPath = resolve(cwd, 'icon.png')
  copyFileSync(iconPath, resolve(dist, 'icon.png'))
  // 3. change script/style to relative path
  const indexHtmlPath = resolve(dist, 'index.html')
  const htmlText = readFileSync(indexHtmlPath, 'utf-8')
  const $ = cheerio.load(htmlText)
  $('script').each((_, el) => {
    promiseElUseRelativePath($(el), 'src', dist)
  })
  $('link[rel="stylesheet"]').each((_, el) => {
    promiseElUseRelativePath($(el), 'href', dist)
  })
  writeFileSync(indexHtmlPath, $.html(), 'utf-8')
  // 4. zip dist
  const zip = new AdmZip()
  zip.addLocalFolder(dist)
  zip.writeZip(resolve(cwd, `${pluginId}.zip`))

  console.log('===== pack finish =====')
}

function promiseElUseRelativePath(
  el: cheerio.Cheerio<cheerio.Element>,
  attrName: string,
  dist: string,
) {
  const url = el.attr(attrName)
  // skip inline resource
  if (!url) return

  if (url.startsWith('./')) return
  else if (url.startsWith('/')) el.attr(attrName, '.' + url)
  else {
    if (isLocalUrl(dist, url)) return
    el.attr(attrName, './' + url)
  }

  console.log(
    `<${el.prop('tagName')}> ${attrName}: ${url} => ${el.attr(attrName)}`,
  )
}

function isLocalUrl(dist: string, url: string): boolean {
  return existsSync(url) || existsSync(resolve(dist, url))
}
