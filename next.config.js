const { withGlobalCss } = require('next-global-css')

const withConfig = withGlobalCss()
const path = require("path");

module.exports = withConfig({
  trailingSlash: true,
  reactStrictMode: false,
  experimental: {
    esmExternals: false,
    jsconfigPaths: true, // enables it for both jsconfig.json and tsconfig.json
  },
  // webpack: (config, options) => {
  //   // config.resolve.alias = {
  //   //   ...config.resolve.alias,
  //   //   apexcharts: path.resolve(
  //   //     __dirname,
  //   //     "./node_modules/apexcharts-clevision"
  //   //   ),
  //   // };

  //   patchWebpackConfig(config, options);
  //   // return config;
  // },
});
