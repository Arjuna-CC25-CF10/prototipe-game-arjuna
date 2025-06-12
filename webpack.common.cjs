// webpack.common.js
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  // PENYESUAIAN: Path entry point disesuaikan dengan struktur kita
  entry: {
    app: path.resolve(__dirname, "src/js/index.js"),
    // Persiapan untuk service worker, bisa diaktifkan nanti
    // sw: path.resolve(__dirname, "src/js/sw.js"),
  },
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist"),
    clean: true, // Fitur bawaan Webpack 5 untuk membersihkan folder dist
  },
  module: {
    rules: [
      {
        // Aturan untuk memproses file JavaScript dengan Babel
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
      {
        // Aturan untuk memproses file gambar
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: "asset/resource",
        generator: {
          filename: "assets/images/[hash][ext]",
        },
      },
      {
        // PENAMBAHAN: Aturan untuk file audio
        test: /\.(mp3|ogg|wav)$/i,
        type: "asset/resource",
        generator: {
          filename: "assets/audio/[hash][ext]",
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "src/index.html"),
      // excludeChunks: ["sw"], // Baris ini diperlukan jika Anda mengaktifkan entry 'sw'
    }),
    
  ],
};
