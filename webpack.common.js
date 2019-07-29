// eslint-disable
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const SVGSpritemapPlugin = require('svg-spritemap-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;


const root = path.resolve(__dirname);
const src = path.resolve(root, 'src');
const legacy = path.resolve(root, 'modules');
const dist = path.resolve(root, 'dist');


function commonConfig({ nodeEnv }) {
  return {
    context: root,
    entry: {
      app: ['isomorphic-fetch', '@babel/polyfill', './src/index.js']
    },
    output: {
      filename: '[name].bundle.js',
      chunkFilename: '[name].bundle.js',
      publicPath: '/',
      path: dist
    },
    resolve: {
      extensions: ['.js', '.jsx'],
      modules: ['./node_modules'],
      alias: {
        react: path.resolve('./node_modules/react'),
        ['react-dom']: path.resolve('./node_modules/react-dom')
      }
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          include: [
            src,
            legacy
          ],
          use: 'babel-loader'
        },
        {
          test: /\.scss$/,
          include: [
            src,
            legacy
          ],
          use: [
            {
              loader: MiniCssExtractPlugin.loader
            },
            {
              loader: 'css-loader',
              options: {
                // Todo: eventually turn on modules: true
                // For now we explicitly tell classnames to be local
                localIdentName: '[name]__[local]--[hash:base64:5]',
                url: false // Disable URL parsing in css for now
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                plugins: (loader) => [
                  require('autoprefixer')({ browsers: ['last 3 versions'] })
                ]
              }
            },
            {
              loader: 'sass-loader'
            }
          ]
        },
        {
          test: /\.html$/,
          include: [
            src,
            legacy
          ],
          use: 'html-loader'
        },
        {
          test: /\.svg$/,
          use: [
            {
              loader: '@svgr/webpack',
              options: {
                svgo: {
                  plugins: [
                    { removeViewBox: false },
                    { removeDimensions: true },
                    { removeDoctype: true },
                    { removeComments: true },
                    { removeMetadata: true },
                    { removeEditorsNSData: true },
                    { cleanupIDs: true },
                    { removeRasterImages: true },
                    { removeUselessDefs: true },
                    { removeUnknownsAndDefaults: true },
                    { removeUselessStrokeAndFill: true },
                    { removeHiddenElems: true },
                    { removeEmptyText: true },
                    { removeEmptyAttrs: true },
                    { removeEmptyContainers: true },
                    { removeUnusedNS: true },
                    { removeDesc: true },
                    { prefixIds: true }
                  ]
                }
              }
            },
            'url-loader'
          ],
        },
        {
          test: /\.(png|svg|cur)$/,
          include: [
            legacy
          ],
          use: [{
            loader: 'file-loader',
            options: {
              outputPath: 'assets/'
            }
          }]
        },
      ]
    },
    plugins: [
      new CleanWebpackPlugin([dist]),
      new SVGSpritemapPlugin(['src/shared/assets/icons/**/*.svg'], {
        output: {
          filename: 'sprite.svg',
          chunk: {
            name: 'sprite'
          },
          svgo: {
            plugins: [
              { removeXMLNS: true },
              { removeViewBox: false },
              { removeDimensions: true },
              { removeDoctype: true },
              { removeComments: true },
              { removeMetadata: true },
              { removeEditorsNSData: true },
              { cleanupIDs: true },
              { removeRasterImages: true },
              { removeUselessDefs: true },
              { removeUnknownsAndDefaults: true },
              { removeUselessStrokeAndFill: true },
              { removeHiddenElems: true },
              { removeEmptyText: true },
              { removeEmptyAttrs: true },
              { removeEmptyContainers: true },
              { removeUnusedNS: true },
              { removeDesc: true },
              { prefixIds: true }
            ]
          }
        },
        styles: {
          filename: path.join(__dirname, 'src/shared/styles/config/mixins/_sprites.scss')
        }
      }),
      new OptimizeCssAssetsPlugin({
        cssProcessor: require('cssnano'),
        cssProcessorPluginOptions: {
          preset: ['default', { svgo: { exclude: true } }]
        },
        canPrint: true
      }),
      new CopyWebpackPlugin([
        { from: './public/', to: './assets/' },
        { from: './public/static/', to: './' },
        // Simply copy the leaflet styling for now
        { from: './node_modules/leaflet/dist/leaflet.css' },
        { from: './node_modules/leaflet-draw/dist/leaflet.draw.css' },
        { from: './node_modules/bbga_visualisatie_d3/bbga.css' },

        // Dumb copy of all assets for now
        // All root assets files
        {
          context: 'modules/shared/assets',
          from: '*',
          to: 'assets'
        },
        // All assets in sub folders
        {
          context: 'modules/shared/assets',
          from: '**/*',
          to: 'assets'
        },
        { from: './node_modules/bbga_visualisatie_d3/liberation-sans.eot' },
        { from: './node_modules/bbga_visualisatie_d3/liberation-sans.woff2' },
        { from: './node_modules/bbga_visualisatie_d3/liberation-sans.woff' },
        { from: './node_modules/bbga_visualisatie_d3/liberation-sans.ttf' },
        { from: './node_modules/bbga_visualisatie_d3/liberation-sans.svg' }
      ]),
      new BundleAnalyzerPlugin(),
      new HtmlWebpackPlugin({
        inject: false,
        template: './index.ejs',
        minify: {
          collapseWhitespace: nodeEnv === 'production' || nodeEnv === 'acceptance'
        },
        lang: 'nl',
        title: 'Dataportaal',
        favicon: './favicon.png',
        links: [
          {
            href: '/3680cf49-2b05-4b8a-af28-fa9e27d2bed0.css',
            rel: 'stylesheet'
          },
          {
            href: '/leaflet.css',
            rel: 'stylesheet'
          },
          {
            href: '/leaflet.draw.css',
            rel: 'stylesheet'
          },
          {
            href: '/bbga.css',
            rel: 'stylesheet'
          }
        ],
        scripts: [
          '/mtiFontTrackingCode.js'
        ]
      })
    ]
  };
}

module.exports = {
  commonConfig,
  root,
  src,
  legacy,
  dist
};
