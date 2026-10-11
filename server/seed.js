require("dotenv").config();

const mongoose = require("mongoose");
const Event = require("./models/Event");

const events = [
  {
    title: "Tech Innovation Summit",
    category: "Technology",
    date: "18 September 2026",
    location: "Mumbai, India",
    description:
      "Explore emerging technologies, innovative ideas and the future of digital transformation.",
    image:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Creative Design Workshop",
    category: "Workshop",
    date: "25 September 2026",
    location: "Pune, India",
    description:
      "Learn creative design techniques and collaborate with designers and creators.",
    image:
      "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Music & Culture Festival",
    category: "Music",
    date: "03 October 2026",
    location: "Mumbai, India",
    description:
      "Experience live performances, cultural activities and an unforgettable evening.",
    image:
      "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Startup Networking Meet",
    category: "Business",
    date: "12 October 2026",
    location: "Bangalore, India",
    description:
      "Connect with entrepreneurs, professionals and startup enthusiasts.",
    image:
      "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=900&q=80",
  },
];

mongoose
  .connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log("MongoDB connected");

    await Event.deleteMany({});
    await Event.insertMany(events);

    console.log("4 events added successfully");

    await mongoose.disconnect();
    console.log("MongoDB connection closed");
  })
  .catch((error) => {
    console.error("Seeding failed:", error.message);
    process.exit(1);
  });