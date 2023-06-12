import { createContext, useState, useContext, ReactNode, useEffect } from "react";

interface DarkThemeContextType {
  darkTheme: boolean;
  toggleDarkTheme: () => void;
}

const DarkThemeContext = createContext<DarkThemeContextType>({
  darkTheme: false,
  toggleDarkTheme: () => {},
});

export function DarkThemeProvider({ children }: { children: ReactNode }) {
  const [darkTheme, setDarkTheme] = useState(false);

  const toggleDarkTheme = () => {
    setDarkTheme((prevTheme) => !prevTheme);
    localStorage.setItem("dark-theme", JSON.stringify(!darkTheme));
  };

  useEffect(() => {
    const cache = localStorage.getItem("dark-theme");
    if (cache) {
      const parsedValue = JSON.parse(cache);
      if (typeof parsedValue === "boolean") {
        setDarkTheme(parsedValue);
      }
    }
  }, []);

  const contextValue: DarkThemeContextType = {
    darkTheme,
    toggleDarkTheme,
  };

  return <DarkThemeContext.Provider value={contextValue}>{children}</DarkThemeContext.Provider>;
}

export const useDarkTheme = () => useContext(DarkThemeContext);
