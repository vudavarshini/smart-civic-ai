const axios = require("axios");
const fs = require("fs");
const path = require("path");
const FormData = require("form-data");
const Complaint = require("../models/Complaint");
const Notification = require("../models/Notification");

// @desc    Analyze uploaded image using AI Service
// @route   POST /api/complaints/detect
// @access  Private
const detectImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "Please upload an image" });
  }

  try {
    const aiServiceUrl = process.env.AI_SERVICE_URL || "http://127.0.0.1:8000";
    const filePath = req.file.path;
    
    // Create form data to forward to Python service
    const form = new FormData();
    form.append("image", fs.createReadStream(filePath), req.file.filename);

    const response = await axios.post(`${aiServiceUrl}/detect`, form, {
      headers: {
        ...form.getHeaders(),
      },
    });

    const relativeUrl = `/uploads/${req.file.filename}`;

    res.json({
      imageUrl: relativeUrl,
      detection: response.data,
    });
  } catch (error) {
    console.error("AI Service Error:", error.message);
    // Provide a fallback detection if Flask service is down
    const relativeUrl = `/uploads/${req.file.filename}`;
    
    // Simple heuristic fallback inside backend in case Python is not running
    const originalName = req.file.originalname.toLowerCase();
    let category = "Garbage";
    let priority = "Medium";
    let department = "Sanitation Department";
    let confidence = 0.50;

    if (originalName.includes("pothole")) {
      category = "Pothole";
      priority = "High";
      department = "Road Department";
      confidence = 0.90;
    } else if (originalName.includes("water") || originalName.includes("leak")) {
      category = "Water Leakage";
      priority = "High";
      department = "Water Department";
      confidence = 0.90;
    } else if (originalName.includes("light") || originalName.includes("street")) {
      category = "Broken Streetlight";
      priority = "Medium";
      department = "Electricity Department";
      confidence = 0.90;
    } else if (originalName.includes("road")) {
      category = "Damaged Road";
      priority = "High";
      department = "Road Department";
      confidence = 0.85;
    } else if (originalName.includes("drain")) {
      category = "Open Drain";
      priority = "High";
      department = "Sanitation Department";
      confidence = 0.90;
    }

    res.json({
      imageUrl: relativeUrl,
      detection: {
        category,
        confidence,
        priority,
        suggested_department: department,
        success: true,
        fallback: true
      },
    });
  }
};

// @desc    Submit a new complaint
// @route   POST /api/complaints
// @access  Private
const createComplaint = async (req, res) => {
  const {
    title,
    description,
    category,
    priority,
    latitude,
    longitude,
    imageUrl,
    assignedDepartment,
  } = req.body;

  try {
    const complaint = await Complaint.create({
      user: req.user._id,
      title,
      description,
      category,
      priority,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      imageUrl,
      assignedDepartment: assignedDepartment || "None",
      status: assignedDepartment && assignedDepartment !== "None" ? "Assigned" : "Pending",
    });

    // Create a notification for the citizen
    await Notification.create({
      user: req.user._id,
      title: "Complaint Submitted",
      message: `Your complaint for '${title}' (ID: ${complaint.complaintId}) has been successfully submitted.`,
      complaintId: complaint.complaintId,
    });

    res.status(201).json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all complaints (Citizen sees own, Admin sees all with filters)
// @route   GET /api/complaints
// @access  Private
const getComplaints = async (req, res) => {
  try {
    const query = {};

    // Filter by user if role is citizen
    if (req.user.role === "citizen") {
      query.user = req.user._id;
    }

    // Admin Filters
    if (req.query.status) {
      query.status = req.query.status;
    }
    if (req.query.category) {
      query.category = req.query.category;
    }
    if (req.query.department) {
      query.assignedDepartment = req.query.department;
    }
    if (req.query.search) {
      query.$or = [
        { title: { $regex: req.query.search, $options: "i" } },
        { description: { $regex: req.query.search, $options: "i" } },
        { complaintId: { $regex: req.query.search, $options: "i" } },
      ];
    }

    const sortOptions = {};
    if (req.query.sortBy) {
      const parts = req.query.sortBy.split(":");
      sortOptions[parts[0]] = parts[1] === "desc" ? -1 : 1;
    } else {
      sortOptions.createdAt = -1; // Newest first
    }

    const complaints = await Complaint.find(query)
      .populate("user", "name email phone")
      .sort(sortOptions);

    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get a single complaint details
// @route   GET /api/complaints/:id
// @access  Private
const getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id).populate("user", "name email phone address");

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    // Citizen can only view their own
    if (req.user.role === "citizen" && complaint.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to view this complaint" });
    }

    res.json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update complaint details (Status, Department, Priority)
// @route   PUT /api/complaints/:id
// @access  Private
const updateComplaint = async (req, res) => {
  const { status, assignedDepartment, priority } = req.body;

  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    const originalStatus = complaint.status;
    const originalDept = complaint.assignedDepartment;

    if (status) complaint.status = status;
    if (assignedDepartment) complaint.assignedDepartment = assignedDepartment;
    if (priority) complaint.priority = priority;

    // Auto update status to "Assigned" if department is assigned and status was Pending
    if (assignedDepartment && assignedDepartment !== "None" && complaint.status === "Pending") {
      complaint.status = "Assigned";
    }

    const updatedComplaint = await complaint.save();

    // Notify user on status update
    if (originalStatus !== updatedComplaint.status) {
      await Notification.create({
        user: complaint.user,
        title: "Complaint Status Updated",
        message: `Your complaint ${complaint.complaintId} status has changed from '${originalStatus}' to '${updatedComplaint.status}'.`,
        complaintId: complaint.complaintId,
      });
    }

    // Notify user on department assignment
    if (originalDept !== updatedComplaint.assignedDepartment && updatedComplaint.assignedDepartment !== "None") {
      await Notification.create({
        user: complaint.user,
        title: "Department Assigned",
        message: `Your complaint ${complaint.complaintId} has been assigned to the '${updatedComplaint.assignedDepartment}'.`,
        complaintId: complaint.complaintId,
      });
    }

    res.json(updatedComplaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete complaint
// @route   DELETE /api/complaints/:id
// @access  Private/Admin
const deleteComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    // Delete image if local file
    if (complaint.imageUrl.startsWith("/uploads/")) {
      const imgPath = path.join(__dirname, "..", complaint.imageUrl);
      if (fs.existsSync(imgPath)) {
        fs.unlinkSync(imgPath);
      }
    }

    await complaint.deleteOne();
    res.json({ message: "Complaint removed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  detectImage,
  createComplaint,
  getComplaints,
  getComplaintById,
  updateComplaint,
  deleteComplaint,
};
