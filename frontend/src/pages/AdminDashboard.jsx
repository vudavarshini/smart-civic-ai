import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaFolderOpen, FaCheckCircle, FaHourglassHalf, FaExclamationTriangle, FaCalendarDay, FaChartBar, FaFileInvoice } from "react-icons/fa";
import axios from "axios";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import { Bar, Pie, Line } from "react-chartjs-2";

// Register Chart.js modules
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, PointElement, LineElement, Title, Tooltip, Legend);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("userInfo"));
      if (!user) return;

      const res = await axios.get("/api/admin/dashboard", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setStats(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch dashboard statistics");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending": return "bg-amber-100 text-amber-800";
      case "Assigned": return "bg-indigo-100 text-indigo-800";
      case "In Progress": return "bg-blue-100 text-blue-800";
      case "Resolved": return "bg-emerald-100 text-emerald-800";
      case "Rejected": return "bg-rose-100 text-rose-800";
      default: return "bg-slate-100 text-slate-800";
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="text-slate-500 text-xs mt-3">Loading analytics charts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-xs font-semibold">
          {error}
        </div>
      </div>
    );
  }

  const { cards, charts, recentComplaints } = stats;

  // Chart 1: Category Distribution (Pie)
  const categoryChartData = {
    labels: charts.category.map((c) => c.name),
    datasets: [
      {
        data: charts.category.map((c) => c.count),
        backgroundColor: [
          "#3b82f6", // Blue
          "#10b981", // Emerald
          "#ef4444", // Red
          "#f59e0b", // Amber
          "#8b5cf6", // Violet
          "#ec4899", // Pink
          "#14b8a6", // Teal
        ],
        borderWidth: 1,
      },
    ],
  };

  // Chart 2: Department Loads (Bar)
  const departmentChartData = {
    labels: charts.department.map((d) => d.name),
    datasets: [
      {
        label: "Complaints Assigned",
        data: charts.department.map((d) => d.count),
        backgroundColor: "#1e3a8a", // Navy
        borderRadius: 6,
      },
    ],
  };

  // Chart 3: Monthly Trends (Line)
  const monthlyChartData = {
    labels: charts.monthly.map((m) => m.month),
    datasets: [
      {
        label: "Issue Volume",
        data: charts.monthly.map((m) => m.count),
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        fill: true,
        tension: 0.3,
        pointBackgroundColor: "#3b82f6",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: { boxWidth: 12, font: { size: 10 } },
      },
    },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Banner */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight font-heading">
          Administrative Control Room
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Review municipal KPIs, categories distribution, and dispatcher workflows.
        </p>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-5 mb-8">
        {/* Card 1: Total */}
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
            <FaFolderOpen className="text-lg" />
          </div>
          <div>
            <p className="text-[10px] font-semibold text-slate-400 uppercase">Total Logged</p>
            <p className="text-xl font-bold text-slate-900 mt-0.5">{cards.totalComplaints}</p>
          </div>
        </div>

        {/* Card 2: Resolved */}
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
            <FaCheckCircle className="text-lg" />
          </div>
          <div>
            <p className="text-[10px] font-semibold text-slate-400 uppercase">Resolved</p>
            <p className="text-xl font-bold text-slate-900 mt-0.5">{cards.resolvedComplaints}</p>
          </div>
        </div>

        {/* Card 3: Pending */}
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
            <FaHourglassHalf className="text-lg" />
          </div>
          <div>
            <p className="text-[10px] font-semibold text-slate-400 uppercase">Pending Review</p>
            <p className="text-xl font-bold text-slate-900 mt-0.5">{cards.pendingComplaints}</p>
          </div>
        </div>

        {/* Card 4: High Priority */}
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-red-50 text-red-600 rounded-lg">
            <FaExclamationTriangle className="text-lg" />
          </div>
          <div>
            <p className="text-[10px] font-semibold text-slate-400 uppercase">High Priority</p>
            <p className="text-xl font-bold text-slate-900 mt-0.5">{cards.highPriorityComplaints}</p>
          </div>
        </div>

        {/* Card 5: Today's Complaints */}
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm flex items-center space-x-4 col-span-2 md:col-span-1">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
            <FaCalendarDay className="text-lg" />
          </div>
          <div>
            <p className="text-[10px] font-semibold text-slate-400 uppercase">Submitted Today</p>
            <p className="text-xl font-bold text-slate-900 mt-0.5">{cards.todayComplaints}</p>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Category Pie Chart */}
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm space-y-4">
          <h3 className="font-bold text-xs text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <FaChartBar className="text-blue-500" /> Issues By Category
          </h3>
          <div className="h-64 relative">
            {charts.category.length > 0 ? (
              <Pie data={categoryChartData} options={chartOptions} />
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">No data available</div>
            )}
          </div>
        </div>

        {/* Department Bar Chart */}
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm space-y-4">
          <h3 className="font-bold text-xs text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <FaChartBar className="text-indigo-500" /> Department Allocations
          </h3>
          <div className="h-64 relative">
            {charts.department.length > 0 ? (
              <Bar data={departmentChartData} options={chartOptions} />
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">No data available</div>
            )}
          </div>
        </div>

        {/* Line Chart: Monthly Trends */}
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm space-y-4">
          <h3 className="font-bold text-xs text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <FaChartBar className="text-blue-400" /> Six-Month Trends
          </h3>
          <div className="h-64 relative">
            {charts.monthly.length > 0 ? (
              <Line data={monthlyChartData} options={chartOptions} />
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">No data available</div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Complaints Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="font-bold text-xs text-slate-800 uppercase tracking-wider">
            Incoming Submissions Log
          </h3>
          <Link
            to="/admin/complaints"
            className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline"
          >
            Manage All Issues
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                <th className="py-3 px-5">ID</th>
                <th className="py-3 px-5">Title</th>
                <th className="py-3 px-5">Category</th>
                <th className="py-3 px-5">Reporter</th>
                <th className="py-3 px-5">Date</th>
                <th className="py-3 px-5">Status</th>
                <th className="py-3 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentComplaints.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-slate-400">
                    No complaints logged in system.
                  </td>
                </tr>
              ) : (
                recentComplaints.map((c) => (
                  <tr key={c._id} className="hover:bg-slate-50/50 transition">
                    <td className="py-3.5 px-5 font-bold text-slate-500">{c.complaintId}</td>
                    <td className="py-3.5 px-5 font-semibold text-slate-700 max-w-[200px] truncate">{c.title}</td>
                    <td className="py-3.5 px-5">
                      <span className="bg-slate-100 border border-slate-200/50 px-2.5 py-0.5 rounded text-[10px]">
                        {c.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-slate-500">{c.user?.name || "Unknown"}</td>
                    <td className="py-3.5 px-5 text-slate-400">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-5">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${getStatusColor(c.status)}`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <Link
                        to={`/complaints/${c._id}`}
                        className="inline-flex items-center space-x-1 font-bold text-blue-600 hover:text-blue-700 hover:underline"
                      >
                        <FaFileInvoice className="text-[10px]" />
                        <span>Inspect</span>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
