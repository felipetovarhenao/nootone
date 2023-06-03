import HomeView from "./views/HomeView/HomeView";
import AppView from "./views/AppView/AppView";
import { Routes, Route } from "react-router-dom";
import DevView from "./views/DevView/DevView";
import RecordView from "./views/AppView/RecordView/RecordView";
import PlaygroundView from "./views/AppView/PlaygroundView/PlaygroundView";
import UserAccountView from "./views/AppView/UserAccountView/UserAccountView";

export default function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<HomeView />} />
        <Route path="/dev" element={<DevView />} />
        <Route path="/app" element={<AppView />}>
          <Route index element={<RecordView />} />
          <Route path="playground" element={<PlaygroundView />} />
          <Route path="dashboard" element={<UserAccountView />} />
        </Route>
      </Routes>
    </div>
  );
}
