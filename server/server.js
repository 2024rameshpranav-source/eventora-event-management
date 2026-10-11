
require("dotenv").config();

const express = require("express");
const http = require("http");
const cors = require("cors");
const mongoose = require("mongoose");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const { Server } = require("socket.io");
const { body, validationResult } = require("express-validator");

const Event = require("./models/Event");
const authRoutes = require("./routes/authRoutes");
const {
  authenticateToken,
  authorizeRoles,
} = require("./middleware/authMiddleware");

const app = express();
const httpServer = http.createServer(app);

// =========================
// SOCKET.IO CONFIGURATION
// =========================

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

io.on("connection", (socket) => {
  console.log("Socket.IO client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Socket.IO client disconnected:", socket.id);
  });
});

// Make Socket.IO available to route handlers
app.use((req, res, next) => {
  req.io = io;
  next();
});

// =========================
// SECURITY MIDDLEWARE
// =========================

app.use(helmet());

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(express.json({ limit: "10kb" }));

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    message: "Too many requests. Please try again later.",
  },
});

app.use("/api", apiLimiter);

// =========================
// AUTHENTICATION ROUTES
// =========================

app.use("/api/auth", authRoutes);

// =========================
// EVENT VALIDATION
// =========================

const validateEvent = [
  body("title").trim().notEmpty().withMessage("Title is required"),
  body("category").trim().notEmpty().withMessage("Category is required"),
  body("date").trim().notEmpty().withMessage("Date is required"),
  body("location").trim().notEmpty().withMessage("Location is required"),
  body("description").trim().notEmpty().withMessage("Description is required"),
  body("image").trim().notEmpty().withMessage("Image URL is required"),
];

// =========================
// GET ALL EVENTS - PUBLIC
// =========================

app.get("/api/events", async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: 1 });
    res.json(events);
  } catch (error) {
    console.error("Fetch events error:", error.message);
    res.status(500).json({ message: "Failed to fetch events" });
  }
});

// =========================
// GET ONE EVENT - PUBLIC
// =========================

app.get("/api/events/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json(event);
  } catch (error) {
    res.status(400).json({ message: "Invalid event ID" });
  }
});

// =========================
// CREATE EVENT - ADMIN ONLY
// =========================

app.post(
  "/api/events",
  authenticateToken,
  authorizeRoles("admin"),
  validateEvent,
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    try {
      const event = await Event.create({
        title: req.body.title,
        category: req.body.category,
        date: req.body.date,
        location: req.body.location,
        description: req.body.description,
        image: req.body.image,
      });

      // Broadcast only after MongoDB successfully creates the event
      req.io.emit("eventCreated", event);

      res.status(201).json(event);
    } catch (error) {
      console.error("Create event error:", error.message);
      res.status(400).json({ message: "Failed to create event" });
    }
  }
);

// =========================
// UPDATE EVENT - ADMIN ONLY
// =========================

app.put(
  "/api/events/:id",
  authenticateToken,
  authorizeRoles("admin"),
  validateEvent,
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    try {
      const event = await Event.findByIdAndUpdate(
        req.params.id,
        {
          title: req.body.title,
          category: req.body.category,
          date: req.body.date,
          location: req.body.location,
          description: req.body.description,
          image: req.body.image,
        },
        {
          new: true,
          runValidators: true,
        }
      );

      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }

      // Broadcast the updated document
      req.io.emit("eventUpdated", event);

      res.json(event);
    } catch (error) {
      console.error("Update event error:", error.message);
      res.status(400).json({ message: "Failed to update event" });
    }
  }
);

// =========================
// DELETE EVENT - ADMIN ONLY
// =========================

app.delete(
  "/api/events/:id",
  authenticateToken,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const event = await Event.findByIdAndDelete(req.params.id);

      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }

      // Broadcast the deleted event's ID
      req.io.emit("eventDeleted", {
        id: event._id.toString(),
      });

      res.json({ message: "Event deleted successfully" });
    } catch (error) {
      console.error("Delete event error:", error.message);
      res.status(400).json({ message: "Failed to delete event" });
    }
  }
);

// =========================
// SERVER STARTUP
// =========================

const PORT = process.env.PORT || 5000;

if (!process.env.MONGODB_URI || !process.env.JWT_SECRET) {
  console.error("Missing MONGODB_URI or JWT_SECRET in server/.env");
  process.exit(1);
}

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected successfully");

    httpServer.listen(PORT, () => {
      console.log(`Eventora REST API running on http://localhost:${PORT}`);
      console.log("Socket.IO is ready for real-time connections");
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  });
