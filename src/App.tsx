import HomeView from "./views/HomeView/HomeView";
import AppView from "./views/AppView/AppView";
import { Routes, Route } from "react-router-dom";
import CaptureView from "./views/AppView/CaptureView/CaptureView";
import PlaygroundView from "./views/AppView/PlaygroundView/PlaygroundView";
import UserAccountView from "./views/AppView/UserAccountView/UserAccountView";
import NewVariationView from "./views/AppView/PlaygroundView/NewVariationView/NewVariationView";
import RecordingSettingsView from "./views/AppView/PlaygroundView/RecordingSettingsView/RecordingSettingsView";
import UserFeedbackView from "./views/AppView/UserFeedbackView/UserFeedbackView";

export default function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<HomeView />} />
        <Route path="/app" element={<AppView />}>
          <Route index element={<CaptureView />} />
          <Route path="play">
            <Route index element={<PlaygroundView />} />
            <Route path="recordings/:id" element={<NewVariationView />} />
            <Route path="recordings/:id/edit" element={<RecordingSettingsView />} />
          </Route>
          <Route path="dashboard" element={<UserAccountView />} />
          <Route path="feedback" element={<UserFeedbackView />} />
        </Route>
      </Routes>
    </div>
  );
}
