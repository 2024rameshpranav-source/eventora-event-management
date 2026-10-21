
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
const Registration = require("./models/Registration");
const authRoutes = require("./routes/authRoutes");
const {
  authenticateToken,
  authorizeRoles,
} = require("./middleware/authMiddleware");
const { sendEmail } = require("./emailService");

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
  windowMs: 2 * 60 * 1000,
  limit: 5,
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
// REGISTRATION VALIDATION
// =========================

const validateRegistration = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ max: 100 })
    .withMessage("Name must be 100 characters or fewer"),
  body("email")
    .trim()
    .isEmail()
    .withMessage("A valid email address is required"),
  body("phone")
    .trim()
    .matches(/^\+?[0-9\s()-]{7,20}$/)
    .withMessage("A valid phone number is required"),
  body("eventId")
    .isMongoId()
    .withMessage("A valid event ID is required"),
];

// =========================
// GET ALL EVENTS - PUBLIC
// =========================

app.get("/api/events", async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: 1 });
    return res.json(events);
  } catch (error) {
    console.error("Fetch events error:", error.message);
    return res.status(500).json({ message: "Failed to fetch events" });
  }
});

// =========================
// GET ONE EVENT - PUBLIC
// =========================

app.get("/api/events/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid event ID" });
    }

    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    return res.json(event);
  } catch (error) {
    console.error("Fetch event error:", error.message);
    return res.status(500).json({ message: "Failed to fetch event" });
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

      // Existing real-time event notification
      req.io.emit("eventCreated", event);

      // Email notification to the admin
      void sendEmail({
        to: process.env.ADMIN_NOTIFICATION_EMAIL,
        subject: `New event added: ${event.title}`,
        text: [
          "A new event has been added to Eventora.",
          "",
          `Title: ${event.title}`,
          `Category: ${event.category}`,
          `Date: ${event.date}`,
          `Location: ${event.location}`,
        ].join("\n"),
      }).catch((error) => {
        console.error("Event notification email error:", error.message);
      });

      return res.status(201).json(event);
    } catch (error) {
      console.error("Create event error:", error.message);
      return res.status(500).json({ message: "Failed to create event" });
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
      if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({ message: "Invalid event ID" });
      }

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
      return res.json(event);
    } catch (error) {
      console.error("Update event error:", error.message);
      return res.status(500).json({ message: "Failed to update event" });
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
      if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({ message: "Invalid event ID" });
      }

      const event = await Event.findByIdAndDelete(req.params.id);

      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }

      req.io.emit("eventDeleted", {
        id: event._id.toString(),
      });

      return res.json({ message: "Event deleted successfully" });
    } catch (error) {
      console.error("Delete event error:", error.message);
      return res.status(500).json({ message: "Failed to delete event" });
    }
  }
);

// =========================
// REGISTER FOR EVENT - PUBLIC
// =========================

app.post(
  "/api/registrations",
  validateRegistration,
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "Invalid registration details",
        errors: errors.array(),
      });
    }

    try {
      const name = req.body.name.trim();
      const email = req.body.email.trim().toLowerCase();
      const phone = req.body.phone.trim();
      const { eventId } = req.body;

      const event = await Event.findById(eventId);

      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }

      let registration;

      try {
        registration = await Registration.create({
          name,
          email,
          phone,
          eventId: event._id,
          eventTitle: event.title,
        });
      } catch (error) {
        if (error.code === 11000) {
          return res.status(409).json({
            message: "This email is already registered for this event.",
          });
        }

        throw error;
      }

      // Broadcast only non-sensitive registration information
      req.io.emit("eventRegistrationCreated", {
        eventId: event._id.toString(),
        eventTitle: event.title,
      });

      // User confirmation email
      const emailJobs = [
        sendEmail({
          to: registration.email,
          subject: `Registration confirmed: ${event.title}`,
          text: [
            `Hello ${registration.name},`,
            "",
            `Your registration for "${event.title}" is confirmed.`,
            `Event date: ${event.date}`,
            `Location: ${event.location}`,
            "",
            "Thank you for registering with Eventora!",
          ].join("\n"),
        }),
      ];

      // Admin notification email
      if (process.env.ADMIN_NOTIFICATION_EMAIL) {
        emailJobs.push(
          sendEmail({
            to: process.env.ADMIN_NOTIFICATION_EMAIL,
            subject: `New registration: ${event.title}`,
            text: [
              "A new registration has been received.",
              "",
              `Event: ${event.title}`,
              `Name: ${registration.name}`,
              `Email: ${registration.email}`,
              `Phone: ${registration.phone}`,
            ].join("\n"),
          })
        );
      }

      // Email failure must not undo a successful database registration
      void Promise.allSettled(emailJobs).then((results) => {
        results.forEach((result) => {
          if (result.status === "rejected") {
            console.error(
              "Registration email error:",
              result.reason?.message || result.reason
            );
          } else if (result.value === false) {
            console.error("Brevo did not accept a registration email.");
          }
        });
      });

      return res.status(201).json({
        message: "Registration successful",
        registration: {
          id: registration._id,
          eventId: registration.eventId,
          eventTitle: registration.eventTitle,
          name: registration.name,
          email: registration.email,
        },
      });
    } catch (error) {
      console.error("Registration error:", error.message);
      return res.status(500).json({
        message: "Failed to complete registration",
      });
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

  console.error("Unhandled server error:", error.message);
  return res.status(500).json({ message: "Internal server error" });
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
      console.log(
        process.env.BREVO_API_KEY
          ? "Brevo API key detected"
          : "Brevo email notifications are not configured"
      );
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  });
