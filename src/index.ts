#!/usr/bin/env node

import { Command } from 'commander'
import { pack } from './pack'

const NAME = 'bgt'
const VERSION = '0.1.0'

const cmd = new Command()

const packCmd = cmd
  .command('pack [dist]')
  .description('pack dist to plugin archive')
  .action((dist: string = 'dist') => {
    pack(dist)
  })

cmd
  .name(NAME)
  .version(VERSION)
  // pack
  .addCommand(packCmd)

cmd.parse(process.argv)
