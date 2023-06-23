import { createContext, useState, useContext, ReactNode, useEffect } from "react";
import CacheAPI from "../utils/CacheAPI";

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
    CacheAPI.setLocalItem<boolean>("darkTheme", !darkTheme);
  };

  useEffect(() => {
    const cache = CacheAPI.getLocalItem<boolean>("darkTheme");
    if (cache !== null) {
      setDarkTheme(cache);
    }
  }, []);

  const contextValue: DarkThemeContextType = {
    darkTheme,
    toggleDarkTheme,
  };

  return <DarkThemeContext.Provider value={contextValue}>{children}</DarkThemeContext.Provider>;
}

export const useDarkTheme = () => useContext(DarkThemeContext);
