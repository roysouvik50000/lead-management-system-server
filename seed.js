const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const User = require("./models/User");

dotenv.config();

const seedAdmin = async () => {
    try {
        // connect to DB
        await mongoose.connect(process.env.MONGO_URI);

        // check if an admin already exists
        const existingAdmin = await User.findOne({ role: "Admin" });
        if (existingAdmin) {
            console.log("Admin user already exists:", existingAdmin.email);
            return process.exit();
        }

        // create admin
        const hashedPassword = await bcrypt.hash("admin123", 10);

        const admin = await User.create({
            name: "Super Admin",
            email: "admin@example.com",
            password: hashedPassword,
            role: "Admin",
        });
        console.log("Default Admin created:", admin.email);
    } catch (err) {
        console.error("Error seeding admin:", err.message);
    }
};

seedAdmin();
