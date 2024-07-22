import Gaudmire from "../images/gaudmire.png";
import blueprints from "../images/blueprints.png";

const projects = [
    {
        title: "Streamlining Paper Selection",
        link: "",
        target: "_blank",
        subtitle: "Research Project",
        description: "01 | LLM PROJECTS",
        image: Gaudmire,
    },
    {
        title: "Sorting Product Database",
        link: "https://russell-day.github.io/blueprints_inventory_case_study_07042024/index.html",
        target: "_blank",
        subtitle: "Blueprints for Pangaea",
        description: "02 | DATA MANIPULATION",
        image: blueprints,
    },
];

const Work = () => {
    return (
        <section id="work" className="py-16">
            <div className="text-center mb-16">
                <h1 className="text-4xl font-bold mb-4 dark:text-gray-100">
                    Hi, I'm Russell.
                </h1>
                <p className="text-xl text-gray-700 dark:text-gray-200">
                    Data science student at the University of Michigan.
                    Currently coding away for{" "}
                    <span className="font-semibold">
                        Henry Ford Orthopedic Research Group
                    </span>{" "}
                    and <span className="font-semibold">Protera Health</span>.
                </p>
            </div>
            <h2 className="text-xl text-gray-700 mb-4 dark:text-gray-100">
                PROJECTS
            </h2>
            <div className="space-y-8">
                {projects.map((project, index) => (
                    <a
                        href={project.link}
                        target={project.target}
                        key={index}
                        className="flex flex-col md:flex-row items-center mb-8"
                    >
                        <img
                            src={project.image}
                            alt={project.title}
                            className="w-full md:w-1/2 rounded-2xl"
                        />
                        <div className="md:ml-8 mt-4 md:mt-0">
                            <p className="text-sm text-gray-500 dark:text-gray-100">
                                {project.description}
                            </p>
                            <h3 className="text-2xl text-gray-800 dark:text-gray-200">
                                {project.title}
                            </h3>
                            <p className="text-lg text-gray-600 dark:text-gray-300">
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
