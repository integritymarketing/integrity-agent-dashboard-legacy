const sharp = require("sharp");
const imagemin = require("imagemin");
const imageminMozjpeg = require("imagemin-mozjpeg");

const images = [
  {
    inPath: "./src/images/bg-default.jpg",
    outPath: (size) => `./src/images/optimized/bg-default-${size}.jpg`,
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
      inPath: `./src/images/${resourceImgPath}.jpg`,
      outPath: (size) =>
        `./src/images/optimized/${resourceImgPath}-${size}.jpg`,
      sizes: [373, 746],
    };
  }),
];

(async () => {
  // TODO: skip files that exist already
  await Promise.all(
    images.map(({ inPath, outPath, sizes }) => {
      return Promise.all(
        sizes.map((size) => {
          return sharp(inPath).resize(size).toFile(outPath(size));
        })
      );
    })
  );
  await imagemin(["src/images/optimized/*.jpg"], {
    destination: "src/images/optimized",
    plugins: [imageminMozjpeg()],
  });

  console.log("Images optimized");
})();
