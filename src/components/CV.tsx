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
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Sanitized for web: phone and home address intentionally omitted.</p>
                </header>

                <div className="space-y-8">
                    <Section title="Education">
                        <Row left="University of Michigan" right="Aug 2023 – Present" sub="Major: Data Science, Minor: Business (GPA: ~3.9) • Ann Arbor, MI" />
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
                        <ul className="space-y-1">
                            <Bullet>JAMA Network Open (2023) — Racial, Ethnic, and Sex Diversity in Academic Medical Leadership.</Bullet>
                            <Bullet>JBJS (2022) — Racial, Ethnic, and Gender Diversity in Academic Orthopaedic Surgery Leadership.</Bullet>
                            <Bullet>Poster: AAHS 2025 — Leveraging AI Models to Streamline Systematic Reviews in Hand Surgery.</Bullet>
                            <Bullet>Podium: RSNA 2025 — Performance Evaluation of Fine-Tuned LLM for Clinical Predictors.</Bullet>
                        </ul>
                    </Section>

                    <Section title="Leadership">
                        <Row left="Vice President, Education — Michigan Data Science Team" right="May 2025 – Present" />
                        <Row left="Vice President, Technology — Blueprints for Pangaea" right="Dec 2024 – Present" />
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
