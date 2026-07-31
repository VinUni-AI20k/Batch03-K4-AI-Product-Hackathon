import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

axios.defaults.baseURL = import.meta.env.VITE_SERVER_URL;

const AppContext = createContext();

export const AppContextProvider = ({ children }) => {

    // ===== Theme =====
    const [theme, setTheme] = useState(
        localStorage.getItem("theme") || "light"
    );

    // ===== Current PDF =====
    const [currentPdf, setCurrentPdf] = useState(null);

    // ===== Current Page =====
    const [currentPage, setCurrentPage] = useState(1);

    // ===== Highlighted Text =====
    const [selectedText, setSelectedText] = useState("");

    // ===== Chat Messages =====
    const [messages, setMessages] = useState([]);

    useEffect(() => {

        if (theme === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }

        localStorage.setItem("theme", theme);

    }, [theme]);

    const value = {

        axios,

        theme,
        setTheme,

        currentPdf,
        setCurrentPdf,

        currentPage,
        setCurrentPage,

        selectedText,
        setSelectedText,

        messages,
        setMessages,

    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => useContext(AppContext);