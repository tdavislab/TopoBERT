module.exports = {
  lintOnSave: false,
  // configureWebpack: {
  //   devServer: {
  //     watchOptions: {
  //       ignored: ['**/node_modules/', '**/public/'],
  //     }
  //   }
  // },
  chainWebpack: (config) => {
    config.plugin("copy").tap(([options]) => {
      options[0].ignore.push("**/*");
      return [options];
    });
  },
}