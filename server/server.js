
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
// CORS CONFIGURATION
// =========================

const allowedOrigins = [
  "http://localhost:5173",
  process.env.CLIENT_URL?.replace(/\/$/, ""),
].filter(Boolean);

const isAllowedOrigin = (origin) => {
  if (!origin) return true;

  if (allowedOrigins.includes(origin)) {
    return true;
  }

  try {
    const url = new URL(origin);

    return (
      url.protocol === "https:" &&
      url.hostname.startsWith("eventora-event-management") &&
      url.hostname.endsWith(".vercel.app")
    );
  } catch {
    return false;
  }
};

const corsOptions = {
  origin: (origin, callback) => {
    if (isAllowedOrigin(origin)) {
      return callback(null, true);
    }

    console.error("Blocked CORS origin:", origin);
    return callback(new Error("Origin not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
};

// =========================
// SOCKET.IO CONFIGURATION
// =========================

const io = new Server(httpServer, {
  cors: corsOptions,
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
app.use(cors(corsOptions));
app.use(express.json({ limit: "10kb" }));

// =========================
// API RATE LIMITING
// =========================

const apiLimiter = rateLimit({
  windowMs: 2 * 60 * 1000, // 2 minutes
  limit: 5, // Maximum 5 requests per window per client IP
  standardHeaders: true,
  legacyHeaders: false,
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
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required"),
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
// CORS ERROR HANDLING
// =========================

app.use((error, req, res, next) => {
  if (error.message === "Origin not allowed by CORS") {
    return res.status(403).json({
      message: "Origin not allowed by CORS",
    });
  }

  next(error);
});

// =========================
// SERVER STARTUP
// =========================

const PORT = process.env.PORT || 5000;

if (!process.env.MONGODB_URI || !process.env.JWT_SECRET) {
  console.error("Missing MONGODB_URI or JWT_SECRET in server environment");
  process.exit(1);
}

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected successfully");

    httpServer.listen(PORT, () => {
      console.log(`Eventora REST API listening on port ${PORT}`);
      console.log("Socket.IO is ready for real-time connections");
      console.log("Allowed frontend origins:", allowedOrigins);
      console.log("API rate limit: 5 requests per 2 minutes per client IP");
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  });
