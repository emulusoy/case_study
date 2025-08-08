// products-remote/next.config.js
const { NextFederationPlugin } = require('@module-federation/nextjs-mf');
const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // webpack(config, options) {
  //   // Tek React örneği kullanmak için alias
  //   config.resolve.alias = {
  //     ...(config.resolve.alias || {}),
  //     react: path.resolve(__dirname, '../node_modules/react'),
  //     'react-dom': path.resolve(__dirname, '../node_modules/react-dom'),
  //   };
  //   config.plugins.push(
  //     new NextFederationPlugin({
  //       name: 'products',
  //       filename: 'static/chunks/remoteEntry.js',
  //       exposes: { './ProductsPage': './src/components/ProductsPage' },
  //       shared: {
  //         react: { singleton: true, strictVersion: true },
  //         'react-dom': { singleton: true, strictVersion: true },
  //         '@reduxjs/toolkit': { singleton: true, requiredVersion: false },
  //         'react-redux': { singleton: true, requiredVersion: false },
  //       },
  //     })
  //   );
  //   return config;
  // },
};

module.exports = nextConfig;
