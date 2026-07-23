const Complaint = require("../models/Complaint");
const User = require("../models/User");

// @desc    Get Admin Dashboard Stats & Chart Data
// @route   GET /api/admin/dashboard
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
  try {
    // 1. Dashboard Cards Statistics
    const totalComplaints = await Complaint.countDocuments();
    const resolvedComplaints = await Complaint.countDocuments({ status: "Resolved" });
    const pendingComplaints = await Complaint.countDocuments({ status: "Pending" });
    
    // High Priority count (High + Critical)
    const highPriorityComplaints = await Complaint.countDocuments({
      priority: { $in: ["High", "Critical"] },
    });

    // Today's Complaints count
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const todayComplaints = await Complaint.countDocuments({
      createdAt: { $gte: startOfToday },
    });

    // 2. Charts Data
    
    // A. Complaints per Category
    const categoryData = await Complaint.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
    ]);

    // B. Complaints per Department
    const departmentData = await Complaint.aggregate([
      {
        $group: {
          _id: "$assignedDepartment",
          count: { $sum: 1 },
        },
      },
    ]);

    // C. Monthly Complaints (for last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const monthlyData = await Complaint.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
    ]);

    // Format monthly data for front-end
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const formattedMonthly = monthlyData.map((item) => {
      return {
        month: `${monthNames[item._id.month - 1]} ${item._id.year}`,
        count: item.count,
      };
    });

    // 3. Recent Complaints Table (limit 5)
    const recentComplaints = await Complaint.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .limit(6);

    res.json({
      cards: {
        totalComplaints,
        resolvedComplaints,
        pendingComplaints,
        highPriorityComplaints,
        todayComplaints,
      },
      charts: {
        category: categoryData.map(c => ({ name: c._id, count: c.count })),
        department: departmentData.map(d => ({ name: d._id, count: d.count })),
        monthly: formattedMonthly,
      },
      recentComplaints,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDashboardStats,
};
