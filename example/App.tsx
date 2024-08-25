import {
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";
import { RichText, Toolbar, useEditorBridge } from "@10play/tentap-editor";
import { WebToolbar } from "./src/WebToolbar";
import { useEffect } from "react";

const App = () => {
  const editor = useEditorBridge({
    autofocus: true,
    avoidIosKeyboard: true,
    initialContent,
  });

  useEffect(() => {
    setTimeout(() => {
      if (Platform.OS === "web") {
        editor.injectJS(`
          window.ReactNativeWebView = { postMessage: (...args) => window.parent.postMessage(args[0])}
        `);
      }
    }, 100);
  }, []);

  if (Platform.OS !== "web") {
    return (
      <SafeAreaView style={exampleStyles.fullScreen}>
        <RichText editor={editor} />
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={exampleStyles.keyboardAvoidingView}
        >
          <Toolbar editor={editor} />
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={exampleStyles.fullScreen}>
      <WebToolbar editor={editor} />
      <RichText editor={editor} />
    </SafeAreaView>
  );
};

const exampleStyles = StyleSheet.create({
  fullScreen: {
    flex: 1,
  },
  keyboardAvoidingView: {
    position: "absolute",
    width: "100%",
    bottom: 0,
  },
});

const initialContent = `<p>This is a basic example!</p>`;

export default App;