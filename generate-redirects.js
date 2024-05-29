const fs = require("fs");

if (process.env.NODE_ENV === "production") {
    fs.writeFileSync("_redirects", "/welcome https://integrity.com 301\n/* /index.html 200");
}
