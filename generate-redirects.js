const fs = require("fs");
const path = require("path");

// Define the path to the _redirects file in the build directory
const redirectsFilePath = path.join(__dirname, "build", "_redirects");

if (import.meta.env.VITE_BUILD_ENV === "Production") {
    fs.writeFileSync(redirectsFilePath, "/welcome https://integrity.com 301\n/* /index.html 200");
} else {
    fs.writeFileSync(redirectsFilePath, "/* /index.html 200");
}
