import Headshot from "../images/headshot.jpg";

const About = () => {
  return (
    <section id="about" className="py-16">
      <div className="flex flex-col md:flex-row items-center justify-center md:justify-between">
        <div className="md:w-1/2 p-4">
          <img
            src={Headshot}
            alt="Profile Photo"
            className="w-full rounded-2xl"
          />{" "}
          {/* Update with your image path */}
        </div>
        <div className="md:w-1/2 p-4">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">WHO AM I</h2>
          <p className="text-gray-700 mb-8">
            I am currently a rising sophomore at the University of Michigan in
            the honors college of LSA studying data science on a premedical
            track. I have interests in the intersections of data science and
            medicine, specifically surrounding AI/ML and how they can be used to
            improve patient outcomes and physician workflow.
          </p>
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            INTERESTS
          </h2>
          <ul className="text-gray-700 mb-8 list-disc list-inside">
            <li>Healthcare Data Science</li>
            <li>AI/ML in Medicine</li>
            <li>Patient Reported Outcomes</li>
            <li>LLM Integration</li>
            <li>AI Agents</li>
          </ul>
          <h2 className="text-xl font-semibold text-gray-700 mb-4">FUN</h2>
          <p className="text-gray-700">
            If I am not coding or studying organic chemistry, you'll me at the
            gym hitting weights!
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;
