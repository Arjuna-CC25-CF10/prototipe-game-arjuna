// webpack.dev.js
const { merge } = require("webpack-merge");
const common = require("./webpack.common.cjs");
const path = require("path");

module.exports = merge(common, {
  mode: "development",
  devtool: "inline-source-map",
  devServer: {
    static: path.resolve(__dirname, "dist"),
    open: true,
    port: 9001,
    client: {
      overlay: {
        errors: true,
        warnings: false, // Peringatan seringkali tidak krusial
      },
    },
  },
  module: {
    rules: [
      {
        // Aturan CSS khusus untuk development (inject ke style tag)
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
});
