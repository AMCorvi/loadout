#!/usr/bin/env node

const {
  spawn, execSync
} = require('child_process')
const {
  copyFile, readFile
} = require('fs')
const program = require('yargs')
const { resolve } = require('path')
const nodemon = require('nodemon')

const {
  logError,
  dependencies,
  getTemplateFilePaths
} = require('../lib/config_utils')
const packageJSON = require('../package.json')

program.command(
  'spread <pkg...>',
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
      ,required:    true
    })
  },
  args => {
    if (args.pkg) {
      let o = spawn('npm', [ 'i', ...args.pkg ])
      o.stderr.on('data', data => console.log(`stderr: ${data}`))
      o.stdout.on('data', data => console.log(`stdout: ${data}`))
    }
  }
)

program.command(
  'loadrc <configs...>',
  'Select the desired conifigurtion template you would like add to project',
  command => {
    command.option('a', {
      alias: 'all'
      // ,type:        'array'
      ,description: 'install all `loadout` utilities into project directly'
    })
    command.positional('configs', {
      description: 'specific config templates out of the available offerings;'
      ,choices:     getTemplateFilePaths('templates/').map(file => file.name)
    })
  },
  args => {
    let templatePath = resolve(__dirname, '../templates/')
    let selectedConfigs = args.configs
    let availableTemplates = getTemplateFilePaths('templates').reduce(
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

program
  .command(
    'previewschema <label_name>', // command scheme
    'Create a file in which to write a JSON Schema that can also be displayed and examined', // Description of command
    function(command) {
      command.positional('label_name', { required: true })
    },
    function(args) {
      nodemon(
        '--ext "js yaml json" ' +
          `--watch ${args.label_name}.*.* ` +
          `${resolve(__dirname + '/../lib/serve_schema_data.js')} ` +
          `${args.label_name} `
      ).on('restart', function(event) {
        // clear console screen everytime an update to the source file is recognized
        console.clear()
      })
    }
  )

  // Execute CLI
  .help().argv
