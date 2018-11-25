const { readFileSync } = require('fs')
const { resolve } = require('path')
const { parse } = require('yaml')
const rmdir = require('rimraf')
const packageDependencies = require('../package.json')

const {
  logError,
  dependencies,
  configuration,
  schemify
} = require('./config_utils')

let config = configuration('./moduleConfig.yaml')
const dep = dependencies(packageDependencies)
config = Object.assign(schemify(dep), config)

// determine top levels modules that would have been created
// create an entries array where first the '1' index is
// an object that may contain module_name property
const topLevelDirectories = Object.entries(config).map(val => {
  // determine if module_name field record is defined in object
  // if it append that to array
  if (val[1] && val[1].module_name) return val[1].module_name
  // else append the package name to array as the directory
  // will be given that name
  else return val[0] // package name
})

// for each top level module deleted it
topLevelDirectories.forEach(val => {
  rmdir(resolve(val), logError)
})
