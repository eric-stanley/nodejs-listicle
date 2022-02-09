const dotenv = require('dotenv');
const path = require('path');

console.log(`============ env-setup Loaded ===========`);
dotenv.config({
  path: path.resolve(process.cwd(), '__tests__', 'settings', 'config.test.env'),
});
