const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div>
        <h2 className="text-lg font-semibold tracking-wide text-slate-700 dark:text-slate-200 mb-3">{title}</h2>
        <div className="space-y-3 text-slate-700 dark:text-slate-300">{children}</div>
    </div>
);

const Row = ({ left, right, sub }: { left: string; right?: string; sub?: string }) => (
    <div>
        <div className="flex flex-wrap items-baseline justify-between gap-2">
            <div className="font-medium text-slate-900 dark:text-slate-100">{left}</div>
            {right && <div className="text-sm text-slate-500 dark:text-slate-400">{right}</div>}
        </div>
        {sub && <div className="text-sm text-slate-600 dark:text-slate-400">{sub}</div>}
    </div>
);

const Bullet = ({ children }: { children: React.ReactNode }) => (
    <li className="ml-5 list-disc text-slate-700 dark:text-slate-300">{children}</li>
);

const CV = () => {
    return (
        <section id="cv" className="py-12">
            <div className="max-w-4xl mx-auto">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold">Russell Day</h1>
                    <div className="text-slate-600 dark:text-slate-300">
                        <a href="mailto:russday@umich.edu" className="underline">russday@umich.edu</a>
                        <span className="mx-2">•</span>
                        <a href="https://linkedin.com/in/russell-day" target="_blank" className="underline">linkedin.com/in/russell-day</a>
                        <span className="mx-2">•</span>
                        <a href="https://russell-day.github.io" target="_blank" className="underline">russell-day.github.io</a>
                    </div>
                    
                </header>

                <div className="space-y-8">
                    <Section title="Education">
                        <Row left="University of Michigan" right="Aug 2023 – Present" sub="Major: Data Science, Minor: Business (GPA: 3.90) • Ann Arbor, MI" />
                    </Section>

                    <Section title="Experience">
                        <Row left="ML Intern — Trinity Health" right="Jan 2025 – Present" sub="Ann Arbor, MI" />
                        <ul className="mt-1 space-y-1">
                            <Bullet>Develop ML models to audit billing compliance, targeting significant primary care revenue.</Bullet>
                            <Bullet>Implement LLM-based solutions for automated healthcare billing monitoring.</Bullet>
                        </ul>

                        <Row left="Research Assistant — CAD-AI Lab, Michigan Medicine Radiology" right="Dec 2024 – Present" sub="Ann Arbor, MI" />
                        <ul className="mt-1 space-y-1">
                            <Bullet>Fine-tune LLMs for clinical use cases within HIPAA and compute constraints.</Bullet>
                            <Bullet>Optimize resources for healthcare AI deployment.</Bullet>
                        </ul>

                        <Row left="Research Assistant — Henry Ford Health (Ortho & Neuro)" right="Sep 2021 – Present" sub="Detroit, MI" />
                        <ul className="mt-1 space-y-1">
                            <Bullet>Research on gender diversity in orthopedics; contributed to publications.</Bullet>
                            <Bullet>Implemented LLM solutions for systematic reviews, reducing review time.</Bullet>
                        </ul>

                        <Row left="AI Automation Engineering Intern — Protera Health" right="May 2024 – Aug 2024" sub="Troy, MI" />
                        <ul className="mt-1 space-y-1">
                            <Bullet>Built Python apps integrating LLMs with Google Search API for data collection.</Bullet>
                            <Bullet>Processed 1,000+ records via custom LLM pipelines for analysis and categorization.</Bullet>
                        </ul>
                    </Section>

                    <Section title="Projects">
                        <Row left="Email Response Automation (MDST) — Python, Streamlit" right="Dec 2024 – Apr 2025" />
                        <ul className="mt-1 space-y-1">
                            <Bullet>LLM-powered system with memory integration to respond to high-volume emails (Groq API).</Bullet>
                        </ul>
                        <Row left="Inventory Automation (Blueprints for Pangaea) — JavaScript, LLMs" right="May 2024 – Apr 2025" />
                        <ul className="mt-1 space-y-1">
                            <Bullet>Automated pipeline improving inventory efficiency by ~50% and enabling real-time tracking.</Bullet>
                        </ul>
                        <Row left="CourseCompanion (MDST) — Python, LangChain, Streamlit" right="Aug 2024 – Dec 2024" />
                        <ul className="mt-1 space-y-1">
                            <Bullet>AI study scheduler (Canvas + Google Calendar) — 2nd place at MDST W24 showcase.</Bullet>
                        </ul>
                    </Section>

                    <Section title="Publications & Presentations">
                        <Row left="Publications" />
                        <ul className="mt-1 space-y-1">
                            <Bullet>Meadows, A. M., Skinner, M. M., Hazime, A. A., <strong>Day, R. G.</strong>, Fore, J. A., &amp; Day, C. S. (2023). Racial, Ethnic, and Sex Diversity in Academic Medical Leadership. <em>JAMA Network Open</em>, 6(9), e2335529.</Bullet>
                            <Bullet>Meadows, A. M., Skinner, M. M., Faraj, M. T., Hazime, A. A., <strong>Day, R. G.</strong>, Fore, J. A., &amp; Day, C. S. (2022). Racial, Ethnic, and Gender Diversity in Academic Orthopaedic Surgery Leadership. <em>JBJS</em>, 104(13), 1157-1165.</Bullet>
                        </ul>

                        <Row left="Podium Presentations" />
                        <ul className="mt-1 space-y-1">
                            <Bullet><strong>Day, R. G.</strong>, Hadjiiski, L. M., Sun, D., Chan, H. P., Caoili, E. M., Cohan, R. H., Alva, A. S., Bruno, G., Zhou, C., &amp; Gulani, V. (2025). Performance Evaluation of a Fine Tuned Smaller Large Language Model (LLM) for Extracting Clinical Predictors of 5 Year Survival in Bladder Cancer Patients Post Cystectomy. <em>RSNA Annual Conference</em>, Chicago, IL.</Bullet>
                        </ul>

                        <Row left="Poster Presentations" />
                        <ul className="mt-1 space-y-1">
                            <Bullet><strong>Day, R. G.</strong>, Dunaway, C., Chen, Z., Gudi, M., &amp; Day, C. S. (2025). Leveraging Artificial Intelligence Models to Streamline Systematic Reviews in Hand Surgery. <em>AAHS Annual Conference</em>, Waikoloa, HI.</Bullet>
                            <Bullet>McDonald, K. O., Prabhu, A. S., <strong>Day, R. G.</strong>, &amp; Aton, S. J. (2024). Chemogenetic Silencing of Dentate Gyrus Granule Cells During Memory Consolidation May Disrupt Contextual Fear Memory. <em>MIP Annual Research Symposium</em>, Ann Arbor, MI.</Bullet>
                        </ul>

                        <Row left="Panels &amp; Moderation" />
                        <ul className="mt-1 space-y-1">
                            <Bullet>Panelist, "Artificial Intelligence in Orthopaedic Surgery Education," AOA/CORD Summer Conference; 2025 June 21; St. Louis, MO, USA.</Bullet>
                        </ul>
                    </Section>

                    <Section title="Leadership">
                        <Row left="Vice President, Education — Michigan Data Science Team" right="May 2025 – Present" />
                        <Row left="Vice President, Technology — Blueprints for Pangaea" right="Dec 2024 – Present" />
                    </Section>

                    <Section title="Volunteer Experience">
                        <Row left="Volunteer — Crisis Text Line" right="Jan 2025 – Present" sub="Ann Arbor, MI" />
                        <ul className="mt-1 space-y-1">
                            <Bullet>Provide crisis support and mental health resources to individuals in need.</Bullet>
                        </ul>

                        <Row left="Volunteer — Kidney Disease Screening and Awareness Program" right="Jan 2024 – Present" sub="Ann Arbor, MI" />
                        <ul className="mt-1 space-y-1">
                            <Bullet>Participate in community health screening initiatives.</Bullet>
                        </ul>

                        <Row left="Volunteer — Breanna's House of Joy" right="July 2024, June 2022, March 2018" sub="Chiang Mai, Thailand" />
                        <ul className="mt-1 space-y-1">
                            <Bullet>Volunteered at a children's home providing educational and recreational support.</Bullet>
                        </ul>
                    </Section>

                    <Section title="Technical Skills">
                        <div>
                            <div><span className="font-medium">Languages:</span> Python, R, SQL, JavaScript, HTML/CSS, VBA, C++</div>
                            <div><span className="font-medium">Tools & Frameworks:</span> Streamlit, LangChain, Pydantic, Google APIs, Pandas, NumPy, Hugging Face</div>
                            <div><span className="font-medium">Specializations:</span> LLMs, Computer Vision, NLP, Clinical Data Analysis, Machine Learning</div>
                        </div>
                    </Section>
                </div>
            </div>
        </section>
    );
};

export default CV;
