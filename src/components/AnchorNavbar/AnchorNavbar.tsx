import "./AnchorNavbar.scss";
import cn from "classnames";
import HamburgerDropdown from "../HamburgerDropdown/HamburgerDropdown";
import useViewportInfo from "../../hooks/useViewportInfo";

interface AnchorNavbarProps extends React.HTMLAttributes<HTMLElement> {
  links: RefLink[];
}

export interface RefLink {
  label: string;
  ref: React.RefObject<HTMLDivElement>;
}

export const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
  if (ref.current) {
    ref.current.scrollIntoView({ behavior: "smooth" });
  }
};

export default function AnchorNavbar({ links, className, children, ...rest }: AnchorNavbarProps) {
  const { sizeID } = useViewportInfo();
  return (
    <nav className={cn(className, "AnchorNavbar")} {...rest}>
      {children}
      {sizeID > 1 ? (
        links.map((link) => (
          <div className="navbar-link" key={link.label} onClick={() => scrollToSection(link.ref)}>
            {link.label}
          </div>
        ))
      ) : (
        <HamburgerDropdown links={links} />
      )}
    </nav>
  );
}
