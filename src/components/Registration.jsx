
import { useState } from "react";
import { useEvents } from "../context/EventContext";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

function Registration() {
  const {
    selectedEvent,
    registerForEvent,
    events,
  } = useEvents();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const selectedEventData = events.find(
    (item) => item.title === selectedEvent
  );

  const handleChange = (e) => {
    setFormData((previous) => ({
      ...previous,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!selectedEventData) {
      setError("Please select a valid event first.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/registrations`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            email: formData.email.trim().toLowerCase(),
            eventId: selectedEventData._id,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Registration failed. Please try again."
        );
      }

      // Update local UI only after the backend confirms success.
      registerForEvent(selectedEventData._id);
      setSubmitted(true);
    } catch (err) {
      setError(
        err.message ||
          "Unable to register right now. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setSubmitted(false);
    setError("");

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
          <div className="rounded-[28px] bg-white p-12 text-center shadow-lg">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl text-green-600">
              ✓
            </div>

            <h2 className="mt-6 font-serif text-3xl text-[#403737]">
              Registration Successful!
            </h2>

            <p className="mt-4 text-gray-500">
              Thank you, <strong>{formData.name}</strong>.
            </p>

            <p className="mt-2 text-gray-500">
              You are registered for{" "}
              <strong>{selectedEvent}</strong>.
            </p>

            <p className="mt-3 text-sm text-gray-500">
              Your registration has been saved. Check your email
              for confirmation.
            </p>

            <button
              onClick={resetForm}
              className="mt-8 rounded-full bg-[#70484b] px-7 py-3 text-sm font-semibold text-white transition hover:bg-[#59393c]"
            >
              Register Another Event
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="rounded-[28px] bg-white p-8 shadow-lg md:p-12"
          >
            <div className="rounded-2xl bg-[#f8f1f1] p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#a36f72]">
                Selected Event
              </p>

              <p className="mt-2 font-serif text-xl text-[#403737]">
                {selectedEvent || "No event selected"}
              </p>
            </div>

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
                maxLength={100}
                autoComplete="name"
                required
                className="w-full rounded-xl border border-gray-200 px-5 py-4 outline-none transition focus:border-[#70484b] focus:ring-2 focus:ring-[#eadbdd]"
              />
            </div>

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
                autoComplete="email"
                required
                className="w-full rounded-xl border border-gray-200 px-5 py-4 outline-none transition focus:border-[#70484b] focus:ring-2 focus:ring-[#eadbdd]"
              />
            </div>

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
                autoComplete="tel"
                maxLength={20}
                required
                className="w-full rounded-xl border border-gray-200 px-5 py-4 outline-none transition focus:border-[#70484b] focus:ring-2 focus:ring-[#eadbdd]"
              />
            </div>

            {error && (
              <p role="alert" className="mt-5 text-sm text-red-600">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={!selectedEventData || submitting}
              className={`mt-8 w-full rounded-full px-6 py-4 font-semibold text-white transition ${
                selectedEventData && !submitting
                  ? "bg-[#70484b] hover:bg-[#59393c]"
                  : "cursor-not-allowed bg-gray-300"
              }`}
            >
              {submitting
                ? "Registering..."
                : selectedEventData
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
