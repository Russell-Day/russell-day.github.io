import systematic_review from "../images/systematic_review.png";
import blueprints from "../images/blueprints.png";
import pop_health from "../images/pop_health.png";

const projects = [
    {
        title: "Streamlining Paper Selection (Confidential)",
        link: "#",
        target: "_blank",
        subtitle: "Henry Ford Research Project",
        description: "01 | LLM INTEGRATION",
        image: systematic_review,
    },
    {
        title: "Case Study for Inventory Management",
        link: "https://russell-day.github.io/blueprints_inventory_case_study_07042024/index.html",
        target: "_blank",
        subtitle: "Blueprints for Pangaea",
        description: "02 | DATA CLEANING & DATA MANIPULATION",
        image: blueprints,
    },
    {
        title: "Scraping for Population Health Leaders",
        link: "https://russell-day.github.io/Scraping-for-Population-Health-Leaders/",
        target: "_blank",
        subtitle: "Protera Health",
        description: "03 | WEB SCRAPING & DATA CLEANING",
        image: pop_health,
    },
];

const Work = () => {
    return (
        <section id="work" className="py-12">
            <div className="mb-12 rounded-3xl bg-gradient-to-br from-indigo-500/10 via-sky-500/10 to-purple-500/10 dark:from-indigo-500/15 dark:via-sky-500/15 dark:to-purple-500/15 border border-slate-200/50 dark:border-slate-700/60 p-8">
                <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-3">Hi, I'm Russell.</h1>
                <p className="text-lg sm:text-xl text-slate-700 dark:text-slate-300 max-w-3xl">
                    Data science student at the University of Michigan. Working at the intersection of AI and healthcare—LLMs, CV, and clinical data.
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                    <a href="mailto:russday@umich.edu" className="inline-flex items-center rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-4 py-2 text-sm font-semibold shadow hover:opacity-90 transition">
                        Contact
                    </a>
                    <a href="https://www.linkedin.com/in/russell-day" target="_blank" className="inline-flex items-center rounded-full border border-slate-300 dark:border-slate-600 px-4 py-2 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition">
                        LinkedIn
                    </a>
                </div>
            </div>
            <h2 className="text-sm font-semibold tracking-wider text-slate-600 dark:text-slate-400 mb-3">PROJECTS</h2>
            <div className="space-y-8">
                {projects.map((project, index) => (
                    <a
                        href={project.link}
                        target={project.target}
                        key={index}
                        className="flex flex-col md:flex-row items-center gap-6 group"
                    >
                        <img
                            src={project.image}
                            alt={project.title}
                            className="w-full md:w-1/2 rounded-2xl ring-1 ring-slate-200/70 dark:ring-slate-700/70 shadow-sm group-hover:shadow-md transition"
                        />
                        <div className="md:ml-4 mt-2 md:mt-0">
                            <p className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                {project.description}
                            </p>
                            <h3 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                                {project.title}
                            </h3>
                            <p className="text-base text-slate-600 dark:text-slate-300">
                                {project.subtitle}
                            </p>
                        </div>
                    </a>
                ))}
            </div>
        </section>
    );
};

export default Work;
