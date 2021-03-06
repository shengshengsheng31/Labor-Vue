module.exports = {
  css: {
    extract: false
  },
  // presets: [
  //   ['@vue/app', {
  //     useBuiltIns: 'entry'
  //   }]
  // ],
  chainWebpack: config => {
    // 发布模式
    config.when(process.env.NODE_ENV === 'production', config => {
      config.entry('app').clear().add('@/main-prod.js')
      // cdn加载
      // config.set('externals', {
      //   vue: 'Vue',
      //   'vue-router': 'VueRouter',
      //   axios: 'axios',
      //   lodash: '_',
      //   echarts: 'echarts',
      //   nprogress: 'NProgress',
      //   'vue-quill-editor': 'VueQuillEditor'
      // })

      // 定制
      config.plugin('html').tap(args => {
        args[0].isProd = true
        return args
      })
    })
    // 开发模式
    config.when(process.env.NODE_ENV === 'development', config => {
      config.entry('app').clear().add('@/main-dev.js')

      // 定制
      config.plugin('html').tap(args => {
        args[0].isProd = false
        return args
      })
    })
  }
}
