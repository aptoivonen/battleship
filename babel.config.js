module.exports = {
  presets: ["@babel/preset-env"],
  plugins: ["@babel/plugin-transform-runtime"],
  env: {
    test: {
      plugins: ["transform-es2015-modules-commonjs"],
    },
  },
};