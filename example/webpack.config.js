const createExpoWebpackConfigAsync = require("@expo/webpack-config");

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);

  config.resolve.alias = {
    ...config.resolve.alias,

    // Set up aliases so the web versions are used (Rather than changing imports in each file)
    "react-native": "react-native-web",
    "react-native-webview": "react-native-web-webview",
  };

  return config;
};
