import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaPlusCircle, FaSearch, FaFilter, FaInbox, FaMapMarkerAlt, FaFileInvoice } from "react-icons/fa";
import axios from "axios";
import MapView from "../components/MapView";

const CitizenDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("userInfo"));
      if (!user) return;
      const res = await axios.get("/api/complaints", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setComplaints(res.data);
    } catch (err) {
      setError("Failed to fetch complaints history");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending": return "bg-amber-100 text-amber-800 border-amber-200";
      case "Assigned": return "bg-indigo-100 text-indigo-800 border-indigo-200";
      case "In Progress": return "bg-blue-100 text-blue-800 border-blue-200";
      case "Resolved": return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "Rejected": return "bg-rose-100 text-rose-800 border-rose-200";
      default: return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "Low": return "text-slate-500 bg-slate-50 border-slate-200";
      case "Medium": return "text-blue-500 bg-blue-50 border-blue-200";
      case "High": return "text-amber-600 bg-amber-50 border-amber-200";
      case "Critical": return "text-red-600 bg-red-50 border-red-200";
      default: return "text-slate-500 bg-slate-50 border-slate-200";
    }
  };

  // Filter complaints based on Search, Status, and Category
  const filteredComplaints = complaints.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.complaintId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "" || c.status === statusFilter;
    const matchesCategory = categoryFilter === "" || c.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight font-heading">Citizen Portal</h1>
          <p className="text-xs text-slate-500 mt-1">
            File infrastructure complaints and inspect real-time progress.
          </p>
        </div>
        <Link
          to="/complaints/new"
          className="flex items-center space-x-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition duration-150 shadow-lg shadow-blue-500/20 text-xs"
        >
          <FaPlusCircle />
          <span>Report New Complaint</span>
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-xs font-semibold mb-6">
          {error}
        </div>
      )}

      {/* Grid: Map + Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
        {/* Left: Map */}
        <div className="lg:col-span-8 bg-white border border-slate-200 p-4 rounded-2xl shadow-sm space-y-3">
          <div className="flex justify-between items-center px-1">
            <h3 className="font-bold text-sm text-slate-800 flex items-center space-x-2">
              <FaMapMarkerAlt className="text-blue-500" />
              <span>Reported Issues Geolocation</span>
            </h3>
            <span className="text-[11px] text-slate-400">Showing {filteredComplaints.length} issues</span>
          </div>
          <div className="h-80 w-full overflow-hidden rounded-xl border border-slate-200">
            {!loading && <MapView complaints={filteredComplaints} />}
          </div>
        </div>

        {/* Right: Quick Stats cards */}
        <div className="lg:col-span-4 grid grid-cols-1 gap-4">
          <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex flex-col justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Reports</p>
              <h3 className="text-4xl font-extrabold text-slate-900 mt-2 font-heading">{complaints.length}</h3>
            </div>
            <p className="text-[11px] text-slate-500 mt-4 pt-4 border-t border-slate-50">Complaints logged on this profile.</p>
          </div>
          <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex flex-col justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Resolved Issues</p>
              <h3 className="text-4xl font-extrabold text-emerald-600 mt-2 font-heading">
                {complaints.filter((c) => c.status === "Resolved").length}
              </h3>
            </div>
            <p className="text-[11px] text-slate-500 mt-4 pt-4 border-t border-slate-50">Issues resolved by departments.</p>
          </div>
          <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex flex-col justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Pending Action</p>
              <h3 className="text-4xl font-extrabold text-amber-600 mt-2 font-heading">
                {complaints.filter((c) => c.status === "Pending").length}
              </h3>
            </div>
            <p className="text-[11px] text-slate-500 mt-4 pt-4 border-t border-slate-50">Submissions awaiting department dispatch.</p>
          </div>
        </div>
      </div>

      {/* Filters & Search Row */}
      <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
        {/* Search */}
        <div className="w-full md:w-96 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <FaSearch className="text-xs" />
          </div>
          <input
            type="text"
            className="w-full text-xs pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
            placeholder="Search by ID, title, keyword..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filters */}
        <div className="w-full md:w-auto flex flex-wrap gap-3 items-center">
          <div className="flex items-center space-x-2 text-xs text-slate-400">
            <FaFilter />
            <span>Filter:</span>
          </div>
          {/* Status */}
          <select
            className="text-xs bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-lg focus:outline-none focus:border-blue-500"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Assigned">Assigned</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Rejected">Rejected</option>
          </select>
          {/* Category */}
          <select
            className="text-xs bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-lg focus:outline-none focus:border-blue-500"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="Pothole">Pothole</option>
            <option value="Garbage">Garbage</option>
            <option value="Water Leakage">Water Leakage</option>
            <option value="Broken Streetlight">Broken Streetlight</option>
            <option value="Damaged Road">Damaged Road</option>
            <option value="Illegal Dumping">Illegal Dumping</option>
            <option value="Open Drain">Open Drain</option>
          </select>
        </div>
      </div>

      {/* Complaints List Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-4 animate-pulse">
              <div className="h-4 bg-slate-200 rounded w-1/4"></div>
              <div className="h-6 bg-slate-200 rounded w-3/4"></div>
              <div className="h-24 bg-slate-200 rounded"></div>
              <div className="flex gap-2">
                <div className="h-6 bg-slate-200 rounded w-16"></div>
                <div className="h-6 bg-slate-200 rounded w-16"></div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredComplaints.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-sm">
          <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
            <FaInbox className="text-2xl" />
          </div>
          <h3 className="font-bold text-base text-slate-800">No complaints found</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            We couldn't find any complaints matching your filter criteria. Create a new complaint to start.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredComplaints.map((c) => (
            <div
              key={c._id}
              className="bg-white border border-slate-200 hover:border-slate-300 rounded-2xl shadow-sm hover:shadow transition flex flex-col justify-between overflow-hidden relative group"
            >
              {/* Image Banner */}
              <div className="h-40 w-full overflow-hidden bg-slate-100 border-b border-slate-100 relative">
                <img
                  src={c.imageUrl}
                  alt={c.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-200"
                />
                <span
                  className={`absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full shadow border ${getStatusColor(
                    c.status
                  )}`}
                >
                  {c.status}
                </span>
              </div>

              {/* Body */}
              <div className="p-5 flex-grow space-y-3">
                <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold">
                  <span>{c.complaintId}</span>
                  <span>{new Date(c.createdAt).toLocaleDateString()}</span>
                </div>
                
                <h4 className="font-bold text-slate-800 line-clamp-1 group-hover:text-blue-600 transition">
                  {c.title}
                </h4>
                
                <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed">
                  {c.description}
                </p>

                {/* Badges */}
                <div className="flex flex-wrap gap-2 pt-2">
                  <span className="text-[10px] font-semibold bg-slate-100 border border-slate-200 px-2 py-0.5 rounded text-slate-600">
                    {c.category}
                  </span>
                  <span className={`text-[10px] font-semibold border px-2 py-0.5 rounded ${getPriorityColor(c.priority)}`}>
                    {c.priority}
                  </span>
                  <span className="text-[10px] font-semibold bg-slate-100 border border-slate-200 px-2 py-0.5 rounded text-slate-600">
                    Dept: {c.assignedDepartment || "None"}
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <div className="p-4 bg-slate-50/50 border-t border-slate-50 flex items-center justify-end">
                <Link
                  to={`/complaints/${c._id}`}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline flex items-center space-x-1"
                >
                  <FaFileInvoice className="text-[10px]" />
                  <span>Inspect Timeline</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CitizenDashboard;
