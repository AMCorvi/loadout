const { resolve } = require('path')
const parsePath = require('path').parse
const { readdirSync, readFileSync } = require('fs')
const parseYaml = require('yaml').parse
const pipe = require('ramda').pipe

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
  return parseYaml(moduleConfig)
}

/**
 * @param {string} dependencies array of strings, where the strings are
 * package dependencies
 * @return {object} in the format of module config with `dependencies mixed in`
 * */
exports.schemify = function schemify(dependencies) {
  return dependencies.reduce((last, next, idx) => {
    let o = {}
    o[next] = { module_name: next }
    return Object.assign(last, o)
  }, {})
}

/**
 * @param {string} templateDir the name of the directory where config template are located relative to the root directory of this project (i.e. where this project's package.json is located)
 * @returns {array} and array of file object of the following scheme:
 * { root: '/',
 *   dir: '/home/user/dir',
 *   base: 'file.txt',
 *   ext: '.txt',
 *   name: 'file' }
 * */
exports.getTemplateFilePaths = function getTemplateFilePaths(templateDir) {
  // create path to template folder
  const templatePath = resolve(__dirname, '../', templateDir)
  // get all the file in the template directory
  let configFiles = readdirSync(templatePath, 'utf8')

  // create a javascript Object for each file in the templateDir
  // which formats the object into the following format:
  // Returns:
  // { root: '/',
  //   dir: '/home/user/dir',
  //   base: 'file.txt',
  //   ext: '.txt',
  //   name: 'file' }
  return configFiles.map(fileName => parsePath(templatePath + '/' + fileName))
}

/**
 * Given a label ensure that a dataschema file of with label exists
 * @param {string} lableName the unique aspect of the schema name (e.g. if you wish to select the file User.datascheme.yaml provide 'User' as the argument )
 * @return {tuple} An array containing two elements both of type string. The first element is the and the second element is the file extension *
 * */
exports.schemaSearch = function schemaSearch(labelName) {
  let output = null
  const fileroot = `${labelName}.datascheme`

  // construct an array of the file in the process directory
  let directoryPath = process.cwd()
  let directoryContents = readdirSync(directoryPath, 'utf8')
  let fileDescriptonsList = directoryContents.forEach(file => {
    // construct a file path object
    let fileObject = parsePath(file)
    // compare file name with expected name
    let tuple =
      fileroot === fileObject.name
        ? // if expected check for yaml,js or json extension
          fileObject.ext === ('.yaml' || '.js' || 'json')
          ? // if extension match return full name and extension in tuple
            [fileObject.base, fileObject.ext]
          : null
        : null

    tuple ? output = tuple : null;
  })

  if (output === null) output = [null, null]
  return output
}


/**
 * Create an object that fulfills the JSONSchema specification.
 * @param {string} filename The full filename of the selected datascheme.* file
 * @param {string} ext The extension (i.e '.js', '.yaml' ,etc) of the selected file
 * @return {object} A POJO matching the JSONSchema protocol
  * */
exports.convertSchema = function convertSchema(filename, ext) {
  const fileContent = readFileSync(filename, { encoding: 'utf8' })
  let schema =
    ext === '.js'
      ? require(filename)
      : ext === '.json'
      ? JSON.parse(fileContent)
      : ext === '.yaml'
      ? (parseYaml(fileContent))
      : null

  return schema
}

