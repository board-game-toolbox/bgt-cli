import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { cwd } from 'node:process'

export interface Res<T = void> {
  code: number
  msg?: string
  data?: T
}
export const STATUS_CODE = {
  ERROR: -1,
  SUCCESS: 0,
  USER_NOT_FOUND: 1,
}

export interface PluginManifest {
  id: string
  name: string
  desc: string
}

export function readPluginManifest(): PluginManifest {
  const manifestPath = resolve(cwd(), 'manifest.json')
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf-8'))
  return manifest
}

export function saveToken(token: string) {
  const filePath = resolve(__dirname, '.auth')
  writeFileSync(filePath, token, 'utf-8')
}

export function readToken(): string {
  const filePath = resolve(__dirname, '.auth')
  if (!existsSync(filePath)) return ''
  return readFileSync(filePath, 'utf-8')
}
