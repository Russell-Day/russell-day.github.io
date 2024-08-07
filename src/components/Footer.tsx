const Footer = () => {
    return (
        <footer className="bg-white p-6 flex justify-between items-center border-t flex-col md:flex-row dark:bg-gray-800 dark:border-gray-500">
            <div className="flex space-x-6 mb-4 md:mb-0">
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
            </div>
            <div className="text-gray-700 block dark:text-gray-100">
                Inspiration from Aaron Huang
            </div>
            <div className="text-gray-700 block md:hidden dark:text-gray-100">
                RD. 2024
            </div>
            <div className="text-gray-700 hidden md:block dark:text-gray-100">
                Russell Day. 2024
            </div>
        </footer>
    );
};

export default Footer;
