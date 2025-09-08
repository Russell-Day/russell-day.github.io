const Footer = () => {
    return (
        <footer className="mt-auto border-t border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-900/70 backdrop-blur">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center flex-col md:flex-row gap-3">
            <div className="flex space-x-6">
                <a
                    href="mailto:russday@umich.edu"
                    className="text-slate-700 hover:text-slate-900 dark:text-slate-200"
                >
                    Mail
                </a>
                <a
                    href="https://www.linkedin.com/in/russell-day"
                    target="_blank"
                    className="text-slate-700 hover:text-slate-900 dark:text-slate-200"
                >
                    LinkedIn
                </a>
                <a
                    href="https://github.com/Russell-Day"
                    target="_blank"
                    className="text-slate-700 hover:text-slate-900 dark:text-slate-200"
                >
                    Github
                </a>
            </div>
            <div className="text-slate-600 dark:text-slate-400 text-sm">© {new Date().getFullYear()} Russell Day</div>
            </div>
        </footer>
    );
};

export default Footer;
