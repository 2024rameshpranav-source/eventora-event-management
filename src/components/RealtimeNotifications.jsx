
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:5000";

function RealtimeNotifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const socket = io(SOCKET_URL);

    const addNotification = (message) => {
      setNotifications((previous) => [
        {
          id: `${Date.now()}-${Math.random()}`,
          message,
        },
        ...previous,
      ].slice(0, 5));
    };

    socket.on("connect", () => {
      console.log("Connected to Eventora real-time server");
    });

    socket.on("connect_error", (error) => {
      console.error("Socket.IO connection failed:", error.message);
    });

    socket.on("eventCreated", (event) => {
      addNotification(`New event created: ${event.title}`);
    });

    socket.on("eventUpdated", (event) => {
      addNotification(`Event updated: ${event.title}`);
    });

    socket.on("eventDeleted", ({ id }) => {
      addNotification(`An event was deleted (ID: ${id})`);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  if (notifications.length === 0) {
    return null;
  }

  return (
    <aside
      aria-live="polite"
      className="fixed bottom-5 right-5 z-50 w-[min(90vw,380px)] space-y-3"
    >
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className="rounded-xl border border-[#eadedf] bg-white p-4 shadow-lg"
        >
          <p className="text-sm font-medium text-[#70484b]">
            Real-Time Event Update
          </p>
          <p className="mt-1 text-sm text-gray-600">
            {notification.message}
          </p>
        </div>
      ))}
    </aside>
  );
}

export default RealtimeNotifications;
