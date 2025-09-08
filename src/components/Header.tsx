import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import CursiveName from "../images/cursive_name.svg";

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);
    // null => follow system, 'light' | 'dark' => forced
    const [theme, setTheme] = useState<null | 'light' | 'dark'>(() => {
        const stored = localStorage.getItem('theme');
        if (stored === 'light' || stored === 'dark') return stored;
        return null;
    });

    // apply theme on load and when changed
    useEffect(() => {
        const applyTheme = () => {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            const resolved = theme ?? (prefersDark ? 'dark' : 'light');
            if (resolved === 'dark') document.documentElement.classList.add('dark');
            else document.documentElement.classList.remove('dark');
        };
        applyTheme();
        const mq = window.matchMedia('(prefers-color-scheme: dark)');
        const handler = () => theme === null && applyTheme();
        mq.addEventListener?.('change', handler);
        return () => mq.removeEventListener?.('change', handler);
    }, [theme]);

    // lock body scroll when mobile menu is open
    useEffect(() => {
        if (isOpen) {
            const prev = document.body.style.overflow;
            document.body.style.overflow = 'hidden';
            return () => { document.body.style.overflow = prev; };
        }
    }, [isOpen]);

    // resolved theme for UI state
    const resolvedTheme = useMemo(() => {
        if (theme) return theme;
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }, [theme]);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-white/60 bg-white/80 dark:bg-slate-900/70 border-b border-slate-200/60 dark:border-slate-700">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
            <a href="/" className="flex items-center gap-2">
                <img
                    src={CursiveName}
                    alt="Logo"
                    className="h-8 w-auto bg-transparent dark:bg-transparent"
                />
            </a>

            {/* <div className="text-3xl font-bold">Russell</div> */}
            <nav className="hidden md:flex items-center gap-6">
                <Link
                    to="/work"
                    className="text-sm font-medium text-slate-700 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white"
                >
                    Work
                </Link>
                <Link
                    to="/about"
                    className="text-sm font-medium text-slate-700 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white"
                >
                    About
                </Link>
                <Link
                    to="/cv"
                    className="text-sm font-medium text-slate-700 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white"
                >
                    CV
                </Link>
                                {/* Theme toggle: light/dark only; defaults to system when unset */}
                                <button
                                    onClick={() => {
                                        const next = resolvedTheme === 'dark' ? 'light' : 'dark';
                                        setTheme(next);
                                        localStorage.setItem('theme', next);
                                    }}
                                    aria-label="Toggle dark mode"
                                    aria-pressed={resolvedTheme === 'dark'}
                                    className="inline-flex items-center gap-2 rounded-full border border-slate-300 dark:border-slate-600 px-3 py-1.5 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                                >
                                    <span className="inline-block w-2.5 h-2.5 rounded-full bg-slate-900 dark:bg-white" />
                                    {resolvedTheme === 'dark' ? 'Dark' : 'Light'}
                                </button>
            </nav>
            <button className="md:hidden p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800" onClick={toggleMenu} aria-label="Toggle menu">
                <svg
                    className="w-6 h-6 text-slate-700 dark:text-slate-200"
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
                        {isOpen && createPortal(
                                <div className="fixed inset-0 w-screen h-screen bg-white/95 dark:bg-slate-900/95 z-[100] flex flex-col items-center justify-center p-8">
                                    <button
                                        className="absolute top-4 right-4 p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
                                        onClick={toggleMenu}
                                        aria-label="Close menu"
                                    >
                                        <svg
                                            className="w-7 h-7 text-slate-700 dark:text-slate-200"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                    <Link to="/work" className="text-slate-800 dark:text-slate-100 text-2xl mb-4 p-4 font-semibold" onClick={toggleMenu}>Work</Link>
                                    <Link to="/about" className="text-slate-800 dark:text-slate-100 text-2xl mb-4 p-4 font-semibold" onClick={toggleMenu}>About</Link>
                                    <Link to="/cv" className="text-slate-800 dark:text-slate-100 text-2xl mb-4 p-4 font-semibold" onClick={toggleMenu}>CV</Link>
                                    <button
                                        onClick={() => {
                                            const next = resolvedTheme === 'dark' ? 'light' : 'dark';
                                            setTheme(next);
                                            localStorage.setItem('theme', next);
                                        }}
                                        className="mt-6 inline-flex items-center gap-2 rounded-full border border-slate-300 dark:border-slate-600 px-4 py-2 text-base hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                                    >
                                        <span className="inline-block w-2.5 h-2.5 rounded-full bg-slate-900 dark:bg-white" />
                                        {resolvedTheme === 'dark' ? 'Dark' : 'Light'} Mode
                                    </button>
                                </div>,
                                document.body
                        )}
                        </div>
                </header>
    );
};

export default Header;
