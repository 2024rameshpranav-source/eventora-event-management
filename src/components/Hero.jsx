function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen overflow-hidden bg-[#f8f6f3] px-6 pt-28 lg:px-10"
    >
      {/* Decorative background */}
      <div className="absolute -left-40 top-40 h-96 w-96 rounded-full bg-[#eadbdd] opacity-40 blur-3xl" />

      <div className="mx-auto grid min-h-[calc(100vh-7rem)] max-w-7xl items-center gap-12 lg:grid-cols-2">

        {/* LEFT CONTENT */}
        <div className="relative z-10">

          <p className="mb-5 text-sm font-medium uppercase tracking-[0.3em] text-[#a36f72]">
            Discover • Connect • Experience
          </p>

          <h1 className="max-w-xl font-serif text-5xl leading-[1.05] text-[#403737] sm:text-6xl lg:text-7xl">
            Events That
            <span className="block italic text-[#9c686b]">
              Bring People
            </span>
            Together.
          </h1>

          <p className="mt-7 max-w-lg text-base leading-8 text-gray-600 sm:text-lg">
            Discover exciting events, workshops, conferences and experiences.
            Find something you love and create memories that last forever.
          </p>

          {/* Buttons */}
          <div className="mt-9 flex flex-wrap gap-4">

            <a
              href="#events"
              className="rounded-full bg-[#70484b] px-7 py-4 text-sm font-semibold text-white transition duration-300 hover:-translate-y-1 hover:bg-[#59393c] hover:shadow-xl"
            >
              Explore Events →
            </a>

            <button className="rounded-full border border-[#70484b] px-7 py-4 text-sm font-semibold text-[#70484b] transition duration-300 hover:bg-[#70484b] hover:text-white">
              Create Event
            </button>

          </div>

          {/* Statistics */}
          <div className="mt-12 flex flex-wrap gap-10">

            <div>
              <h3 className="font-serif text-3xl text-[#70484b]">
                500+
              </h3>
              <p className="mt-1 text-xs uppercase tracking-wider text-gray-500">
                Events
              </p>
            </div>

            <div>
              <h3 className="font-serif text-3xl text-[#70484b]">
                10K+
              </h3>
              <p className="mt-1 text-xs uppercase tracking-wider text-gray-500">
                Participants
              </p>
            </div>

            <div>
              <h3 className="font-serif text-3xl text-[#70484b]">
                50+
              </h3>
              <p className="mt-1 text-xs uppercase tracking-wider text-gray-500">
                Cities
              </p>
            </div>

          </div>
        </div>

        {/* RIGHT IMAGE COLLAGE */}
        <div className="relative mx-auto h-[580px] w-full max-w-xl">

          {/* Main Event Image */}
          <div className="absolute right-4 top-12 h-[470px] w-[72%] overflow-hidden rounded-[35px] shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=85"
              alt="Live event"
              className="h-full w-full object-cover transition duration-700 hover:scale-105"
            />

            <div className="absolute inset-0 bg-black/10" />

            <div className="absolute bottom-8 left-8 text-white">
              <p className="text-xs uppercase tracking-[0.25em]">
                Featured Event
              </p>

              <h2 className="mt-2 font-serif text-3xl">
                The Experience
              </h2>
            </div>
          </div>

          {/* Top Image */}
          <div className="absolute left-0 top-0 h-48 w-48 rotate-[-7deg] overflow-hidden rounded-3xl border-8 border-white shadow-xl">
            <img
              src="https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=600&q=80"
              alt="Conference event"
              className="h-full w-full object-cover"
            />
          </div>

          {/* Bottom Image */}
          <div className="absolute bottom-5 left-5 h-52 w-44 rotate-[6deg] overflow-hidden rounded-3xl border-8 border-white shadow-xl">
            <img
              src="https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=600&q=80"
              alt="Workshop event"
              className="h-full w-full object-cover"
            />
          </div>

          {/* Floating Event Card */}
          <div className="absolute bottom-0 right-0 w-64 rounded-3xl bg-white p-5 shadow-2xl">

            <div className="flex items-center gap-4">

              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#eadbdd] text-xl text-[#70484b]">
                ✦
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-wider text-gray-400">
                  Next Event
                </p>

                <h3 className="mt-1 font-semibold text-[#403737]">
                  Creative Meetup
                </h3>
              </div>

            </div>

            <div className="mt-4 flex justify-between text-xs text-gray-500">
              <span>25 Sep 2026</span>
              <span>Mumbai</span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

export default Hero;