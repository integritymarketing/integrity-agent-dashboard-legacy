const fs = require("fs");
const path = require("path");

// Check if the environment is production
if (process.env.NODE_ENV === "production") {
    // Define the redirect rules
    const redirectRules = "/welcome https://integrity.com 301\n/* /index.html 200";

    // Define the path to the _redirects file in the build directory
    const redirectsFilePath = path.join(__dirname, "build", "_redirects");

    // Write the redirect rules to the _redirects file
    try {
        fs.writeFileSync(redirectsFilePath, redirectRules, "utf8");
        console.log("Redirects file created successfully in the build directory.");
    } catch (error) {
        console.error("Error writing to redirects file:", error);
    }
}
