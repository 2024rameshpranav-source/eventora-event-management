function Features() {
  const features = [
    {
      number: "01",
      title: "Easy Discovery",
      description:
        "Find events that match your interests, location and preferences without spending hours searching.",
    },
    {
      number: "02",
      title: "Simple Registration",
      description:
        "Register for your favourite events quickly with a simple and user-friendly registration experience.",
    },
    {
      number: "03",
      title: "Real-Time Updates",
      description:
        "Stay informed about event schedules, venue changes and important announcements in real time.",
    },
    {
      number: "04",
      title: "Secure Platform",
      description:
        "Your account and registration information are handled through a secure and reliable platform.",
    },
  ];

  return (
    <section
      id="about"
      className="bg-[#403737] px-6 py-24 text-white lg:px-10"
    >
      <div className="mx-auto max-w-7xl">

        <div className="grid gap-16 lg:grid-cols-2 lg:items-center">

          {/* LEFT CONTENT */}
          <div>

            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#d5a6a8]">
              Why Eventora
            </p>

            <h2 className="mt-5 max-w-xl font-serif text-4xl leading-tight md:text-5xl lg:text-6xl">
              Everything You Need To
              <span className="block italic text-[#d5a6a8]">
                Experience Great Events.
              </span>
            </h2>

            <p className="mt-7 max-w-xl text-base leading-8 text-gray-300">
              Eventora brings event discovery, registration and communication
              together in one simple platform. Discover new experiences,
              connect with people and never miss an event that matters to you.
            </p>

            {/* Small CTA */}
            <button className="mt-8 rounded-full border border-[#d5a6a8] px-7 py-3 text-sm font-semibold text-[#d5a6a8] transition duration-300 hover:bg-[#d5a6a8] hover:text-[#403737]">
              Learn More →
            </button>

          </div>

          {/* RIGHT FEATURES */}
          <div className="grid gap-5 sm:grid-cols-2">

            {features.map((feature) => (
              <div
                key={feature.number}
                className="group rounded-[28px] border border-white/10 bg-white/5 p-7 transition duration-500 hover:-translate-y-2 hover:bg-white/10 hover:shadow-2xl"
              >

                {/* Number */}
                <span className="text-sm font-medium tracking-widest text-[#d5a6a8]">
                  {feature.number}
                </span>

                {/* Icon Circle */}
                <div className="mt-6 flex h-12 w-12 items-center justify-center rounded-full border border-[#d5a6a8]/30 text-[#d5a6a8] transition duration-300 group-hover:bg-[#d5a6a8] group-hover:text-[#403737]">
                  ✦
                </div>

                {/* Title */}
                <h3 className="mt-5 font-serif text-2xl">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="mt-3 text-sm leading-6 text-gray-400">
                  {feature.description}
                </p>

              </div>
            ))}

          </div>

        </div>

      </div>
    </section>
  );
}

export default Features;