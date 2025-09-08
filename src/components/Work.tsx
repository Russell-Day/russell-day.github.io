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
        <section id="work" className="py-12 sm:py-16">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold mb-3 dark:text-gray-100">
                    Hi, I'm Russell.
                </h1>
                <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-200 max-w-3xl mx-auto">
                    Data science student at the University of Michigan. Focusing
                    on the intersection between AI and healthcare.{" "}
                    <span className="font-semibold">EMAIL ME</span> for more
                    information on current projects! Currently coding away for{" "}
                    <span className="font-semibold">
                        Henry Ford Orthopedic Research Group
                    </span>
                    {/* {" "} and <span className="font-semibold">Protera Health</span>. */}
                </p>
            </div>
            <h2 className="text-xl text-gray-700 mb-4 dark:text-gray-100 tracking-wide">
                PROJECTS
            </h2>
            <div className="space-y-8">
                {projects.map((project, index) => (
                    <a
                        href={project.link}
                        target={project.target}
                        key={index}
                        className="flex flex-col md:flex-row items-center gap-6 group rounded-2xl border border-gray-200 dark:border-gray-800 p-3 hover:shadow-lg transition-shadow"
                    >
                        <img
                            src={project.image}
                            alt={project.title}
                            className="w-full md:w-1/2 rounded-xl"
                        />
                        <div className="md:ml-2 mt-2 md:mt-0">
                            <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                {project.description}
                            </p>
                            <h3 className="text-2xl text-gray-800 dark:text-gray-200 group-hover:underline">
                                {project.title}
                            </h3>
                            <p className="text-base text-gray-600 dark:text-gray-300">
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
