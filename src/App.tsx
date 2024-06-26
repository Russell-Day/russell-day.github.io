import { Routes, Route } from "react-router-dom";
import Header from "./components/Header.tsx";
import Work from "./components/Work.tsx";
import About from "./components/About.tsx";
import CV from "./components/CV.tsx";
import Footer from "./components/Footer.tsx";
import "./index.css";

function App() {
  return (
    <div className="App">
      <Header />
      <main className="max-w-5xl mx-auto px-4">
        <Routes>
          <Route path="/" element={<Work />} />
          <Route path="/about" element={<About />} />
          <Route path="/cv" element={<CV />} />
          <Route path="/work" element={<Work />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
