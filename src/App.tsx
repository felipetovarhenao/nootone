import HomeView from "./views/HomeView/HomeView";
import AppView from "./views/AppView/AppView";
import { Routes, Route } from "react-router-dom";
import DevView from "./views/DevView/DevView";
import RecordView from "./views/AppView/RecordView/RecordView";
import ExportView from "./views/AppView/ExportView/ExportView";
import SettingsView from "./views/AppView/SettingsView/SettingsView";
import UserAccountView from "./views/AppView/UserAccountView/UserAccountView";

export default function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<HomeView />} />
        <Route path="/dev" element={<DevView />} />
        <Route path="/app" element={<AppView />}>
          <Route index element={<RecordView />} />
          <Route path="export" element={<ExportView />} />
          <Route path="settings" element={<SettingsView />} />
          <Route path="dashboard" element={<UserAccountView />} />
        </Route>
      </Routes>
    </div>
  );
}
