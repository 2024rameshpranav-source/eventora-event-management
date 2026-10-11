import EventCard from "./EventCard";
import { useEvents } from "../context/EventContext";

function Events() {
  const {
    selectedCategory,
    setSelectedCategory,
    search,
    setSearch,
    loading,
    filteredEvents,
  } = useEvents();

  const categories = [
    "All",
    "Technology",
    "Workshop",
    "Music",
    "Business",
  ];

  return (
    <section id="events" className="bg-white px-6 py-24 lg:px-10">
      <div className="mx-auto max-w-7xl">

        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#a36f72]">
            Upcoming Events
          </p>

          <h2 className="mt-3 font-serif text-4xl text-[#403737] md:text-5xl">
            Find Your{" "}
            <span className="italic text-[#9c686b]">
              Experience.
            </span>
          </h2>
        </div>

        {/* Search */}
        <div className="mx-auto mt-10 max-w-xl">
          <input
            type="text"
            placeholder="Search for an event..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-full border border-gray-300 px-6 py-4 outline-none transition focus:border-[#70484b] focus:ring-2 focus:ring-[#eadbdd]"
          />
        </div>

        {/* Categories */}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`rounded-full px-5 py-2 text-sm font-medium transition ${
                selectedCategory === category
                  ? "bg-[#70484b] text-white"
                  : "bg-[#f3eeee] text-[#70484b] hover:bg-[#eadbdd]"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Events */}
        {loading ? (
          <p className="mt-14 text-center text-gray-500">
            Loading events...
          </p>
        ) : (
          <>
            <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {filteredEvents.map((event) => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>

            {filteredEvents.length === 0 && (
              <p className="mt-14 text-center text-gray-500">
                No events found.
              </p>
            )}
          </>
        )}
      </div>
    </section>
  );
}

export default Events;