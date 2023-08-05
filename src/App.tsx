import HomeView from "./views/HomeView/HomeView";
import AppView from "./views/AppView/AppView";
import { Routes, Route } from "react-router-dom";
import CaptureView from "./views/AppView/CaptureView/CaptureView";
import PlayView from "./views/AppView/PlayView/PlayView";
import UserAccountView from "./views/AppView/UserAccountView/UserAccountView";
import DevelopView from "./views/AppView/PlayView/DevelopView/DevelopView";
import RecordingSettingsView from "./views/AppView/PlayView/RecordingSettingsView/RecordingSettingsView";
import UserFeedbackView from "./views/AppView/UserFeedbackView/UserFeedbackView";
import BetaLogin from "./layouts/BetaLogin/BetaLogin";

export default function App() {
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
