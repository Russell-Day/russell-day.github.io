import Headshot from "../images/headshot.jpg";

const About = () => {
    return (
        <section id="about" className="py-12">
            <div className="grid md:grid-cols-2 gap-8 items-start">
                <div className="">
                    <img
                        src={Headshot}
                        alt="Profile Photo"
                        className="w-full rounded-3xl ring-1 ring-slate-200/70 dark:ring-slate-700/70 shadow"
                    />
                </div>
                <div className="text-slate-700 dark:text-slate-200">
                    <h2 className="text-sm font-semibold tracking-wider mb-2 text-slate-600 dark:text-slate-400">WHO AM I</h2>
                    <p className="mb-6">
                        I am currently a sophomore at the University of Michigan
                        in the honors college of LSA studying data science on a
                        premedical track. I have interests in the intersections
                        of data science and medicine, specifically surrounding
                        AI/ML and how they can be used to improve patient
                        outcomes, physician workflow, and predictive analytics.
                    </p>
                    <h2 className="text-sm font-semibold tracking-wider mb-2 text-slate-600 dark:text-slate-400">INTERESTS</h2>
                    <ul className="mb-6 list-disc list-inside">
                        <li>Healthcare Data Science</li>
                        <li>AI/ML in Medicine</li>
                        <li>Patient Reported Outcomes</li>
                        <li>LLM Integration</li>
                        <li>AI Agents</li>
                    </ul>
                    <h2 className="text-sm font-semibold tracking-wider mb-2 text-slate-600 dark:text-slate-400">FUN</h2>
                    <p>
                        If I am not coding or studying organic chemistry, you'll
                        find me cooking! Ask me about my favorite recipes.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default About;
