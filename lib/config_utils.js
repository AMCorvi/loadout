const { resolve } = require('path')
const { readFileSync } = require('fs')
const { parse } = require('yaml')


// create costume error implentation to only log on instance of error
exports.logError = e => {
  if (e) console.error(e)
}

/**
  * @param {object} pack equivalent to the dependencies in package.json
  * @return {array} Array of string, where each is a package name
  * */
exports.dependencies = function dependencies(pack) {
  // non-dev dependencies listed in package.json
  const dependencies = JSON.parse(
    /* stringify first in order to sanitize for successful parse */
    JSON.stringify(pack)
  ).dependencies

  return Object.keys(dependencies)
}

/** convert module config into POJO
 * @param {string} config path to configration relative root path package
 * @return {object} 'jsonified version of yaml file at path specified'
 * */
exports.configuration = function configuration(config) {
  const moduleConfigPath = resolve(config)
  const moduleConfig = readFileSync(moduleConfigPath, 'utf8')
  return parse(moduleConfig)
}

/**
  * @param {string} dependencies array of strings, where the strings are
  * package dependencies
  * @return {object} in the format of module config with `dependencies mixed in`
  * */
exports.schemify = function schemify(dependencies) {
  return dependencies.reduce((last, next,idx) => {
    let o = {}
    o[next] = { module_name: next }
    return Object.assign(last, o)
  }, {})
}


// let c = exports.configuration("./moduleConfig.yaml")
// let b = exports.dependencies(require('../package.json'))
// let a = exports.schemify(b)
// let x = Object.assign( a, c)
// console.log(x)
