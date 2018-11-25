const { readFileSync } = require('fs')
const { resolve } = require('path')
const { parse } = require('yaml')
const rmdir = require('rimraf')

// parse moduleConfig and convert moduleConfig into POJO
const moduleConfigPath = resolve('moduleConfig.yaml')
const moduleConfig = readFileSync(moduleConfigPath, 'utf8')
const configuration = parse(moduleConfig)

// create costume error implentation to only log on instance of error
const logError = e => {
  if (e) console.error(e)
}

// determine top levels modules that would have been created
// create an entries array where first the '1' index is
// an object that may contain module_name property
const topLevelDirectories = Object.entries(configuration).map(val => {
  // determine if module_name field record is defined in object
  // if it append that to array
  if (val[1] && val[1].module_name) return val[1].module_name
  // else append the package name to array as the directory
  // will be given that name
  else return val[0] // package name
})

// for each top level module deleted it
topLevelDirectories.forEach(val => {
  rmdir(resolve('sample', val), logError)
})
