const jsoncolor = require('json-colorz')
const jsf = require('json-schema-faker')
const { searchSchema, convertSchema } = require('./config_utils')

function main(labelName) {
  let [filename, fileExtension] = searchSchema(labelName);
  const schema = convertSchema(fileName, fileExtension);
  displayMockData(schema)
}

function displayMockData(schema) {
  jsf.extend('faker' => require('faker'))
  jsf.extend('chance' => require('chance').Chance())
  let data = jsf.generate(schema)
  console.log(data)
}
