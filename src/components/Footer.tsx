const Footer = () => {
    const year = new Date().getFullYear();
    return (
        <footer className="bg-white/60 backdrop-blur border-t border-gray-200 dark:bg-gray-900/60 dark:border-gray-800 py-6">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center flex-col md:flex-row gap-4">
            <div className="flex space-x-6">
                <a
                    href="mailto:russday@umich.edu"
                    className="text-gray-700 hover:text-gray-900 dark:text-gray-100"
                >
                    Mail
                </a>
                <a
                    href="https://www.linkedin.com/in/russell-day"
                    target="_blank"
                    className="text-gray-700 hover:text-gray-900 dark:text-gray-100"
                >
                    LinkedIn
                </a>
                <a
                    href="https://github.com/Russell-Day"
                    target="_blank"
                    className="text-gray-700 hover:text-gray-900 dark:text-gray-100"
                >
                    Github
                </a>
            </div>
            <div className="text-gray-700 dark:text-gray-100">Russell Day {year}</div>
            </div>
        </footer>
    );
};

export default Footer;
