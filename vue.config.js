const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: process.env.NODE_ENV === 'production' ? '/GitTaskBench/' : '/',
  devServer: {
    port: 8080,
    open: true
  },
  css: {
    loaderOptions: {
      css: {
        sourceMap: process.env.NODE_ENV !== 'production'
      }
    }
  }
})
