
import { createContext, useContext, useEffect, useState } from "react";

const EventContext = createContext();

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const API_URL = `${API_BASE_URL}/api/events`;

export function EventProvider({ children }) {
  const [events, setEvents] = useState([]);
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState("");

  // FETCH EVENTS
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }

        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // ADD EVENT
  const addEvent = async (eventData) => {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to add event");
      }

      setEvents((previous) => [...previous, data]);
      return data;
    } catch (error) {
      console.error("Error adding event:", error);
      throw error;
    }
  };

  // DELETE EVENT
  const deleteEvent = async (eventId) => {
    try {
      const response = await fetch(`${API_URL}/${eventId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete event");
      }

      setEvents((previous) =>
        previous.filter((event) => event._id !== eventId)
      );
    } catch (error) {
      console.error("Error deleting event:", error);
      throw error;
    }
  };

  // UPDATE EVENT
  const updateEvent = async (eventId, eventData) => {
    try {
      const response = await fetch(`${API_URL}/${eventId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update event");
      }

      setEvents((previous) =>
        previous.map((event) =>
          event._id === eventId ? data : event
        )
      );

      return data;
    } catch (error) {
      console.error("Error updating event:", error);
      throw error;
    }
  };

  // REGISTER FOR EVENT
  const registerForEvent = (eventId) => {
    setRegisteredEvents((previous) => {
      if (previous.includes(eventId)) {
        return previous;
      }

      return [...previous, eventId];
    });
  };

  // SELECT EVENT
  const selectEventForRegistration = (event) => {
    setSelectedEvent(event);
  };

  // SEARCH + CATEGORY FILTER
  const filteredEvents = events.filter((event) => {
    const matchesCategory =
      selectedCategory === "All" ||
      event.category === selectedCategory;

    const matchesSearch = (event.title || "")
      .toLowerCase()
      .includes(search.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const value = {
    events,
    setEvents,
    addEvent,
    deleteEvent,
    updateEvent,
    registeredEvents,
    registerForEvent,
    selectedEvent,
    selectEventForRegistration,
    selectedCategory,
    setSelectedCategory,
    search,
    setSearch,
    loading,
    filteredEvents,
  };

  return (
    <EventContext.Provider value={value}>
      {children}
    </EventContext.Provider>
  );
}

export function useEvents() {
  return useContext(EventContext);
}
