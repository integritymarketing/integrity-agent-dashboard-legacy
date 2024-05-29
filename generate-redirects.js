const fs = require("fs");

if (process.env.REACT_APP_BUILD_ENV === "production") {
    fs.writeFileSync("_redirects", "/welcome https://integrity.com 301\n/* /index.html 200");
}
