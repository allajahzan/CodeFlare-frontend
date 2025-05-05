import { createContext, ReactNode, useEffect, useState } from "react";

// Type for theme
type Theme = "light" | "dark";

// Interface for theme context
export interface IThemeContext {
    theme: Theme;
    setTheme: React.Dispatch<React.SetStateAction<Theme>>;
}

// Theme context
const ThemeContext = createContext<IThemeContext | null>(null);

// Theme context provider
const ThemeContextProvider = ({ children }: { children: ReactNode }) => {
    // Theme state
    const [theme, setTheme] = useState<Theme>(() => {
        const storedTheme = localStorage.getItem("theme") as Theme | null;
        // const prefersDark = window.matchMedia(
        //     "(prefers-color-scheme: dark)"
        // ).matches;
        // return storedTheme ?? (prefersDark ? "dark" : "light");
        return storedTheme ?? "light";
    });

    useEffect(() => {
        if (theme === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
        localStorage.setItem("theme", theme);
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export { ThemeContext, ThemeContextProvider };
