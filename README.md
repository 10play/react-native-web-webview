# react-native-web-webview

React Native Web implementation of React Native WebView

Based on https://github.com/react-native-web-community/react-native-web-webview

# react-native-web-webview

> React Native for Web implementation of RN's WebView

## Getting started

Full Guide: https://10play.github.io/10tap-editor/docs/setup/expoWeb

Installing

```
yarn add @10play/react-native-web-webview
```

The package provides the same functionality as react-native-webview, however, it works when exported as a web project.
To continue using the same imports that you do with non-web exports, you you configure an alias in your webpack config so that it resolves to the correct package.

```js
resolve: {
    alias: {
        'react-native': 'react-native-web',
        ...
        'react-native-webview': '@10play/react-native-web-webview',
    }
}
```

## With Expo + Metro
Create config file if not already npx expo customize metro.config.js

Into your metro.config.js add the following configuration
```
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

const webAliases = {
  'react-native': 'react-native-web',
  'react-native-webview': '@10play/react-native-web-webview',
  'react-native/Libraries/Utilities/codegenNativeComponent':
    '@10play/react-native-web-webview/shim',
  'crypto': 'expo-crypto',
};

config.resolver.resolveRequest = (
  context,
  realModuleName,
  platform,
  moduleName
) => {
  if (platform === 'web') {
    const alias = webAliases[realModuleName];
    if (alias) {
      return {
        filePath: require.resolve(alias),
        type: 'sourceFile',
      };
    }
  }
  return context.resolveRequest(context, realModuleName, platform, moduleName);
};

module.exports = config;
```

## With Expo + Webpack

When using Expo, you will need to add a webpack file that will be used for web builds in order to add the above code.
The following command will create the file in the way expected by Expo and will also install the **@expo/webpack-config** dependency which is necessary.

```$
npx expo customize webpack.config.js
```

If you haven't set up Expo to export web projects at all, you will need to install the following dependencies.

```
npx expo install react-native-web react-dom
```

Below is an example implementation of **webpack.config.js** in an expo project.

```js
const createExpoWebpackConfigAsync = require("@expo/webpack-config");

///////
// NOTE: Webpack is only used for bundling web
///////

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);

  config.resolve.alias = {
    ...config.resolve.alias,

    "react-native": "react-native-web",
    "react-native-webview": "@10play/react-native-web-webview",
  };

  return config;
};
```


