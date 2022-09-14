
const autoprefixer = require('autoprefixer');
const pxtorem = require('postcss-pxtorem');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin') // 去掉注释
const path = require('path');
const isProduction = process.env.NODE_ENV === 'production';

//定义resolve方法，把相对路径转换成绝对路径
const resolve = dir => path.join(__dirname, dir)
// externals
const externals = {
  vue: 'Vue',
  'vue-router': 'VueRouter',
  vuex: 'Vuex',
  vant: 'vant',
  axios: 'axios'
}
module.exports = {
  outputDir: 'dist',
  publicPath: './',
  productionSourceMap: false,
  chainWebpack: config => {
    // 添加别名
    config.resolve.alias
      .set('@', resolve('src'))
      .set('assets', resolve('src/assets'))
      .set('api', resolve('src/api'))
      .set('views', resolve('src/views'))
      .set('components', resolve('src/components'))
  //   // ============压缩图片 end============
  },
  configureWebpack: config => {
    // 公共代码抽离
    config.optimization = {
      splitChunks: {
        cacheGroups: {
          vendor: {
            chunks: 'all',
            test: /node_modules/,
            name: 'vendor',
            minChunks: 1,
            maxInitialRequests: 5,
            minSize: 0,
            priority: 100
          },
          common: {
            chunks: 'all',
            test: /[\\/]src[\\/]js[\\/]/,
            name: 'common',
            minChunks: 2,
            maxInitialRequests: 5,
            minSize: 0,
            priority: 60
          },
          styles: {
            name: 'styles',
            test: /\.(sa|sc|c)ss$/,
            chunks: 'all',
            enforce: true
          },
          runtimeChunk: {
            name: 'manifest'
          }
        }
      }
    }

    // 为生产环境修改配置...
    if (isProduction) {
      // externals
      config.externals = externals
    }

    const plugins = [];

    if (isProduction) {
      plugins.push(
        new UglifyJsPlugin({
          uglifyOptions: {
            output: {
              comments: false, // 去掉注释
            },
            warnings: false,
            compress: {
              drop_console: true,
              drop_debugger: false,
              pure_funcs: ['console.log']//移除console
            }
          }
        })
      )
    }
  },
  devServer: {
    // open:true,
    host: 'localhost',
    port: '8080',
    https: false,
    // hostOnly:false,
    proxy: {
      '/api': {
        target: 'https://5566.com/api/',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''

        }
      }
    }
  },
  css: {
    loaderOptions: {
      postcss: {
        plugins: [
          autoprefixer(),
          pxtorem({
            rootValue: 37.5,
            propList: ['*']
          })
        ]
      }
    }
  },

};
//3.7
//1.2
//1.1
//1.1

//项目中分别有a.js, b.js, page1.js, page2.js这四个JS文件， page1.js 和 page2.js中同时都引用了a.js, b.js， 这时候想把a.js, b.js抽离出来合并成一个公共的js，然后在page1, page2中自动引入这个公共的js，怎么配置呢？如下： 


