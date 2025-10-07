const { program } = require('commander');
const fs = require('fs');

program
  .requiredOption('-i, --input <path>', 'Input JSON file')
  .option('-o, --output <path>', 'Output file')
  .option('-d, --display', 'Display result in console')
  .option('-f, --furnished', 'Show only furnished houses')
  .option('-p, --price <number>', 'Show houses with price less than given', parseInt)
  .option('-b, --bedrooms <number>', 'Show houses with exact number of bedrooms', parseInt);

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

let data = JSON.parse(fs.readFileSync(options.input, 'utf-8'));

// --- фільтри ---
if (options.furnished) {
  data = data.filter(item => item.furnishingstatus === "furnished");
}

if (options.price) {
  data = data.filter(item => parseInt(item.price) < options.price);
}

if (options.bedrooms) {
  data = data.filter(item => parseInt(item.bedrooms) === options.bedrooms);
}

// --- результат: ціна | площа | кімнати | меблі ---
const result = data.map(item => {
  return `${item.price} | ${item.area} sqft | ${item.bedrooms} rooms | ${item.furnishingstatus}`;
}).join('\n');

if (options.output) {
  fs.writeFileSync(options.output, result);
}

if (options.display) {
  console.log(result);
}
