import { useState } from "react";
import { useEvents } from "../context/EventContext";

function Registration() {
  const { selectedEvent, registerForEvent, events } = useEvents();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const event = events.find(
      (item) => item.title === selectedEvent
    );

    if (event) {
      // MongoDB uses _id instead of id
      registerForEvent(event._id);
    }

    setSubmitted(true);
  };

  const resetForm = () => {
    setSubmitted(false);

    setFormData({
      name: "",
      email: "",
      phone: "",
    });
  };

  return (
    <section
      id="registration"
      className="min-h-screen bg-[#f8f6f3] px-6 py-24 lg:px-10"
    >
      <div className="mx-auto max-w-3xl">

        {/* Heading */}
        <div className="mb-12 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#a36f72]">
            Event Registration
          </p>

          <h1 className="mt-3 font-serif text-4xl text-[#403737] md:text-5xl">
            Reserve Your{" "}
            <span className="italic text-[#9c686b]">
              Experience.
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-gray-500">
            Complete the form below to register for your selected Eventora event.
          </p>
        </div>

        {submitted ? (
          /* Success */
          <div className="rounded-[28px] bg-white p-12 text-center shadow-lg">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl text-green-600">
              ✓
            </div>

            <h2 className="mt-6 font-serif text-3xl text-[#403737]">
              Registration Successful!
            </h2>

            <p className="mt-4 text-gray-500">
              Thank you,{" "}
              <strong>{formData.name}</strong>.
            </p>

            <p className="mt-2 text-gray-500">
              You are registered for{" "}
              <strong>{selectedEvent}</strong>.
            </p>

            <button
              onClick={resetForm}
              className="mt-8 rounded-full bg-[#70484b] px-7 py-3 text-sm font-semibold text-white transition hover:bg-[#59393c]"
            >
              Register Another Event
            </button>

          </div>
        ) : (
          /* Form */
          <form
            onSubmit={handleSubmit}
            className="rounded-[28px] bg-white p-8 shadow-lg md:p-12"
          >

            {/* Selected Event */}
            <div className="rounded-2xl bg-[#f8f1f1] p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#a36f72]">
                Selected Event
              </p>

              <p className="mt-2 font-serif text-xl text-[#403737]">
                {selectedEvent || "No event selected"}
              </p>
            </div>

            {/* Name */}
            <div className="mt-6">
              <label className="mb-2 block text-sm font-semibold text-[#403737]">
                Full Name
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
                className="w-full rounded-xl border border-gray-200 px-5 py-4 outline-none transition focus:border-[#70484b] focus:ring-2 focus:ring-[#eadbdd]"
              />
            </div>

            {/* Email */}
            <div className="mt-6">
              <label className="mb-2 block text-sm font-semibold text-[#403737]">
                Email Address
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                className="w-full rounded-xl border border-gray-200 px-5 py-4 outline-none transition focus:border-[#70484b] focus:ring-2 focus:ring-[#eadbdd]"
              />
            </div>

            {/* Phone */}
            <div className="mt-6">
              <label className="mb-2 block text-sm font-semibold text-[#403737]">
                Phone Number
              </label>

              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                required
                className="w-full rounded-xl border border-gray-200 px-5 py-4 outline-none transition focus:border-[#70484b] focus:ring-2 focus:ring-[#eadbdd]"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={!selectedEvent}
              className={`mt-8 w-full rounded-full px-6 py-4 font-semibold text-white transition ${
                selectedEvent
                  ? "bg-[#70484b] hover:bg-[#59393c]"
                  : "cursor-not-allowed bg-gray-300"
              }`}
            >
              {selectedEvent
                ? "Complete Registration →"
                : "Select an Event First"}
            </button>

          </form>
        )}

      </div>
    </section>
  );
}

export default Registration;