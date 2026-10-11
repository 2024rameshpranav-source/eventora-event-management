
require("dotenv").config();

const mongoose = require("mongoose");
const User = require("./models/User");

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const email = process.argv[2]?.trim().toLowerCase();

    if (!email) {
      console.log(
        "Usage: node createAdmin.js user@example.com"
      );
      return;
    }

    const user = await User.findOne({ email });

    if (!user) {
      console.log(
        "User not found. Register the account first, then run this script."
      );
      return;
    }

    user.role = "admin";
    await user.save();

    console.log(`Admin role assigned to ${user.email}`);
  } catch (error) {
    console.error("Admin setup failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

createAdmin();
