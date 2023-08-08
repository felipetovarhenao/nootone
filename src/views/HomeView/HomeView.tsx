import "./HomeView.scss";
import AnchorNavbar from "../../components/AnchorNavbar/AnchorNavbar";
import { useRef } from "react";
import Logo from "../../components/Logo/Logo";
import AppName from "../../components/AppName/AppName";
import cn from "classnames";

import useScrollPosition from "../../hooks/useScrollPosition";

import TeamAnchor from "./TeamAnchor/TeamAnchor";
import ContactAnchor from "./ContactAnchor/ContactAnchor";
import AboutAnchor from "./AboutAnchor/AboutAnchor";

const HomeView: React.FC = () => {
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
      label: "Sign up",
      ref: contactRef,
    },
    {
      label: "Team",
      ref: teamRef,
    },
  ];

  return (
    <div className={cn("HomeView", { scrolled: scrollPosition.y > 100 })}>
      <AnchorNavbar className="navbar" links={sections}>
        <div className="brand">
          <Logo className="logo" />
          <AppName className="name" />
        </div>
      </AnchorNavbar>
      <div className="content">
        <AboutAnchor ref={aboutRef} />
        <ContactAnchor ref={contactRef} />
        <TeamAnchor ref={teamRef} />
        <footer className="footer">{new Date().getFullYear()} © nootone.io</footer>
      </div>
    </div>
  );
};

export default HomeView;
