import { useEvents } from "../context/EventContext";

function EventCard({ event }) {
  const {
    selectedEvent,
    selectEventForRegistration,
  } = useEvents();

  return (
    <div className="group overflow-hidden rounded-[28px] bg-[#f8f6f3] transition duration-500 hover:-translate-y-2 hover:shadow-2xl">

      {/* Image */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={event.image}
          alt={event.title}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
        />

        <span className="absolute left-5 top-5 rounded-full bg-white/90 px-4 py-2 text-xs font-semibold text-[#70484b] backdrop-blur">
          {event.category}
        </span>
      </div>

      {/* Content */}
      <div className="p-7">

        <p className="text-xs font-semibold uppercase tracking-wider text-[#a36f72]">
          {event.date}
        </p>

        <h3 className="mt-3 font-serif text-2xl text-[#403737]">
          {event.title}
        </h3>

        <p className="mt-3 text-sm text-gray-500">
          📍 {event.location}
        </p>

        <p className="mt-3 text-sm leading-6 text-gray-500">
          {event.description}
        </p>

        {/* Register Button */}
        <button
          onClick={() => {
            selectEventForRegistration(event.title);

            document
              .getElementById("registration")
              ?.scrollIntoView({
                behavior: "smooth",
              });
          }}
          className="mt-6 rounded-full bg-[#70484b] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#59393c]"
        >
          Register Now →
        </button>

        {/* Show selected event */}
        {selectedEvent === event.title && (
          <p className="mt-3 text-sm font-medium text-green-600">
            Selected for registration ✓
          </p>
        )}

      </div>
    </div>
  );
}

export default EventCard;