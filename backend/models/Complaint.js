const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(
  {
    complaintId: {
      type: String,
      required: true,
      unique: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: [
        "Pothole",
        "Garbage",
        "Water Leakage",
        "Broken Streetlight",
        "Damaged Road",
        "Illegal Dumping",
        "Open Drain",
      ],
    },
    priority: {
      type: String,
      required: true,
      enum: ["Low", "Medium", "High", "Critical"],
      default: "Medium",
    },
    latitude: {
      type: Number,
      required: [true, "Latitude is required"],
    },
    longitude: {
      type: Number,
      required: [true, "Longitude is required"],
    },
    imageUrl: {
      type: String,
      required: [true, "Image URL is required"],
    },
    status: {
      type: String,
      enum: ["Pending", "Assigned", "In Progress", "Resolved", "Rejected"],
      default: "Pending",
    },
    assignedDepartment: {
      type: String,
      enum: [
        "Road Department",
        "Water Department",
        "Electricity Department",
        "Sanitation Department",
        "Municipality",
        "Public Works Department",
        "None",
      ],
      default: "None",
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to auto-generate complaintId if not present
complaintSchema.pre("validate", function (next) {
  if (!this.complaintId) {
    const prefix = "COM";
    const rand = Math.floor(100000 + Math.random() * 900000);
    this.complaintId = `${prefix}-${rand}`;
  }
  next();
});

const Complaint = mongoose.model("Complaint", complaintSchema);
module.exports = Complaint;
