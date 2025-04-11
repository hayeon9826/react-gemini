const path = require("path");
const dotenv = require("dotenv");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

// production 환경에서는 Vercel 환경 변수(process.env)가 이미 설정되어 있습니다.
// 필요하다면 로컬 .env 파일의 값과 결합할 수도 있습니다.
dotenv.config();

const envKeys = Object.keys(process.env).reduce((prev, next) => {
  prev[`process.env.${next}`] = JSON.stringify(process.env[next]);
  return prev;
}, {});

module.exports = {
  mode: process.env.NODE_ENV || "development",
  entry: "./src/index.tsx", // 진입점 파일을 tsx로 설정
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
    publicPath: "/", // 여기서 절대 경로를 지정
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
    fallback: {
      process: require.resolve("process/browser"),
    },
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: "babel-loader",
      },
      {
        test: /\.css$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              modules: true, // Module CSS 활성화
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
    new webpack.ProvidePlugin({
      process: "process/browser",
    }),
    new webpack.DefinePlugin(envKeys),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, "dist"),
    },
    compress: true,
    port: 8080,
    historyApiFallback: true,
    proxy: [
      {
        context: ["/api"],
        target: process.env.REACT_APP_SERVER_URL,
        secure: false,
        changeOrigin: true,
      },
    ],
  },
};
