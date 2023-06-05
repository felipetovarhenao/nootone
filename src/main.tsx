import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { HashRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store.ts";
import NotificationProvider from "./components/Notification/NotificationProvider.tsx";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <NotificationProvider>
        <HashRouter>
          <App />
        </HashRouter>
      </NotificationProvider>
    </Provider>
  </React.StrictMode>
);
