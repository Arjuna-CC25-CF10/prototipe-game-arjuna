// webpack.prod.js
const { merge } = require("webpack-merge");
const common = require("./webpack.common.cjs");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// const { InjectManifest } = require("workbox-webpack-plugin"); // Aktifkan jika pakai service worker
const path = require("path");

module.exports = merge(common, {
  mode: "production",
  devtool: "source-map",
  module: {
    rules: [
      {
        // Aturan CSS khusus untuk produksi (membuat file .css terpisah)
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({ filename: "[name].[contenthash].css" }),
    // Plugin untuk Service Worker (PWA)
    // new InjectManifest({
    //   swSrc: path.resolve(__dirname, "src/js/sw.js"),
    //   swDest: "sw.bundle.js",
    // }),
  ],
  optimization: {
    // Optimisasi untuk memisahkan kode dari library (vendor)
    splitChunks: {
      chunks: "all",
      minSize: 20000,
      maxSize: 70000,
      minChunks: 1,
      maxAsyncRequests: 30,
      maxInitialRequests: 30,
      automaticNameDelimiter: "~",
      enforceSizeThreshold: 50000,
      cacheGroups: {
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
  },
});
