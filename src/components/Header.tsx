import { useState } from "react";
import { Link } from "react-router-dom";
import CursiveName from "../images/cursive_name.svg";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="bg-white p-6 flex justify-between items-center shadow-md">
      <img src={CursiveName} alt="Logo" className="h-10 w-auto" />

      {/* <div className="text-3xl font-bold">Russell</div> */}
      <nav className="hidden md:flex space-x-6">
        <Link
          to="/work"
          className="text-gray-700 hover:text-gray-900 hover:underline hover:underline-offset-2 font-semibold text-lg"
        >
          Work
        </Link>
        <Link
          to="/about"
          className="text-gray-700 hover:text-gray-900 hover:underline hover:underline-offset-2 font-semibold text-lg"
        >
          About
        </Link>
        <Link
          to="/cv"
          className="text-gray-700 hover:text-gray-900 hover:underline hover:underline-offset-2 font-semibold text-lg"
        >
          CV
        </Link>
      </nav>
      <button className="md:hidden" onClick={toggleMenu}>
        <svg
          className="w-8 h-8 text-gray-700"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16M4 12h16M4 18h16"
          ></path>
        </svg>
      </button>
      {isOpen && (
        <div className="absolute top-0 left-0 w-full h-full bg-white flex flex-col items-center justify-center z-50">
          <button className="absolute top-4 right-4" onClick={toggleMenu}>
            <svg
              className="w-8 h-8 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
          <Link
            to="/work"
            className="text-gray-700 hover:text-gray-900 hover:underline hover:underline-offset-2 font-semibold text-2xl mb-4 p-5"
            onClick={toggleMenu}
          >
            Work
          </Link>
          <Link
            to="/about"
            className="text-gray-700 hover:text-gray-900 hover:underline hover:underline-offset-2 font-semibold text-2xl mb-4 p-5"
            onClick={toggleMenu}
          >
            About
          </Link>
          <Link
            to="/CV"
            className="text-gray-700 hover:text-gray-900 hover:underline hover:underline-offset-2 font-semibold text-2xl mb-4 p-5"
            onClick={toggleMenu}
          >
            CV
          </Link>
        </div>
      )}
    </header>
  );
};

export default Header;
