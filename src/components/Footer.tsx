const Footer = () => {
  return (
    <footer className="bg-white p-6 flex justify-between items-center border-t flex-col md:flex-row">
      <div className="flex space-x-6 mb-4 md:mb-0">
        <a
          href="mailto:russday@umich.edu"
          className="text-gray-700 hover:text-gray-900"
        >
          Mail
        </a>
        <a
          href="https://www.linkedin.com/in/russell-day"
          target="_blank"
          className="text-gray-700 hover:text-gray-900"
        >
          LinkedIn
        </a>
      </div>
      <div className="text-gray-700 block">
        Inspiration taken from Aaron Huang
      </div>
      <div className="text-gray-700 block md:hidden">RD. 2024</div>
      <div className="text-gray-700 hidden md:block">Russell Day. 2024</div>
    </footer>
  );
};

export default Footer;
