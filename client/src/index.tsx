import React from "react";
import ReactDOM from "react-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { MantineProvider } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { socket, SocketContext } from "./socket";
import "semantic-ui-css/semantic.min.css";
import "./styles.css";
// 导入i18n配置
import "./i18n/config";

// 添加process全局变量以修复"process is not defined"错误
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
if (typeof window !== 'undefined' && !window.process) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  window.process = { 
    env: { 
      NODE_ENV: 'development',
      PUBLIC_URL: ''
    } 
  };
}

const queryClient = new QueryClient();

ReactDOM.render(
  <React.StrictMode>
    <SocketContext.Provider value={socket}>
      <QueryClientProvider client={queryClient}>
        <MantineProvider>
          <NotificationsProvider position="top-right">
            <App />
          </NotificationsProvider>
        </MantineProvider>
      </QueryClientProvider>
    </SocketContext.Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
