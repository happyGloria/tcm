'use strict'
const path = require('path')
const utils = require('./utils')
const config = require('../config')
const { VueLoaderPlugin } = require('vue-loader')
const vueLoaderConfig = require('./vue-loader.conf')
var SpritesmithPlugin = require('webpack-spritesmith')
function resolve(dir) {
  return path.join(__dirname, '..', dir)
}

const createLintingRule = () => ({
  test: /\.(js|vue)$/,
  loader: 'eslint-loader',
  enforce: 'pre',
  include: [resolve('src'), resolve('test')],
  options: {
    formatter: require('eslint-friendly-formatter'),
    emitWarning: !config.dev.showEslintErrorsInOverlay
  }
})

module.exports = {
  context: path.resolve(__dirname, '../'),
  entry: {
    // app: './src/main.js'
    app: ["babel-polyfill", "./src/main.js"]
  },
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath:
      process.env.NODE_ENV === 'production'
        ? config.build.assetsPublicPath
        : config.dev.assetsPublicPath
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      '@': resolve('src'),
      '~': resolve('src/pages'),
      'static': resolve('static'),
      '@assets': resolve('src/assets'),
      '@less': resolve('src/less')
    }
  },
  externals: {
    '$': 'window.jQuery',
    'jQuery': 'window.jQuery',
    'vue': 'Vue',
    'vuex': 'Vuex',
    'vue-router': 'VueRouter',
    'axios': 'axios'
  },
  module: {
    rules: [
      ...(config.dev.useEslint ? [createLintingRule()] : []),
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.js$/,
        loader: 'babel-loader?cacheDirectory',
        include: [
          resolve('src'),
          resolve('test'),
          resolve('node_modules/vue-particles'),
          resolve('node_modules/particles.js/particles.js'),
          resolve('node_modules/webpack-dev-server/client')
        ]
      },
      {
        test: /\.svg$/,
        loader: 'svg-sprite-loader',
        include: [resolve('src/icons')],
        options: {
          symbolId: 'icon-[name]'
        }
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        exclude: [resolve('src/icons')],
        options: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('media/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new SpritesmithPlugin({
      // 目标小图标
      src: {
        cwd: resolve('src/assets/pic'),
        glob: '*.png'
      },
      // 输出雪碧图文件及样式文件
      target: {
        image: resolve('static/img/sprite.png'),
        css: [
          [
            resolve('static/img/sprite.css'), {
              format: 'tpl'
            }
          ]
        ]
      },
      customTemplates: {
        'tpl': function (data) {
          var shared = '.ico { display: inline-block; background: url(I) no-repeat -1000% -1000%;  }'
            .replace('I', data.sprites[0].image)

          var perSprite = data.sprites.map(function (sprite) {
            return '.ico-N { width: Wpx; height: Hpx; background-position: Xpx Ypx; }'
              .replace('N', sprite.name)
              .replace('W', sprite.width)
              .replace('H', sprite.height)
              .replace('X', sprite.offset_x)
              .replace('Y', sprite.offset_y)
          }).join('\n')

          return shared + '\n' + perSprite
        }
      },
      // 样式文件中调用雪碧图地址写法
      apiOptions: {
        cssImageRef: '/static/img/sprite.png'
      },
      spritesmithOptions: {
        algorithm: 'binary-tree'
      }
    })
  ],
  node: {
    // prevent webpack from injecting useless setImmediate polyfill because Vue
    // source contains it (although only uses it if it's native).
    setImmediate: false,
    // prevent webpack from injecting mocks to Node native modules
    // that does not make sense for the client
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
  }
}
