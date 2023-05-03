import "./App.scss";
import logo from "./assets/logo.png";
import AppName from "./components/AppName/AppName";

export default function App() {
  return (
    <div className="App dark">
      <div className="app-banner">
        <div className="app-header">
          <img className="app-logo" src={logo} alt="nootone-logo" />
          <AppName size={"50px"} />
        </div>
        <h2 className="app-subheader">spark your creativity</h2>
      </div>
      <div className="app-info">
        <span id="uvp">
          <AppName /> is a smart music sketchbook that helps you record and develop musical ideas in seconds.
        </span>
        <span id="coming-soon">If you're interested, stay tuned. More coming soon!</span>
      </div>
      <footer className="footer">
        <a href="https://www.flaticon.com/free-icons/sound" title="sound icons">
          Sound icons created by Freepik - Flaticon
        </a>
      </footer>
    </div>
  );
}
