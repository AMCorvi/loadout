# LoadOut

##### A personlized loadout of utility libraries that ease my development process. A useful analogy would be bring a toolbox to a job site as to oppose the running back and forth tools.

> The end of "What to the name of the NPM package again?"


## Packages

# Some of the packages that compose this module are:
- [ramdajs](https://www.npmjs.com/package/ramda) - Functional Programmgin Library
- [chance](https://www.npmjs.com/package/chance) - Random Data Generation
- [rxjs](https://www.npmjs.com/package/rxjs) - Reactive Programming Library
- [esm](https://www.npmjs.com/package/esm) - Enables user of ECMAScript modules
- [yaml](https://www.npmjs.com/package/yaml) - Allows the conversion to and from YAML (useful for generating schema files)
- [rimraf](https://www.npmjs.com/package/rimraf) - cross platform file removal library
- [faker](https://www.npmjs.com/package/faker) -  Random Data Generation
- [mathjs](https://www.npmjs.com/package/mathjs) - Math library cause well...MATH 😅
- [json-schema-faker](https://www.npmjs.com/package/json-schema-faker) - Use JSON Schema along with fake generators to provide consistent and meaningful fake data for your system.


### Configuration File

In the root directory there is a file named `moduleConfig.yaml`. This file is responsible for the structuring and building of this module. Following the YAML format the top level object should have field names matching the import name of the NPM module. Each package can specify a new different unique module name and any subfolder modules the package may contain. Hence a moduleConfig.yaml containing:

```yaml
ramda:
module_name: r
rxjs:
module_name: rx
namespaces: [ testing, operators, websockets, ajax ]
chance:
module_name: chance
mathjs:
module_name: math
yaml:
module_name: yaml
```

would allow an import of yaml, ramda and rxjs' filter operator by writing the follow:

```javascript
import loadout from '@amcorvi/yaml
import ramda from '@amcorvi/loadout/r'
import { range } from '@amcorvi/loadout/rxjs';
import { map, filter } from '@amcorvi/loadout/rxjs/operators';


const data = loadout.yaml.parse(yamlFile)

const {identity} = ramda
ramda.map(identity, [1, 2, 3])

  range(1, 200).pipe(
      filter(x => x % 2 === 1),
      map(x => x + x)
      ).subscribe(x => console.log(x));
```

*Note: The configuration cross check packages listed in package.json under the dependecies field. Ensure that any package listed moduleConfig is also listed as a npm dependecy.*

*Note: Packages listed as npm dependencies but not listed in the `moduleConfig.yaml` will automatically be made available as part of loadout*

### Scripts
* `clean` - will remove all subfolder modules
* `create` - will generate subfolder allowing for '@amcorvi/loadout/rxjs' imports
* `update` - will update the index.js file which is responsible for primary import (i.e. '@amcorvi/loadout')
* `setup` - will run clean create update sequentially and in that order.
