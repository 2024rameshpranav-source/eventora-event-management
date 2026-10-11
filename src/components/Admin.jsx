import { useState } from "react";
import { useEvents } from "../context/EventContext";

function Admin() {
  const {
    events,
    addEvent,
    deleteEvent,
  } = useEvents();

  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    category: "Technology",
    date: "",
    location: "",
    description: "",
    image: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Create event using MongoDB API
  const handleAddEvent = async (e) => {
    e.preventDefault();

    try {
      await addEvent(formData);

      setFormData({
        title: "",
        category: "Technology",
        date: "",
        location: "",
        description: "",
        image: "",
      });

      setShowForm(false);

      alert("Event created successfully!");
    } catch (error) {
      alert("Failed to create event.");
      console.error(error);
    }
  };

  // Delete event using MongoDB API
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this event?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await deleteEvent(id);

      alert("Event deleted successfully!");
    } catch (error) {
      alert("Failed to delete event.");
      console.error(error);
    }
  };

  return (
    <section className="min-h-screen bg-[#f8f6f3] px-6 py-20 lg:px-10">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#a36f72]">
              Administration
            </p>

            <h1 className="mt-2 font-serif text-4xl text-[#403737] md:text-5xl">
              Event <span className="italic text-[#9c686b]">Dashboard.</span>
            </h1>

            <p className="mt-3 text-gray-500">
              Manage events and keep the Eventora platform updated.
            </p>
          </div>

          <button
            onClick={() => setShowForm(!showForm)}
            className="rounded-full bg-[#70484b] px-6 py-3 font-semibold text-white transition hover:bg-[#59393c]"
          >
            {showForm ? "Close Form" : "+ Create Event"}
          </button>

        </div>

        {/* Statistics */}
        <div className="mt-10 grid gap-5 md:grid-cols-3">

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">Total Events</p>
            <p className="mt-2 font-serif text-3xl text-[#403737]">
              {events.length}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">Categories</p>
            <p className="mt-2 font-serif text-3xl text-[#403737]">
              {new Set(events.map((event) => event.category)).size}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">Platform Status</p>
            <p className="mt-2 font-serif text-3xl text-green-600">
              Active
            </p>
          </div>

        </div>

        {/* Create Event Form */}
        {showForm && (
          <form
            onSubmit={handleAddEvent}
            className="mt-10 rounded-[28px] bg-white p-8 shadow-lg md:p-10"
          >

            <h2 className="font-serif text-2xl text-[#403737]">
              Create New Event
            </h2>

            <div className="mt-6 grid gap-6 md:grid-cols-2">

              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Event title"
                required
                className="rounded-xl border border-gray-200 px-5 py-4 outline-none focus:border-[#70484b]"
              />

              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="rounded-xl border border-gray-200 bg-white px-5 py-4 outline-none focus:border-[#70484b]"
              >
                <option>Technology</option>
                <option>Workshop</option>
                <option>Music</option>
                <option>Business</option>
                <option>Sports</option>
                <option>Other</option>
              </select>

              <input
                name="date"
                value={formData.date}
                onChange={handleChange}
                placeholder="Event date"
                required
                className="rounded-xl border border-gray-200 px-5 py-4 outline-none focus:border-[#70484b]"
              />

              <input
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Location"
                required
                className="rounded-xl border border-gray-200 px-5 py-4 outline-none focus:border-[#70484b]"
              />

              <input
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="Image URL"
                required
                className="rounded-xl border border-gray-200 px-5 py-4 outline-none focus:border-[#70484b] md:col-span-2"
              />

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Event description"
                required
                rows="4"
                className="rounded-xl border border-gray-200 px-5 py-4 outline-none focus:border-[#70484b] md:col-span-2"
              />

            </div>

            <button
              type="submit"
              className="mt-6 rounded-full bg-[#70484b] px-7 py-3 font-semibold text-white hover:bg-[#59393c]"
            >
              Create Event →
            </button>

          </form>
        )}

        {/* Event Management */}
        <div className="mt-12 rounded-[28px] bg-white p-8 shadow-sm">

          <h2 className="font-serif text-2xl text-[#403737]">
            Manage Events
          </h2>

          <div className="mt-6 overflow-x-auto">

            <table className="w-full min-w-[700px]">

              <thead>
                <tr className="border-b text-left text-sm text-gray-500">
                  <th className="pb-4">Event</th>
                  <th className="pb-4">Category</th>
                  <th className="pb-4">Date</th>
                  <th className="pb-4">Location</th>
                  <th className="pb-4">Action</th>
                </tr>
              </thead>

              <tbody>
                {events.map((event) => (
                  <tr
                    key={event._id}
                    className="border-b last:border-0"
                  >
                    <td className="py-5 font-medium text-[#403737]">
                      {event.title}
                    </td>

                    <td className="py-5 text-gray-500">
                      {event.category}
                    </td>

                    <td className="py-5 text-gray-500">
                      {event.date}
                    </td>

                    <td className="py-5 text-gray-500">
                      {event.location}
                    </td>

                    <td className="py-5">
                      <button
                        onClick={() => handleDelete(event._id)}
                        className="rounded-full bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-100"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>

          </div>

        </div>

      </div>
    </section>
  );
}

export default Admin;