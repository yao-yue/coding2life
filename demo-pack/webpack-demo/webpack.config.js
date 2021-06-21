const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: 'development',
  entry: {
    index: "./src/index.js",
    print: "./src/print.js",
  },
  devtool: 'inline-source-map',
  devServer: {
    //配置告知 webpack-dev-server，将 dist 目录下的文件 serve 到 localhost:8080 下
    contentBase: './dist',
  },
  plugins: [
    new HtmlWebpackPlugin({
      // 这里可以将页面的title修改
      title: 'Development',
    }),
  ],
  output: {
    //动态输出
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
    publicPath: '/',
  },
};
