function Categories() {
  const categories = [
    {
      icon: "💻",
      title: "Technology",
      description: "Tech conferences, hackathons and innovation events.",
    },
    {
      icon: "🎨",
      title: "Workshops",
      description: "Learn new skills through interactive workshops.",
    },
    {
      icon: "🎵",
      title: "Music",
      description: "Live concerts, festivals and musical experiences.",
    },
    {
      icon: "⚽",
      title: "Sports",
      description: "Sports events, tournaments and activities.",
    },
    {
      icon: "💼",
      title: "Business",
      description: "Networking events, seminars and conferences.",
    },
  ];

  return (
    <section
      id="categories"
      className="bg-[#f8f6f3] px-6 py-24 lg:px-10"
    >
      <div className="mx-auto max-w-7xl">

        {/* Heading */}
        <div className="text-center">

          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#a36f72]">
            Explore Categories
          </p>

          <h2 className="mt-4 font-serif text-4xl text-[#403737] md:text-5xl">
            Something For
            <span className="italic text-[#9c686b]">
              {" "}Everyone.
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-gray-500">
            Whether you're interested in technology, music, sports or
            creativity, discover events that match your interests.
          </p>

        </div>

        {/* Categories */}
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">

          {categories.map((category) => (
            <div
              key={category.title}
              className="group cursor-pointer rounded-[28px] border border-[#eadedf] bg-white p-7 text-center transition duration-500 hover:-translate-y-2 hover:bg-[#70484b] hover:shadow-xl"
            >

              {/* Icon */}
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#eadbdd] text-3xl transition duration-300 group-hover:scale-110">
                {category.icon}
              </div>

              {/* Title */}
              <h3 className="mt-5 font-serif text-xl text-[#403737] transition group-hover:text-white">
                {category.title}
              </h3>

              {/* Description */}
              <p className="mt-3 text-sm leading-6 text-gray-500 transition group-hover:text-gray-200">
                {category.description}
              </p>

              {/* Explore */}
              <div className="mt-5 text-xs font-semibold uppercase tracking-wider text-[#70484b] transition group-hover:text-white">
                Explore →
              </div>

            </div>
          ))}

        </div>

      </div>
    </section>
  );
}

export default Categories;