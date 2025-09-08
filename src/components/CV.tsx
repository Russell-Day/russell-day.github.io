const CV = () => {
    return (
        <section id="cv" className="py-12 sm:py-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-gray-800 dark:text-gray-100">
                <div className="text-center mb-8">
                    <h1 className="text-3xl sm:text-4xl font-bold mb-2">Russell Day</h1>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                        <a href="mailto:russday@umich.edu" className="hover:underline">russday@umich.edu</a>
                        <span className="px-2">|</span>
                        <a href="https://www.linkedin.com/in/russell-day" target="_blank" className="hover:underline">linkedin.com/in/russell-day</a>
                        <span className="px-2">|</span>
                        <a href="https://russell-day.github.io" target="_blank" className="hover:underline">russell-day.github.io</a>
                    </div>
                </div>
                <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-sm">
                    <iframe
                        title="Resume PDF"
                        src="https://1drv.ms/b/s!AsmHzUVMJnY5i7FzUHbK0KkB8cS3aA?embed=1&em=2"
                        className="w-full"
                        style={{ height: "75vh" }}
                    />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 text-center">
                    Note: Phone and street address are intentionally omitted here for privacy.
                </p>
            </div>
        </section>
    );
};

export default CV;
