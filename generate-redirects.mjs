import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Define __dirname for ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the path to the _redirects file in the build directory
const redirectsFilePath = path.join(__dirname, 'build', '_redirects');

// Use process.env to access environment variables
if (process.env.VITE_BUILD_ENV === 'Production') {
  fs.writeFileSync(
    redirectsFilePath,
    '/test https://integrity.com 301\n/* /index.html 200'
  );
} else {
  fs.writeFileSync(redirectsFilePath, '/* /index.html 200');
}
