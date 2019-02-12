const jsoncolor = require('json-colorz')
const jsf = require('json-schema-faker')
const { schemaSearch, convertSchema } = require('./config_utils')
const gradient = require('gradient-string')
console.passion = string =>  console.log(gradient.passion(string))

main(process.argv[2])


function main(labelName) {
  console.passion(`Processing ${process.argv[2]}.datascheme!`)
  let [fileName, fileExtension] = schemaSearch(labelName);
  const schema = convertSchema(fileName, fileExtension);
  displayMockData(schema)
}

function displayMockData(schema) {
  jsf.extend('faker', () => require('faker'))
  jsf.extend('chance', () => require('chance').Chance())
  let data = jsf.generate(schema)
  console.clear()
  data = jsoncolor(data)
  return data
}


