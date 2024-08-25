const path = require("path");
const createExpoWebpackConfigAsync = require("@expo/webpack-config");

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);

  config.resolve.alias = {
    ...config.resolve.alias,

    // Set up aliases so the web versions are used (Rather than changing imports in each file)
    "react-native": "react-native-web",
    "react-native-webview": "react-native-web-webview",
    "react-native/Libraries/Utilities/codegenNativeComponent": path.resolve(
      __dirname,
      "node_modules/react-native-web-webview/shim.js"
    ),
  };

  config.resolve.fallback = {
    ...config.resolve.fallback,
    "react-native/Libraries/Utilities/codegenNativeComponent": path.resolve(
      __dirname,
      "node_modules/react-native-web-webview/shim.js"
    ),
  };

  // Prevents crypto build error
  config.resolve.fallback = {
    ...config.resolve.fallback,
    crypto: require.resolve("expo-crypto"),
  };

  return config;
};
