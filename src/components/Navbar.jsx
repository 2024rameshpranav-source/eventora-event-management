import { useState } from "react";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="absolute top-0 left-0 z-50 w-full">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-10">

        {/* Logo */}
        <a
          href="#home"
          className="font-serif text-3xl font-semibold text-[#70484b]"
        >
          Eventora<span className="text-[#b98285]">.</span>
        </a>

        {/* Desktop Menu */}
        <div className="hidden items-center gap-8 md:flex">

          <a
            href="#home"
            className="text-sm text-[#403737] transition hover:text-[#9c686b]"
          >
            Home
          </a>

          <a
            href="#events"
            className="text-sm text-[#403737] transition hover:text-[#9c686b]"
          >
            Events
          </a>

          <a
            href="#categories"
            className="text-sm text-[#403737] transition hover:text-[#9c686b]"
          >
            Categories
          </a>

          <a
            href="#about"
            className="text-sm text-[#403737] transition hover:text-[#9c686b]"
          >
            About
          </a>

          <a
            href="#contact"
            className="text-sm text-[#403737] transition hover:text-[#9c686b]"
          >
            Contact
          </a>

          <button className="rounded-full bg-[#70484b] px-6 py-3 text-sm font-medium text-white transition duration-300 hover:bg-[#59393c] hover:shadow-lg">
            Register
          </button>

        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-2xl text-[#70484b] md:hidden"
        >
          {menuOpen ? "✕" : "☰"}
        </button>

      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="mx-5 rounded-2xl bg-white p-6 shadow-xl md:hidden">

          <div className="flex flex-col gap-5">

            <a
              href="#home"
              onClick={() => setMenuOpen(false)}
            >
              Home
            </a>

            <a
              href="#events"
              onClick={() => setMenuOpen(false)}
            >
              Events
            </a>

            <a
              href="#categories"
              onClick={() => setMenuOpen(false)}
            >
              Categories
            </a>

            <a
              href="#about"
              onClick={() => setMenuOpen(false)}
            >
              About
            </a>

            <a
              href="#contact"
              onClick={() => setMenuOpen(false)}
            >
              Contact
            </a>

            <button className="rounded-full bg-[#70484b] px-5 py-3 text-white">
              Register
            </button>

          </div>

        </div>
      )}
    </nav>
  );
}

export default Navbar;