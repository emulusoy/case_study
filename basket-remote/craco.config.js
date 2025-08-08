
const { ModuleFederationPlugin } = require('webpack').container;
const deps = require('./package.json').dependencies;

module.exports = {

  eslint: {
    enable: false,
  },
  // webpack: {
  //   configure: (config) => {
  //     config.output.publicPath = 'auto';

  //     config.plugins.push(
  //       new ModuleFederationPlugin({
  //         name: 'basket',
  //         filename: 'remoteEntry.js',
  //         exposes: {
  //           './BasketWidget': './src/components/BasketWidget',
  //           './BasketPage':   './src/components/BasketPage',
  //         },
  //         shared: {
  //           react:     { singleton: true, requiredVersion: deps.react},
  //           'react-dom': { singleton: true, requiredVersion: deps['react-dom']},
  //         },
  //       })
  //     );

  //     return config;
  //   },
  // },
};
