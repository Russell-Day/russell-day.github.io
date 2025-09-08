import { Routes, Route } from "react-router-dom";
import Header from "./components/Header.tsx";
import Work from "./components/Work.tsx";
import About from "./components/About.tsx";
import CV from "./components/CV.tsx";
import Footer from "./components/Footer.tsx";
import "./index.css";

function App() {
    return (
        <div className="App min-h-screen flex flex-col bg-bg-light text-gray-900 dark:bg-bg-dark dark:text-gray-100">
            <Header />
            <main className="flex-grow w-full">
                <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6">
                    <Routes>
                        <Route path="/" element={<Work />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/cv" element={<CV />} />
                        <Route path="/work" element={<Work />} />
                    </Routes>
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default App;
