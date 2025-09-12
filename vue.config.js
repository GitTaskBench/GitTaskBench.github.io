const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: process.env.NODE_ENV === 'production' ? '/GitTaskBench.github.io/' : '/',
  devServer: {
    port: 8080,
    open: true
  },
  outputDir: 'docs',
  css: {
    loaderOptions: {
      css: {
        sourceMap: process.env.NODE_ENV !== 'production'
      }
    }
  }
})
