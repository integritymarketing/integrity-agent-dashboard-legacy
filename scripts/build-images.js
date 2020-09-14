const sharp = require("sharp");
const imagemin = require("imagemin");
const imageminMozjpeg = require("imagemin-mozjpeg");
const fs = require("fs");
const path = require("path");

const images = [
  {
    inPath: path.resolve(__dirname, `../src/images/bg-default.jpg`),
    outPath: (size) =>
      path.resolve(__dirname, `../src/images/optimized/bg-default-${size}.jpg`),
    sizes: [800, 1440, 1920],
  },
  ...[
    "carrier-guides",
    "health-solutions",
    "life-solutions",
    "sales-tips",
    "tech-guides",
    "working-remotely",
  ].map((resourceImgPath) => {
    return {
      inPath: path.resolve(__dirname, `../src/images/${resourceImgPath}.jpg`),
      outPath: (size) =>
        path.resolve(
          __dirname,
          `../src/images/optimized/${resourceImgPath}-${size}.jpg`
        ),
      sizes: [373, 746],
    };
  }),
];

(async () => {
  const overwriteFiles = process.argv.includes("--force");
  const sizePermutations = images
    .flatMap(({ inPath, outPath, sizes }) => {
      return sizes.map((size) => {
        return { inPath, size, outPath: outPath(size) };
      });
    })
    .filter(({ outPath }) => overwriteFiles || !fs.existsSync(outPath));

  if (sizePermutations.length === 0) {
    console.log("Images already optimized");
    return;
  }
  await Promise.all(
    sizePermutations.map(({ inPath, size, outPath }) =>
      sharp(inPath).resize(size).toFile(outPath)
    )
  );
  await imagemin(["src/images/optimized/*.jpg"], {
    destination: "src/images/optimized",
    plugins: [imageminMozjpeg()],
  });

  console.log(`${sizePermutations.length} images optimized`);
})();
