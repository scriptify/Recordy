var path = require('path'),
webpack = require('webpack'), // Da bundling modules!
NpmInstallPlugin = require('npm-install-webpack-plugin'), // Install client dependencies automatically!
merge = require('webpack-merge'); // Merge together configurations!

const PATHS = {
  js: path.join(__dirname, './js/'),
  build: path.join(__dirname, './build')
};

const TARGET = process.env.npm_lifecycle_event;

const COMMON_CONFIGURATION = {
  entry: {
    app: PATHS.js
  },
  resolve: {
    extensions: ['', '.js'], // Resolve these extensions
  },
  output: {
    path: PATHS.build,
    filename: 'bundle.js',
    libraryTarget: 'umd',
    library: 'EffectUnit'
  },
  module: {
    loaders: [
      {
       test: /\.js$/,
       loaders: ['babel?cacheDirectory'],
       include: PATHS.js
      }
    ]
  }
};

switch(TARGET) {
  // Which procedure was started?
  default:
  case 'start:dev': {
    module.exports = merge(COMMON_CONFIGURATION, {
      devServer: {
        contentBase: PATHS.build,
        historyApiFallback: true,
        hot: true,
        inline: true,
        progress: true,
        stats: 'errors-only'
      },
      plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new NpmInstallPlugin({
          save: true
        })
      ],
      devtool: 'eval-source-map'
    });
  }
  break;
  case 'start:prod': {
    module.exports = merge(COMMON_CONFIGURATION, {
      plugins: [
        new webpack.DefinePlugin({
          'process.env': {
            'NODE_ENV': JSON.stringify('production')
          }
        }),
        new webpack.optimize.UglifyJsPlugin({
          compress: { warnings: false }
        }),
        new webpack.optimize.DedupePlugin()
      ]
    });
  }
}
