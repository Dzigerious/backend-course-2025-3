const { program } = require('commander');
const fs = require('fs');

program
  .requiredOption('-i, --input <path>', 'Input JSON file')
  .option('-o, --output <path>', 'Output file')
  .option('-d, --display', 'Display result in console');

program.parse(process.argv);

const options = program.opts();

if (!options.input) {
  console.error("Please, specify input file");
  process.exit(1);
}

if (!fs.existsSync(options.input)) {
  console.error("Cannot find input file");
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(options.input, 'utf-8'));
let result = data;

if (options.output) {
  fs.writeFileSync(options.output, JSON.stringify(result, null, 2));
}

if (options.display) {
  console.log(result);
}
