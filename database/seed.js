const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const path = require("path");

// Load backend .env config
require("dotenv").config({ path: path.join(__dirname, "..", "backend", ".env") });

const User = require("../backend/models/User");
const Complaint = require("../backend/models/Complaint");
const Notification = require("../backend/models/Notification");

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/smart-civic-ai";

const seedData = async () => {
  try {
    console.log(`Connecting to database: ${MONGO_URI}...`);
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB. Purging existing database collections...");
    
    await User.deleteMany({});
    await Complaint.deleteMany({});
    await Notification.deleteMany({});
    
    console.log("Database cleared. Generating core seed records...");

    // 1. Create Users
    const salt = await bcrypt.genSalt(10);
    
    const citizenPassword = await bcrypt.hash("citizen123", salt);
    const adminPassword = await bcrypt.hash("admin123", salt);

    const users = await User.create([
      {
        name: "Rahul Sharma",
        email: "rahul@gmail.com",
        password: citizenPassword,
        phone: "9876543210",
        address: "Block C, Janakpuri, New Delhi",
        role: "citizen",
      },
      {
        name: "Anita Desai",
        email: "anita@gmail.com",
        password: citizenPassword,
        phone: "9123456789",
        address: "Sector 4, Dwarka, New Delhi",
        role: "citizen",
      },
      {
        name: "Director MoHUA",
        email: "admin@civicai.gov.in",
        password: adminPassword,
        phone: "9900112233",
        address: "Nirman Bhawan, New Delhi",
        role: "admin",
      },
    ]);

    const rahul = users[0];
    const anita = users[1];
    
    console.log("Users and Admin profiles registered successfully.");

    // 2. Create Sample Complaints
    // Coordinate clusters inside New Delhi
    const complaints = [
      {
        user: rahul._id,
        title: "Deep Pothole on Main Connaught Place Intersection",
        description: "A deep pothole has formed right at the turn of Outer Circle near Block A. Vehicles are suddenly swerving, causing extreme traffic logs and minor bumper accidents. Immediate asphalt repairs required.",
        category: "Pothole",
        priority: "High",
        latitude: 28.6315,
        longitude: 77.2185,
        imageUrl: "https://images.unsplash.com/photo-1515162305285-0293e4767cc2?q=80&w=600&auto=format&fit=crop",
        status: "Pending",
        assignedDepartment: "None",
      },
      {
        user: rahul._id,
        title: "Illegal Trash Dumping Near Janakpuri Metro Station",
        description: "Residents and local vendors are dumping huge plastic bags and vegetable waste right next to Pillar 42. It has created a foul smell and is attracting stray dogs. Municipal garbage bins needed here.",
        category: "Garbage",
        priority: "Medium",
        latitude: 28.6284,
        longitude: 77.0782,
        imageUrl: "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?q=80&w=600&auto=format&fit=crop",
        status: "Assigned",
        assignedDepartment: "Sanitation Department",
      },
      {
        user: anita._id,
        title: "Severe Water Leakage from Underground Pipeline",
        description: "Clean drinking water has been gushing out onto the road for the last 3 days near Dwarka Sector 4 Market (opposite Gate 1). The road has started sinking slightly. Please dispatch a repair team immediately.",
        category: "Water Leakage",
        priority: "High",
        latitude: 28.5925,
        longitude: 77.0505,
        imageUrl: "https://images.unsplash.com/photo-1542013936693-8848e574047a?q=80&w=600&auto=format&fit=crop",
        status: "In Progress",
        assignedDepartment: "Water Department",
      },
      {
        user: anita._id,
        title: "Broken Streetlight on Dark Corner of Park Lane",
        description: "Three consecutive streetlights are broken on Sector 4 Park Lane, making the street pitch black after 7 PM. Residents feel unsafe walking. Bulbs or wiring needs replacement.",
        category: "Broken Streetlight",
        priority: "Medium",
        latitude: 28.5962,
        longitude: 77.0425,
        imageUrl: "https://images.unsplash.com/photo-1509395062183-67c5ad6faff9?q=80&w=600&auto=format&fit=crop",
        status: "Resolved",
        assignedDepartment: "Electricity Department",
      },
      {
        user: rahul._id,
        title: "Clogged Open Drain Attracting Mosquitoes",
        description: "The main drain running along Block C is completely choked with plastic cups and plastic waste. Water has turned black and is overflowing onto the footpaths. High risk of disease outbreak.",
        category: "Open Drain",
        priority: "Critical",
        latitude: 28.6253,
        longitude: 77.0850,
        imageUrl: "https://images.unsplash.com/photo-1584267326895-d88985f71408?q=80&w=600&auto=format&fit=crop",
        status: "In Progress",
        assignedDepartment: "Sanitation Department",
      },
      {
        user: anita._id,
        title: "Cracked Asphalt and Craters on Dwarka Link Road",
        description: "A 50-meter stretch of the link road is completely eroded. High speed vehicles are suffering severe damage. Needs resurfacing rather than a simple patch work.",
        category: "Damaged Road",
        priority: "High",
        latitude: 28.5812,
        longitude: 77.0620,
        imageUrl: "https://images.unsplash.com/photo-1515162305285-0293e4767cc2?q=80&w=600&auto=format&fit=crop",
        status: "Assigned",
        assignedDepartment: "Road Department",
      },
    ];

    // Bulk create complaints using the schema model (pre-validate hook will auto generate complaint IDs)
    for (const c of complaints) {
      const created = await Complaint.create(c);
      
      // Also generate matching notification alerts for citizens
      await Notification.create({
        user: c.user,
        title: "Complaint Logged",
        message: `Your complaint for '${c.title}' (ID: ${created.complaintId}) has been successfully logged.`,
        complaintId: created.complaintId,
        read: c.status === "Resolved", // Mark read if resolved to show different read states
      });
      
      if (c.status !== "Pending") {
        await Notification.create({
          user: c.user,
          title: "SLA Update: " + c.status,
          message: `Your complaint ${created.complaintId} has progressed to state '${c.status}'.`,
          complaintId: created.complaintId,
          read: false,
        });
      }
    }

    console.log("Database seeded successfully with 6 complaints and related notifications.");
    mongoose.connection.close();
    console.log("Database connection closed.");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed: ", error.message);
    process.exit(1);
  }
};

seedData();
