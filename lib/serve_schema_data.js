const jsoncolor = require('json-colorz')
const jsf = require('json-schema-faker')
const {
  schemaSearch, convertSchema
} = require('./config_utils')
const gradient = require('gradient-string')
console.passion = string => console.log(gradient.passion(string))

// execute script
if (process.arv[2] !== undefined) {
  main(process.argv[2])
}

// Main
function main(labelName) {
  // Notify User Script is Running on provided user
  console.passion(`Processing ${process.argv[2]}.datascheme!`)

  // Verify user is enabled
  let [ fileName, fileExtension ] = schemaSearch(labelName)

  // generate JSONSchema from selected file
  const schema = convertSchema(fileName, fileExtension)

  // display mock data to console
  displayMockData(schema)
}

function displayMockData(schema) {

  // add random data libraries
  jsf.extend('faker', () => require('faker'))
  jsf.extend('chance', () => require('chance').Chance())

  // produce data base on JSONSchema
  let data = jsf.generate(schema)

  console.clear()

  // add ansi colors and stringify json data
  data = jsoncolor(data)
  return data
}
