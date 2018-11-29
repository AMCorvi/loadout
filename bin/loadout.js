#!/usr/bin/env node

const {
  spawn, execSync
} = require('child_process')
const { readFile } = require('fs')
const program = require('yargs')
const { resolve } = require('path')

const {
  logError,
  dependencies,
  getTemplateFilePaths
} = require('../lib/config_utils')
const packageJSON = require('../package.json')

program.command(
  'spread [pkg...]',
  'which utilities we addin',
  command => {
    command.option('a', {
      alias:       'all'
      ,type:        'array'
      ,description: 'install all `loadout` utilities into project directly'
    })
    command.positional('pkg', {
      description: 'array of utility names'
      ,choices:     dependencies(packageJSON)
    })
  },
  args => {
    let o = spawn('npm', [ 'i', 'ramda' ])
    o.stderr.on('data', data => console.log(`stderr: ${data}`))
    o.stdout.on('data', data => console.log(`stdout: ${data}`))
  }
)

program
  .command(
    'loadrc [configs...]',
    'Select the desired conifigurtion template you would like add to project',
    command => {
      command.option('a', {
        alias: 'all'
        // ,type:        'array'
        ,description: 'install all `loadout` utilities into project directly'
      })
      command.positional('configs', {
        description:
          'specific config templates out of the available offerings;'
        ,choices: getTemplateFilePaths('rx/').map(file => file.name)
      })
    },
    args => {
      let templatePath = resolve(__dirname, '../template/')
      let selectedConfigs = args.configs
      let availableTemplates = getTemplateFilePaths('./rx').reduce(
        (last, next) => {
          last[next.name] = next
          return last
        },
        {}
      )

      for (let file in selectedConfigs) {
        let chosenConfig = selectedConfigs[file]
        copyFile(
          `${templatePath}/${availableTemplates[chosenConfig].base}`,
          availableTemplates[chosenConfig].base,
          logError
        )
      }
    }
  )
  .help().argv
