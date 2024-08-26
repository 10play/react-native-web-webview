import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  type ReactEventHandler,
} from "react";
import { StyleSheet } from "react-native";
import WebView, { type WebViewProps } from "react-native-webview";
import type { WebViewSourceHtml } from "react-native-webview/lib/WebViewTypes";
import { replaceLast } from "./utils";

interface WebWebviewProps extends WebViewProps {
  title?: string;
}

// This js adds a postMessage function to the webview
const DEFAULT_INJECT_JS = `window.ReactNativeWebView = { postMessage: (...args) => window.parent.postMessage(args[0])}`;

export const WebWebView = forwardRef<WebView, WebWebviewProps>((props, ref) => {
  const { title, source, onLoad, scrollEnabled, style } = props;
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const styleObj = StyleSheet.flatten(style);

  // Get iframe source
  const _source = useMemo(() => {
    // TODO: support other source types
    if (!source) return undefined;
    // TODO: support base url
    if ((source as WebViewSourceHtml).html) {
      const pageHtml = (source as WebViewSourceHtml).html;
      // Inject javascript
      const jsToInject = `${DEFAULT_INJECT_JS} ${
        props.injectedJavaScript ?? ""
      } ${props.injectedJavaScriptBeforeContentLoaded ?? ""}`;
      return replaceLast(
        pageHtml,
        "</body>",
        `<script>${jsToInject}</script></body>`
      );
    }
    return undefined;
  }, []);

  // Initialize ref - most functions here are mocked - we should implement them
  useImperativeHandle(
    ref,
    () =>
      ({
        goBack: () => {
          iframeRef.current?.contentWindow?.history.back();
        },
        goForward: () => {
          iframeRef.current?.contentWindow?.history.forward();
        },
        reload: () => {
          iframeRef.current?.contentWindow?.location.reload();
        },
        stopLoading: () => {
          iframeRef.current?.contentWindow?.stop();
        },
        injectJavaScript: (js: string) => {
          // @ts-ignore
          iframeRef.current?.contentWindow?.Function(js)();
        },
        forceUpdate: () => {},
        postMessage: (message: string, origin: string) => {
          iframeRef.current?.contentWindow?.postMessage(message, origin);
        },
        clearCache: () => {},
        requestFocus: () => {
          iframeRef.current?.contentWindow?.focus();
        },
        clearHistory: () => {},
        clearFormData: () => {},
      } as unknown as WebView)
  );

  useEffect(() => {
    // Listen for messages
    if (!props.onMessage) return;
    const onMessage = (nativeEvent: MessageEvent) => {
      // @ts-ignore
      return props.onMessage({ nativeEvent });
    };
    window.addEventListener("message", onMessage, true);
    return () => {
      window.removeEventListener("message", onMessage, true);
    };
  }, []);

  return (
    <iframe
      title={title}
      ref={iframeRef}
      srcDoc={_source}
      width={styleObj.width?.toString()}
      height={styleObj.height?.toString()}
      style={
        StyleSheet.flatten([
          styles.iframe,
          !scrollEnabled && styles.noScroll,
          style,
        ]) as React.CSSProperties
      }
      allowFullScreen
      seamless
      onLoad={onLoad as unknown as ReactEventHandler<HTMLIFrameElement>}
    />
  );
});

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  iframe: {
    width: "100%",
    height: "100%",
    borderWidth: 0,
  },
  noScroll: {
    overflow: "hidden",
  },
});
