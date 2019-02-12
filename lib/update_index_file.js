const { writeFile } = require('fs')
const {
  configuration,
  dependencies,
  logError,
  schemify
} = require('./config_utils')
const packageDependencies = require('../package.json')

// create import declaration for each file
// create dependencies object to be exported

let config = configuration('./moduleConfig.yaml')
const deps = dependencies(packageDependencies)
config = Object.assign(schemify(deps), config)

function main(config) {
  // create string that will eventually evolve into the fileContents
  let fileString = ''

  // create all the 'top-of-module' imports
  Object.entries(config).forEach(pkg => {
    fileString += `const ${pkg[1].module_name} = require('./${
    pkg[1].module_name
  }');\n`

  })

  // create the object that constitutes the exported module
  let exportObject = {}
    Object.entries(config).forEach(pkg => {
      exportObject[pkg[1].module_name] = pkg[1].module_name
    })

  // stringify the object so that it may be added to fileString
  exportObject = JSON.stringify(exportObject, null, 2)
  // append exportObject the file string
  fileString += `
  module.exports = ${exportObject}
  `

  // write the fileString to file
  writeFile('index.js', fileString, logError)
}

// Execute Subroutine
main(config)
