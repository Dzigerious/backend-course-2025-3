const { program } = require('commander');
const fs = require('fs');
const chalk = require('chalk');

program
  .option('-i, --input <path>', 'Input JSON file')
  .option('-o, --output <path>', 'Output file')
  .option('-d, --display', 'Display result in console')
  .option('-f, --furnished', 'Show only furnished houses')
  .option('-p, --price <number>', 'Show houses with price less than given', parseInt)
  .option('-b, --bedrooms <number>', 'Show houses with exact number of bedrooms', parseInt);

program.parse(process.argv); //main for start of cli, and wto
const options = program.opts(); // returns object with all options

if (!options.input) {
  console.error("Please, specify input file");
  process.exit(1);
}

if (!fs.existsSync(options.input)) {
  console.error("Cannot find input file");
  process.exit(1);
}

let data = JSON.parse(fs.readFileSync(options.input, 'utf-8'));

if (options.furnished) { 
  data = data.filter(item => item.furnishingstatus === "furnished"); //.filter creates a new arrey that contain elements only true
}

if (options.price) {
  data = data.filter(item => parseInt(item.price) < options.price); 
}

if (options.bedrooms) {
  data = data.filter(item => parseInt(item.bedrooms) === options.bedrooms);
}

const maxPriceLen = Math.max(...data.map(i => String(i.price).length));
const maxAreaLen = Math.max(...data.map(i => (i.area + ' sqft').length));
const maxRoomsLen = Math.max(...data.map(i => (i.bedrooms + ' rooms').length));
const maxFurnishLen = Math.max(...data.map(i => i.furnishingstatus.length));

const colorizeStatus = (status) => {
  switch (status) {
    case "furnished": return chalk.green(status);
    case "semi-furnished": return chalk.yellow(status);
    case "unfurnished": return chalk.red(status);
    default: return status;
  }
};

const result = data.map(item => {
  const price = String(item.price).padEnd(maxPriceLen, ' ');
  const area = (item.area + ' sqft').padEnd(maxAreaLen, ' ');
  const rooms = (item.bedrooms + ' rooms').padEnd(maxRoomsLen, ' ');
  const furnished = colorizeStatus(item.furnishingstatus).padEnd(maxFurnishLen, ' ');
  return `${price} | ${area} | ${rooms} | ${furnished}`;
}).join('\n');

if (options.output) {
  fs.writeFileSync(options.output, result);
}

if (options.display){
  console.log(result)
}




  
