import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaSearch, FaFilter, FaTrashAlt, FaFileCsv, FaEye, FaSync } from "react-icons/fa";
import axios from "axios";

const AdminComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [deptFilter, setDeptFilter] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  // Alert updates
  const [alertMsg, setAlertMsg] = useState("");
  const [alertType, setAlertType] = useState("success");

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem("userInfo"));
      if (!user) return;

      const res = await axios.get("/api/complaints", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setComplaints(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch complaints records database");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const user = JSON.parse(localStorage.getItem("userInfo"));
      const res = await axios.put(
        `/api/complaints/${id}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      
      // Update state
      setComplaints(complaints.map((c) => (c._id === id ? { ...c, status: res.data.status } : c)));
      triggerAlert("Status updated successfully!", "success");
    } catch (err) {
      console.error(err);
      triggerAlert("Failed to update status", "danger");
    }
  };

  const handleDeptChange = async (id, newDept) => {
    try {
      const user = JSON.parse(localStorage.getItem("userInfo"));
      const res = await axios.put(
        `/api/complaints/${id}`,
        { assignedDepartment: newDept },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      
      // Update state
      setComplaints(
        complaints.map((c) =>
          c._id === id
            ? { ...c, assignedDepartment: res.data.assignedDepartment, status: res.data.status }
            : c
        )
      );
      triggerAlert("Department reassigned successfully!", "success");
    } catch (err) {
      console.error(err);
      triggerAlert("Failed to reassign department", "danger");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to permanently delete this complaint? This action cannot be undone.")) {
      return;
    }

    try {
      const user = JSON.parse(localStorage.getItem("userInfo"));
      await axios.delete(`/api/complaints/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setComplaints(complaints.filter((c) => c._id !== id));
      triggerAlert("Complaint deleted from system.", "success");
    } catch (err) {
      console.error(err);
      triggerAlert("Failed to remove complaint.", "danger");
    }
  };

  const triggerAlert = (msg, type) => {
    setAlertMsg(msg);
    setAlertType(type);
    setTimeout(() => {
      setAlertMsg("");
    }, 4500);
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

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "Low": return "text-slate-600 bg-slate-50 border-slate-200";
      case "Medium": return "text-blue-600 bg-blue-50 border-blue-200";
      case "High": return "text-amber-700 bg-amber-50 border-amber-200";
      case "Critical": return "text-red-700 bg-red-50 border-red-200";
      default: return "text-slate-600 bg-slate-50 border-slate-200";
    }
  };

  // Compile CSV Export data
  const handleExportCSV = () => {
    if (filteredComplaints.length === 0) return;

    // Headers
    const headers = [
      "Complaint ID",
      "Title",
      "Reporter Name",
      "Reporter Email",
      "Category",
      "Priority",
      "Latitude",
      "Longitude",
      "Status",
      "Assigned Department",
      "Created Date",
    ];

    // Rows
    const rows = filteredComplaints.map((c) => [
      c.complaintId,
      `"${c.title.replace(/"/g, '""')}"`,
      c.user?.name || "Unknown",
      c.user?.email || "N/A",
      c.category,
      c.priority,
      c.latitude,
      c.longitude,
      c.status,
      c.assignedDepartment,
      new Date(c.createdAt).toLocaleDateString(),
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Smart_Civic_AI_Report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filters + Sort Pipeline
  const filteredComplaints = complaints
    .filter((c) => {
      const matchesSearch =
        c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.complaintId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (c.user?.name && c.user.name.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesStatus = statusFilter === "" || c.status === statusFilter;
      const matchesDept = deptFilter === "" || c.assignedDepartment === deptFilter;
      return matchesSearch && matchesStatus && matchesDept;
    })
    .sort((a, b) => {
      if (sortBy === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === "oldest") return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortBy === "priority") {
        const priOrder = { Critical: 4, High: 3, Medium: 2, Low: 1 };
        return priOrder[b.priority] - priOrder[a.priority];
      }
      return 0;
    });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight font-heading">
            Manage Civic Complaints
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Dispatch departments, update SLA statuses, and compile CSV spreadsheets.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchComplaints}
            className="p-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl transition shadow-sm"
            title="Refresh database"
          >
            <FaSync className={loading ? "animate-spin" : ""} />
          </button>
          <button
            onClick={handleExportCSV}
            disabled={filteredComplaints.length === 0}
            className="flex items-center space-x-1.5 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-semibold rounded-xl transition shadow-md shadow-emerald-500/10 text-xs"
          >
            <FaFileCsv className="text-sm" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Trigger Alert Info */}
      {alertMsg && (
        <div
          className={`px-4 py-3 rounded-lg text-xs font-semibold mb-6 border ${
            alertType === "danger" ? "bg-red-50 border-red-200 text-red-600" : "bg-emerald-50 border-emerald-200 text-emerald-700"
          }`}
        >
          {alertMsg}
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-xs font-semibold mb-6">
          {error}
        </div>
      )}

      {/* Query Filter panel */}
      <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
        {/* Search */}
        <div className="relative">
          <label htmlFor="adm-search" className="block text-[10px] text-slate-400 font-bold uppercase mb-1.5">Search Keywords</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <FaSearch className="text-xs" />
            </div>
            <input
              type="text"
              id="adm-search"
              className="w-full text-xs pl-8 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="ID, Title, Citizen name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Status */}
        <div>
          <label htmlFor="adm-flt-status" className="block text-[10px] text-slate-400 font-bold uppercase mb-1.5">Filter Status</label>
          <select
            id="adm-flt-status"
            className="w-full text-xs bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg focus:outline-none focus:border-blue-500"
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
        </div>

        {/* Department */}
        <div>
          <label htmlFor="adm-flt-dept" className="block text-[10px] text-slate-400 font-bold uppercase mb-1.5">Filter Department</label>
          <select
            id="adm-flt-dept"
            className="w-full text-xs bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg focus:outline-none focus:border-blue-500"
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
          >
            <option value="">All Departments</option>
            <option value="None">None</option>
            <option value="Road Department">Road Department</option>
            <option value="Water Department">Water Department</option>
            <option value="Electricity Department">Electricity Department</option>
            <option value="Sanitation Department">Sanitation Department</option>
            <option value="Municipality">Municipality</option>
            <option value="Public Works Department">Public Works Department</option>
          </select>
        </div>

        {/* Sort */}
        <div>
          <label htmlFor="adm-sort" className="block text-[10px] text-slate-400 font-bold uppercase mb-1.5">Sort Results By</label>
          <select
            id="adm-sort"
            className="w-full text-xs bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg focus:outline-none focus:border-blue-500"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest">Created: Newest First</option>
            <option value="oldest">Created: Oldest First</option>
            <option value="priority">Priority: Critical First</option>
          </select>
        </div>
      </div>

      {/* Main Database Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                <th className="py-4 px-5">ID</th>
                <th className="py-4 px-5">Title</th>
                <th className="py-4 px-5">Category</th>
                <th className="py-4 px-5">Priority</th>
                <th className="py-4 px-5">Reporter</th>
                <th className="py-4 px-5">Department Office</th>
                <th className="py-4 px-5">Status</th>
                <th className="py-4 px-5">Date</th>
                <th className="py-4 px-5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600">
              {loading ? (
                [1, 2, 3, 4].map((n) => (
                  <tr key={n} className="animate-pulse">
                    <td colSpan="9" className="py-4 px-5"><div className="h-4 bg-slate-100 rounded"></div></td>
                  </tr>
                ))
              ) : filteredComplaints.length === 0 ? (
                <tr>
                  <td colSpan="9" className="py-12 text-center text-slate-400 font-medium">
                    No complaints match your query parameters.
                  </td>
                </tr>
              ) : (
                filteredComplaints.map((c) => (
                  <tr key={c._id} className="hover:bg-slate-50/50 transition">
                    {/* ID */}
                    <td className="py-3.5 px-5 font-bold text-slate-400">{c.complaintId}</td>
                    
                    {/* Title */}
                    <td className="py-3.5 px-5 font-semibold text-slate-700 max-w-[150px] truncate" title={c.title}>
                      {c.title}
                    </td>
                    
                    {/* Category */}
                    <td className="py-3.5 px-5">
                      <span className="bg-slate-100 border border-slate-200/50 px-2 py-0.5 rounded text-[10px] text-slate-600 font-semibold">
                        {c.category}
                      </span>
                    </td>
                    
                    {/* Priority */}
                    <td className="py-3.5 px-5">
                      <span className={`px-2 py-0.5 border rounded text-[10px] font-semibold ${getPriorityColor(c.priority)}`}>
                        {c.priority}
                      </span>
                    </td>
                    
                    {/* Reporter */}
                    <td className="py-3.5 px-5 text-slate-500">
                      <p className="font-semibold">{c.user?.name || "Unknown"}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{c.user?.phone || "No Phone"}</p>
                    </td>
                    
                    {/* Department dropdown */}
                    <td className="py-3.5 px-5">
                      <select
                        aria-label="Assign Department"
                        className="bg-slate-50 border border-slate-200 py-1 px-2 rounded text-[11px] focus:outline-none"
                        value={c.assignedDepartment || "None"}
                        onChange={(e) => handleDeptChange(c._id, e.target.value)}
                      >
                        <option value="None">None</option>
                        <option value="Road Department">Road Dept.</option>
                        <option value="Water Department">Water Dept.</option>
                        <option value="Electricity Department">Electricity Dept.</option>
                        <option value="Sanitation Department">Sanitation Dept.</option>
                        <option value="Municipality">Municipality</option>
                        <option value="Public Works Department">PWD Dept.</option>
                      </select>
                    </td>
                    
                    {/* Status dropdown */}
                    <td className="py-3.5 px-5">
                      <select
                        aria-label="Update Status"
                        className={`py-1 px-2 rounded text-[11px] font-bold border focus:outline-none ${getStatusColor(
                          c.status
                        )}`}
                        value={c.status}
                        onChange={(e) => handleStatusChange(c._id, e.target.value)}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Assigned">Assigned</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </td>
                    
                    {/* Date */}
                    <td className="py-3.5 px-5 text-slate-400">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </td>
                    
                    {/* Actions */}
                    <td className="py-3.5 px-5 text-center flex items-center justify-center gap-3">
                      <Link
                        to={`/complaints/${c._id}`}
                        className="p-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded transition"
                        title="View detailed progress timeline"
                      >
                        <FaEye className="text-xs" />
                      </Link>
                      <button
                        onClick={() => handleDelete(c._id)}
                        className="p-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded transition"
                        title="Delete complaint from system"
                      >
                        <FaTrashAlt className="text-xs" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination placeholder */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase tracking-wider">
          <span>Showing {filteredComplaints.length} of {complaints.length} records</span>
          <span>Smart Civic AI SLA Database</span>
        </div>
      </div>
    </div>
  );
};

export default AdminComplaints;
