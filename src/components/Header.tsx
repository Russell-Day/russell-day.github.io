import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CursiveName from "../images/cursive_name.svg";

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isDark, setIsDark] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        try {
            const stored = localStorage.getItem("theme");
            const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
            const initialDark = stored ? stored === "dark" : prefersDark;
            setIsDark(initialDark);
        } catch {
            // ignore
        }
    }, []);

    const applyTheme = (dark: boolean) => {
        document.body.classList.add("theme-transition");
        document.documentElement.classList.toggle("dark", dark);
        document.documentElement.classList.toggle("bg-bg-dark", dark);
        document.documentElement.classList.toggle("bg-bg-light", !dark);
        localStorage.setItem("theme", dark ? "dark" : "light");
        setIsDark(dark);
        // remove transition class after animation
        window.setTimeout(() => document.body.classList.remove("theme-transition"), 250);
    };

    const toggleTheme = () => applyTheme(!isDark);

    return (
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:bg-gray-900/70 border-b border-gray-200 dark:border-gray-800">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
            <a href="/" className="flex items-center gap-3">
                <img
                    src={CursiveName}
                    alt="Logo"
                    className="h-8 w-auto bg-white rounded-md dark:bg-gray-300"
                />
            </a>

            {/* <div className="text-3xl font-bold">Russell</div> */}
            <nav className="hidden md:flex items-center space-x-6">
                <Link
                    to="/work"
                    className="text-gray-700 hover:text-gray-900 font-medium text-sm dark:text-gray-100"
                >
                    Work
                </Link>
                <Link
                    to="/about"
                    className="text-gray-700 hover:text-gray-900 font-medium text-sm dark:text-gray-100"
                >
                    About
                </Link>
                <Link
                    to="/cv"
                    className="text-gray-700 hover:text-gray-900 font-medium text-sm dark:text-gray-100"
                >
                    CV
                </Link>
                <button
                    aria-label="Toggle theme"
                    onClick={toggleTheme}
                    className="ml-2 inline-flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100 text-gray-700 dark:border-gray-700 dark:hover:bg-gray-800 dark:text-gray-100"
                    title={isDark ? "Switch to light" : "Switch to dark"}
                >
                    {isDark ? (
                        // Sun icon
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path d="M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12Zm0 4a1 1 0 0 1-1-1v-1a1 1 0 1 1 2 0v1a1 1 0 0 1-1 1Zm0-18a1 1 0 0 1-1-1V2a1 1 0 1 1 2 0v1a1 1 0 0 1-1 1Zm10 9a1 1 0 0 1-1 1h-1a1 1 0 1 1 0-2h1a1 1 0 0 1 1 1ZM4 12a1 1 0 0 1-1 1H2a1 1 0 1 1 0-2h1a1 1 0 0 1 1 1Zm13.657 6.657a1 1 0 0 1-1.414 0l-.707-.707a1 1 0 1 1 1.414-1.414l.707.707a1 1 0 0 1 0 1.414Zm-9.9-9.9a1 1 0 0 1-1.414 0l-.707-.707A1 1 0 0 1 6.05 6.93l.707.707a1 1 0 0 1 0 1.414Zm9.9-1.414a1 1 0 1 1-1.414-1.414l.707-.707A1 1 0 0 1 18.364 6.05l-.707.707Zm-9.9 9.9a1 1 0 1 1-1.414-1.414l.707-.707A1 1 0 0 1 8.464 17.95l-.707.707Z"/></svg>
                    ) : (
                        // Moon icon
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path d="M21.752 15.002A9.718 9.718 0 0 1 12.004 22C6.486 22 2 17.514 2 11.996A9.717 9.717 0 0 1 8.998 2.248a.75.75 0 0 1 .81 1.178A8.218 8.218 0 0 0 11.25 5c4.556 0 8.25 3.694 8.25 8.25 0 1.077-.212 2.105-.6 3.043a.75.75 0 0 1-.148.709Z"/></svg>
                    )}
                </button>
            </nav>
            <button className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-100 dark:hover:bg-gray-800" onClick={toggleMenu} aria-label="Open menu">
                <svg
                    className="w-8 h-8 text-gray-700 dark:text-gray-100"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 6h16M4 12h16M4 18h16"
                    ></path>
                </svg>
            </button>
            {isOpen && (
                <div className="fixed inset-0 bg-white/95 dark:bg-gray-900/95 flex flex-col items-center justify-center z-50">
                    <button
                        className="absolute top-4 right-4 inline-flex h-10 w-10 items-center justify-center rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-100 dark:hover:bg-gray-800"
                        onClick={toggleMenu}
                        aria-label="Close menu"
                    >
                        <svg
                            className="w-8 h-8 text-gray-700 dark:text-gray-100"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                            ></path>
                        </svg>
                    </button>
                    <Link
                        to="/work"
                        className="text-gray-700 hover:text-gray-900 font-semibold text-2xl mb-4 p-5 dark:text-gray-100"
                        onClick={toggleMenu}
                    >
                        Work
                    </Link>
                    <Link
                        to="/about"
                        className="text-gray-700 hover:text-gray-900 font-semibold text-2xl mb-4 p-5 dark:text-gray-100"
                        onClick={toggleMenu}
                    >
                        About
                    </Link>
                    <Link
                        to="/cv"
                        className="text-gray-700 hover:text-gray-900 font-semibold text-2xl mb-4 p-5 dark:text-gray-100"
                        onClick={toggleMenu}
                    >
                        CV
                    </Link>
                    <button
                        onClick={() => { toggleTheme(); toggleMenu(); }}
                        className="mt-4 inline-flex items-center gap-2 rounded-full border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-100 dark:hover:bg-gray-800"
                    >
                        {isDark ? "Light mode" : "Dark mode"}
                    </button>
                </div>
            )}
            </div>
        </header>
    );
};

export default Header;
