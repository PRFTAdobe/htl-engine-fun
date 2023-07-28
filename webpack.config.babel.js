/* eslint-disable import/no-extraneous-dependencies */
import path from 'path';
import freeportAsync from 'freeport-async';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import EslintWebpackPlugin from 'eslint-webpack-plugin';
import HtmlWebPackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import StyleLintPlugin from 'stylelint-webpack-plugin';
import webpack from 'webpack';

const sourceDirectory = path.join(process.cwd(), 'src');
const templatesDirectory = path.join(sourceDirectory, 'templates');
const distributionDirectory = path.join(process.cwd(), 'dist');

const webpackConfig = async (env, argv) => {
  const devServerPort = await freeportAsync(9000);
  return {
    context: sourceDirectory,
    devtool: argv.mode === 'production' ? false : 'source-map',
    stats: {
      colors: true,
    },
    entry: [path.resolve(sourceDirectory, './index.ts')],
    output: {
      path: distributionDirectory,
      filename: '[name].bundle.js',
      assetModuleFilename: 'assets/[name][ext]',
    },
    resolve: {
      extensions: ['.ts', '.js'],
      modules: [sourceDirectory, templatesDirectory, 'node_modules'],
      alias: {
        '@': sourceDirectory,
      },
      fallback: {
        assert: false,
        buffer: false,
        child_process: false,
        crypto: false,
        fs: false,
        http: false,
        https: false,
        os: false,
        path: false,
        querystring: false,
        stream: require.resolve('stream-browserify'),
        url: require.resolve('url/'),
        util: false,
        vm: require.resolve('vm-browserify'),
        zlib: false,
      },
    },
    module: {
      unknownContextCritical: false,
      rules: [
        {
          test: /\.(js|mjs|jsx|ts|tsx)$/,
          loader: 'babel-loader',
        },
        {
          test: /\.css$/,
          exclude: /node_modules/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
            },
            'css-loader',
            'postcss-loader',
          ],
        },
        {
          test: /site.webmanifest|favicon.ico/i,
          type: 'asset/resource',
          generator: {
            filename: 'assets/[name][ext]',
          },
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif|svg)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'assets/[name][ext]',
          },
        },
        {
          test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
          type: 'asset/resource',
          generator: {
            filename: 'fonts/[name][ext]',
          },
        },
        {
          test: /\.htl$/,
          use: [
            {
              loader: 'htl-template-loader',
              options: {
                templateRoot: 'src/templates',
              },
            },
          ],
        },
      ],
    },
    plugins: [
      new EslintWebpackPlugin({
        fix: true,
        failOnError: true,
      }),
      new HtmlWebPackPlugin({
        template: './index.html',
        filename: './index.html',
      }),
      new MiniCssExtractPlugin({
        filename: '[name].bundle.css',
      }),
      new StyleLintPlugin({
        files: ['**/*.{css}'],
      }),
      new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        openAnalyzer: false,
      }),
      new webpack.ProvidePlugin({
        process: 'process/browser',
        Buffer: ['buffer', 'Buffer'],
      }),
    ],
    devServer: {
      static: {
        directory: distributionDirectory,
      },
      compress: true,
      hot: true,
      port: devServerPort,
      watchFiles: {
        paths: [
          'src/**/*.json',
          'src/**/*.js',
          'src/**/*.ts',
          'src/**/*.css',
          'src/**/*.htl',
          'src/**/*.html',
        ],
      },
    },
  };
};

export default webpackConfig;
