function CTA() {
  return (
    <>
      {/* CTA SECTION */}
      <section
        id="contact"
        className="bg-[#f8f6f3] px-6 py-24 lg:px-10"
      >
        <div className="mx-auto max-w-5xl overflow-hidden rounded-[40px] bg-[#eadbdd] px-6 py-16 text-center md:px-16">

          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#70484b]">
            Start Exploring
          </p>

          <h2 className="mx-auto mt-5 max-w-3xl font-serif text-4xl leading-tight text-[#403737] md:text-5xl lg:text-6xl">
            Your Next Great
            <span className="block italic text-[#9c686b]">
              Experience Is Waiting.
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-gray-600">
            Discover exciting events, connect with new people and create
            unforgettable memories. Your next experience could be just one
            click away.
          </p>

          <div className="mt-9 flex flex-wrap justify-center gap-4">

            <button className="rounded-full bg-[#70484b] px-8 py-4 text-sm font-semibold text-white transition duration-300 hover:-translate-y-1 hover:bg-[#59393c] hover:shadow-xl">
              Explore Events →
            </button>

            <button className="rounded-full border border-[#70484b] px-8 py-4 text-sm font-semibold text-[#70484b] transition duration-300 hover:bg-[#70484b] hover:text-white">
              Create an Event
            </button>

          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#292424] px-6 py-14 text-white lg:px-10">

        <div className="mx-auto max-w-7xl">

          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">

            {/* Brand */}
            <div>

              <h2 className="font-serif text-3xl font-semibold">
                Eventora<span className="text-[#d5a6a8]">.</span>
              </h2>

              <p className="mt-4 max-w-xs text-sm leading-6 text-gray-400">
                Discover. Connect. Experience. Your platform for finding
                meaningful events and unforgettable experiences.
              </p>

            </div>

            {/* Explore */}
            <div>

              <h3 className="text-sm font-semibold uppercase tracking-wider text-[#d5a6a8]">
                Explore
              </h3>

              <div className="mt-5 flex flex-col gap-3 text-sm text-gray-400">

                <a
                  href="#home"
                  className="transition hover:text-white"
                >
                  Home
                </a>

                <a
                  href="#events"
                  className="transition hover:text-white"
                >
                  Upcoming Events
                </a>

                <a
                  href="#categories"
                  className="transition hover:text-white"
                >
                  Categories
                </a>

                <a
                  href="#about"
                  className="transition hover:text-white"
                >
                  About Eventora
                </a>

              </div>

            </div>

            {/* Event Categories */}
            <div>

              <h3 className="text-sm font-semibold uppercase tracking-wider text-[#d5a6a8]">
                Categories
              </h3>

              <div className="mt-5 flex flex-col gap-3 text-sm text-gray-400">

                <span className="cursor-pointer transition hover:text-white">
                  Technology
                </span>

                <span className="cursor-pointer transition hover:text-white">
                  Workshops
                </span>

                <span className="cursor-pointer transition hover:text-white">
                  Music
                </span>

                <span className="cursor-pointer transition hover:text-white">
                  Sports
                </span>

              </div>

            </div>

            {/* Contact */}
            <div>

              <h3 className="text-sm font-semibold uppercase tracking-wider text-[#d5a6a8]">
                Contact
              </h3>

              <div className="mt-5 flex flex-col gap-3 text-sm text-gray-400">

                <p>📍 Mumbai, India</p>

                <p>✉ hello@eventora.com</p>

                <p>☎ +91 98765 43210</p>

              </div>

              {/* Social Buttons */}
              <div className="mt-6 flex gap-3">

                <button className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-sm transition hover:bg-white hover:text-[#292424]">
                  f
                </button>

                <button className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-sm transition hover:bg-white hover:text-[#292424]">
                  in
                </button>

                <button className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-sm transition hover:bg-white hover:text-[#292424]">
                  X
                </button>

              </div>

            </div>

          </div>

          {/* Bottom Footer */}
          <div className="mt-12 flex flex-col justify-between gap-4 border-t border-white/10 pt-6 text-xs text-gray-500 md:flex-row">

            <p>
              © 2026 Eventora. All rights reserved.
            </p>

            <div className="flex gap-6">

              <a
                href="#"
                className="transition hover:text-gray-300"
              >
                Privacy Policy
              </a>

              <a
                href="#"
                className="transition hover:text-gray-300"
              >
                Terms & Conditions
              </a>

            </div>

          </div>

        </div>

      </footer>
    </>
  );
}

export default CTA;