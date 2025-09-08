import Headshot from "../images/headshot.jpg";

const About = () => {
    return (
        <section id="about" className="py-12 sm:py-16">
            <div className="flex flex-col md:flex-row items-center justify-center md:justify-between gap-8">
                <div className="md:w-1/2 p-4">
                    <img
                        src={Headshot}
                        alt="Profile Photo"
                        className="w-full rounded-2xl shadow-lg"
                    />{" "}
                    {/* Update with your image path */}
                </div>
                <div className="md:w-1/2 p-4 text-gray-700 dark:text-gray-200">
                    <h2 className="text-xl font-semibold  mb-4 tracking-wide">WHO AM I</h2>
                    <p className=" mb-8 leading-relaxed">
                        I am currently a sophomore at the University of Michigan
                        in the honors college of LSA studying data science on a
                        premedical track. I have interests in the intersections
                        of data science and medicine, specifically surrounding
                        AI/ML and how they can be used to improve patient
                        outcomes, physician workflow, and predictive analytics.
                    </p>
                    <h2 className="text-xl font-semibold mb-4 tracking-wide">INTERESTS</h2>
                    <ul className=" mb-8 list-disc list-inside space-y-1">
                        <li>Healthcare Data Science</li>
                        <li>AI/ML in Medicine</li>
                        <li>Patient Reported Outcomes</li>
                        <li>LLM Integration</li>
                        <li>AI Agents</li>
                    </ul>
                    <h2 className="text-xl font-semibold  mb-4 tracking-wide">FUN</h2>
                    <p className="leading-relaxed">
                        If I am not coding or studying organic chemistry, you'll
                        find me cooking! Ask me about my favorite recipes.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default About;
