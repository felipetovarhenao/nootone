import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { HashRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store.ts";
import NotificationProvider from "./components/Notification/NotificationProvider.tsx";
import { DarkThemeProvider } from "./hooks/useDarkTheme.tsx";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <DarkThemeProvider>
      <Provider store={store}>
        <NotificationProvider>
          <HashRouter>
            <App />
          </HashRouter>
        </NotificationProvider>
      </Provider>
    </DarkThemeProvider>
  </React.StrictMode>
);
