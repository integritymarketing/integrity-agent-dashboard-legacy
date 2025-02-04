const fs = require("fs");
const path = require("path");
const exportedResources = process.argv[2];
const resourceFilePath = path.resolve(
  __dirname,
  "../src/pages/content/resources.json"
);
function string_to_slug(str) {
  str = str.replace(/^\s+|\s+$/g, ""); // trim
  str = str.toLowerCase();
  // remove accents, swap ñ for n, etc
  var from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
  var to = "aaaaeeeeiiiioooouuuunc------";
  for (var i = 0, l = from.length; i < l; i++) {
    str = str.replace(new RegExp(from.charAt(i), "g"), to.charAt(i));
  }
  str = str
    .replace(/[^a-z0-9 -]/g, "") // remove invalid chars
    .replace(/\s+/g, "-") // collapse whitespace and replace by -
    .replace(/-+/g, "-"); // collapse dashes
  return str;
}
function camelize(str) {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    })
    .replace(/\s+/g, "");
}
const ICONS = {
  "working-remote": "computer",
  "sales-tips": "lightbulb",
  "carrier-guides": "document",
  "tech-guides": "tools",
  default: "document",
};
(async () => {
  const rawResources = await fs.promises.readFile(exportedResources, {
    encoding: "utf-8",
  });
  const ALLOWED_WINDOWS = ["Launch", "Launch: Feature"];
  const parsedResources = JSON.parse(rawResources);
  const activeResources = parsedResources.filter(
    (resource) =>
      ALLOWED_WINDOWS.includes(resource["Release Window"]) &&
      resource.Title !== null
  );
  const resources = activeResources.map((resource) => {
    return {
      name: resource.Title,
      description: resource["Preview/Short Description"],
      categories: [string_to_slug(resource.Section)],
      filename: resource["New File name path"]
        ? resource["New File name path"].trim()
        : null,
    };
  });
  const categories = Array.from(
    new Set(activeResources.map((resource) => resource.Section))
  ).map((cat) => {
    const id = string_to_slug(cat);
    return {
      id,
      name: cat,
      icon: ICONS[id] || ICONS["default"],
      analyticsKey: camelize(cat),
    };
  });
  const featured = activeResources
    .filter((resource) => resource["Release Window"] === "Launch: Feature")
    .map((resource) => resource.Title);
  await fs.promises.writeFile(
    resourceFilePath,
    JSON.stringify(
      {
        featured,
        categories,
        resources,
      },
      null,
      2
    ),
    "utf-8"
  );
})();