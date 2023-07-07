import "./HomeView.scss";
import AnchorNavbar from "../../components/AnchorNavbar/AnchorNavbar";
import { useRef, useState } from "react";
import logo from "../../assets/logo.png";
import AppName from "../../components/AppName/AppName";
import cn from "classnames";

import useScrollPosition from "../../hooks/useScrollPosition";

import TeamAnchor from "./TeamAnchor/TeamAnchor";
// import AboutAnchor from "./AboutAnchor/AboutAnchor";
import ContactAnchor from "./ContactAnchor/ContactAnchor";
import MainAnchor from "./MainAnchor/MainAnchor";

const HomeView: React.FC = () => {
  const [darkTheme, setDarkTheme] = useState(false);
  const aboutRef = useRef<HTMLDivElement>(null);
  const teamRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);

  const scrollPosition = useScrollPosition();

  const sections = [
    {
      label: "About",
      ref: aboutRef,
    },
    {
      label: "Team",
      ref: teamRef,
    },
    {
      label: "Contact",
      ref: contactRef,
    },
  ];

  return (
    <div className={cn("HomeView", { scrolled: scrollPosition.y > 100, dark: darkTheme })}>
      <AnchorNavbar className="navbar" links={sections}>
        <div className="brand">
          <img className="logo" src={logo} alt="nootone-logo" onClick={() => setDarkTheme((x) => !x)} />
          <AppName className="name" />
        </div>
      </AnchorNavbar>
      <div className="content">
        {/* <AboutAnchor ref={aboutRef} /> */}
        <MainAnchor ref={aboutRef} />
        <ContactAnchor ref={contactRef} />
        <TeamAnchor ref={teamRef} />
        <footer className="footer">Sound icons created by Freepik - Flaticon</footer>
      </div>
    </div>
  );
};

export default HomeView;
