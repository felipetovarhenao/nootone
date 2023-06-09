import HomeView from "./views/HomeView/HomeView";
import AppView from "./views/AppView/AppView";
import { Routes, Route } from "react-router-dom";
import CaptureView from "./views/AppView/CaptureView/CaptureView";
import PlaygroundView from "./views/AppView/PlaygroundView/PlaygroundView";
import UserAccountView from "./views/AppView/UserAccountView/UserAccountView";
import NewVariationView from "./views/AppView/PlaygroundView/NewVariationView/NewVariationView";
import RecordingSettingsView from "./views/AppView/PlaygroundView/RecordingSettingsView/RecordingSettingsView";

export default function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<HomeView />} />
        <Route path="/app" element={<AppView />}>
          <Route index element={<CaptureView />} />
          <Route path="playground">
            <Route index element={<PlaygroundView />} />
            <Route path="recordings/:id" element={<NewVariationView />} />
            <Route path="recordings/:id/edit" element={<RecordingSettingsView />} />
          </Route>
          <Route path="dashboard" element={<UserAccountView />} />
        </Route>
      </Routes>
    </div>
  );
}
