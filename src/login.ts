import Axios from 'axios'
import readline from 'readline-promise'
import { Res, STATUS_CODE, saveToken } from './utils'

export async function login(usn?: string, pwd?: string) {
  // if username/password not provided
  // question it from user input
  if (!usn || !pwd) {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    })
    if (!usn) {
      usn = await rl.questionAsync('Enter Username (for login/register): ')
    }
    if (!pwd) {
      pwd = await rl.questionAsync('Enter Password (for login/register): ')
    }
    rl.close()
  }
  // if still missing username and password, exit
  if (!usn) {
    console.error('username cannot be empty')
    return
  }
  if (!pwd) {
    console.error('password cannot be empty')
    return
  }
  // try login
  console.log('login...')
  const loginRes = await reqLogin(usn, pwd)
  if (loginRes.code === STATUS_CODE.SUCCESS && loginRes.data) {
    onLogin(usn, loginRes.data)
  } else if (loginRes.code === STATUS_CODE.USER_NOT_FOUND) {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    })
    const option = await rl.questionAsync(
      `${usn} not exists, register now? (y/N) `,
    )
    rl.close()

    if (option === 'y') {
      console.log('registering...')
      const registerRes = await reqRegister(usn, pwd)
      if (registerRes.code === STATUS_CODE.SUCCESS && registerRes.data) {
        onLogin(usn, registerRes.data)
      } else {
        console.log('register failed', registerRes.msg)
      }
    }
  } else {
    console.log('invalid username or password')
  }
}

function onLogin(usn: string, token: string) {
  saveToken(token)
  console.log(`${usn}, welcome to board-game-toolbox!`)
}

/**
 * API
 */
const BASE_URL = 'http://127.0.0.1:8000'
const axios = Axios.create({
  baseURL: BASE_URL,
  timeout: 10 * 1000,
})

async function reqLogin(usn: string, pwd: string): Promise<Res<string>> {
  const { data } = await axios.post('/auth/login', {
    usn,
    pwd,
  })
  return data
}

async function reqRegister(usn: string, pwd: string): Promise<Res<string>> {
  const { data } = await axios.post('/auth/register', {
    usn,
    pwd,
  })
  return data
}
