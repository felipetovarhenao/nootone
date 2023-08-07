import HomeView from "./views/HomeView/HomeView";
import AppView from "./views/AppView/AppView";
import { Routes, Route, useLocation } from "react-router-dom";
import CaptureView from "./views/AppView/CaptureView/CaptureView";
import PlayView from "./views/AppView/PlayView/PlayView";
import UserAccountView from "./views/AppView/UserAccountView/UserAccountView";
import DevelopView from "./views/AppView/PlayView/DevelopView/DevelopView";
import RecordingSettingsView from "./views/AppView/PlayView/RecordingSettingsView/RecordingSettingsView";
import UserFeedbackView from "./views/AppView/UserFeedbackView/UserFeedbackView";
import BetaLogin from "./layouts/BetaLogin/BetaLogin";
import ReactGA from "react-ga";
import { useEffect } from "react";
import CONFIG, { DeploymentType } from "./utils/config";

export default function App() {
  ReactGA.initialize("UA-000000-01", {
    debug: CONFIG.deploymentType === DeploymentType.DEV,
    titleCase: false,
  });

  const location = useLocation();

  useEffect(() => {
    ReactGA.pageview(location.pathname + location.search + location.hash);
  }, [location]);

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<HomeView />} />
        <Route path="/app" element={<AppView />}>
          <Route index element={<CaptureView />} />
          <Route path="sketches">
            <Route index element={<PlayView />} />
            <Route path=":id/develop" element={<DevelopView />} />
            <Route path=":id/edit" element={<RecordingSettingsView />} />
          </Route>
          <Route path="dashboard" element={<UserAccountView />} />
          <Route path="feedback" element={<UserFeedbackView />} />
        </Route>
        <Route path="/beta-login" element={<BetaLogin />} />
      </Routes>
    </div>
  );
}
