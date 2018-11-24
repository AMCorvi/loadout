const fs = require('fs')
const path = require('path')
const yaml = require('yaml')
const pack = require('../package.json')

// non-dev dependencies listed in package.json
const dependencies = JSON.parse(
  /* stringify first in order to sanitize for successful parse */
  JSON.stringify(pack)
).dependencies

// convert module config into POJO
const moduleConfigPath = path.resolve('moduleConfig.yaml')
const moduleConfig = fs.readFileSync(moduleConfigPath, 'utf8')
const configuration = yaml.parse(moduleConfig)

// for every key ((which is representative of an imported package))
// create file which exports that specific package
module.exports = (function(configuration, dependencies) {
  let output = {}
  for (let pkg in dependencies) {
    output[pkg] = {}

    // if the configuration object has settings input for
    // the specified 'pkg' use the module_name in that setting
    if (configuration[pkg]) {
      output[pkg].module_name =
        // if updated module_name is provided for this pkg
        configuration[pkg].module_name
          ? // add module_name field to the namespace of the pkg in the output map
          configuration[pkg].module_name
          : // if no module_name is provided for the configuration of that package
        // set module_name equal to the pkg's name itself
          pkg
    }
    // if there configuration, at all, for this pkg set module_name equal to
    // the pkg's name itself
    else output[pkg].module_name = pkg

    // if the configuration lists namespaces (in configuration['namespaces'])
    //  then append an equivalent field to the output object
    if (configuration[pkg] && configuration[pkg].namespaces) {
      output[pkg].namespaces = configuration[pkg].namespaces
    }
  }

  Object.entries(output).forEach((val, tidx) => {
    const pkg = val[0]
    directoryName = val[1].module_name
    namespaces = val[1].namespaces ? val[1].namespaces : null

    // create costume error implentation to only log on instance of error
    const logError = e => {
      if (e) console.error(e)
    }

    // create module directory
    fs.mkdir(`sample/${directoryName}`, 0o777, logError)
    let indexFileContents = `module.exports = require('${pkg}')`
    fs.writeFile(
      `sample/${directoryName}/index.js`,
      indexFileContents,
      'utf8',
      logError
    )

    // if local `namspace` variable is not equal to null
    // create 'sub module files' for each namespace
    // TODO: move to seperate function inorder to manage submodules
    if (!Object.is(namespaces, null)) {
      namespaces.forEach(val => {
        let subModuleContents = `module.exports = require('${pkg}/${val}')`
        fs.writeFile(
          `sample/${directoryName}/${val}.js`,
          subModuleContents,
          'utf8',
          logError
        )
      })
    }
  })
})(configuration, dependencies)
