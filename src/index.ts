#!/usr/bin/env node

import { Command } from 'commander'
import { pack } from './pack'
import { login } from './login'
import { publish } from './publish'

const NAME = 'bgt'
const VERSION = '0.1.0'

const cmd = new Command()

const packCmd = cmd
  .command('pack [dist]')
  .description('pack dist to plugin archive')
  .action((dist: string = 'dist') => {
    pack(dist)
  })

const loginCmd = cmd
  .command('login')
  .description('login to plugin registry')
  .option('-u <username>')
  .option('-p <password>')
  .action((options) => {
    login(options.username, options.password)
  })

const publishCmd = cmd
  .command('publish')
  .description('upload zipped plugin archive')
  .option('-i <archivePath>')
  .action((options) => {
    publish(options.archivePath)
  })

cmd
  .name(NAME)
  .version(VERSION)
  .addCommand(packCmd)
  .addCommand(loginCmd)
  .addCommand(publishCmd)

cmd.parse(process.argv)
