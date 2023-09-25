import { resolve } from 'node:path'
import { Res, STATUS_CODE, readPluginManifest, readToken } from './utils'
import decodeJWT from 'jwt-decode'
import { cwd } from 'node:process'
import { createReadStream } from 'node:fs'
import FormData from 'form-data'
import axios from 'axios'

export async function publish(archivePath?: string) {
  const token = readToken()
  if (token === '') {
    console.log('not logged in, please run: bgt login')
    return
  }
  const { exp } = decodeJWT<{
    exp: number
  }>(token)
  if (Math.floor(Date.now() / 1000) > exp) {
    console.log('authentication expired, please run: bgt login')
  } else {
    const manifest = readPluginManifest()
    if (!archivePath) archivePath = `${manifest.id}.zip`
    archivePath = resolve(cwd(), archivePath)
    const res = await reqUploadFile(archivePath, `${manifest.id}.zip`, token)
    if (res.code === STATUS_CODE.SUCCESS) {
      console.log('upload succeed')
    } else {
      console.error('upload fail', res.msg)
    }
  }
}

export async function reqUploadFile(
  filepath: string,
  filename: string,
  token: string,
): Promise<Res<void>> {
  const form = new FormData()
  form.append('file', createReadStream(filepath), filename)
  const { data } = await axios.post('/file/upload', form, {
    headers: {
      ...form.getHeaders(),
      Authorization: `Bearer ${token}`,
    },
  })
  return data
}
