import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store.ts";
import NotificationProvider from "./components/Notification/NotificationProvider.tsx";
import { DarkThemeProvider } from "./hooks/useDarkTheme.tsx";
import { DialogProvider } from "./components/Dialog/Dialog.tsx";
import PrintableMusiScoreProvider from "./components/PrintableMusicScore/PrintableMusicScore.tsx";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <DarkThemeProvider>
      <Provider store={store}>
        <PrintableMusiScoreProvider>
          <NotificationProvider>
            <DialogProvider>
              <BrowserRouter>
                <App />
              </BrowserRouter>
            </DialogProvider>
          </NotificationProvider>
        </PrintableMusiScoreProvider>
      </Provider>
    </DarkThemeProvider>
  </React.StrictMode>
);
