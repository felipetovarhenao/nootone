import HomeView from "./views/HomeView/HomeView";
import AppView from "./views/AppView/AppView";
import { Routes, Route } from "react-router-dom";
import DevView from "./views/DevView/DevView";

export default function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<HomeView />} />
        <Route path="/app" element={<AppView />} />
        <Route path="/dev" element={<DevView />} />
      </Routes>
    </div>
  );
}
