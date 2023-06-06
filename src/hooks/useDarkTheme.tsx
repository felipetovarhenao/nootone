import { createContext, useState, useContext, ReactNode } from "react";

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
  };

  const contextValue: DarkThemeContextType = {
    darkTheme,
    toggleDarkTheme,
  };

  return <DarkThemeContext.Provider value={contextValue}>{children}</DarkThemeContext.Provider>;
}

export const useDarkTheme = () => useContext(DarkThemeContext);
