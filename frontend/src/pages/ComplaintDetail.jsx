import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaCalendarAlt, FaTag, FaFlag, FaBuilding, FaMapMarkerAlt, FaHistory, FaCheck, FaExclamationCircle } from "react-icons/fa";
import axios from "axios";
import MapView from "../components/MapView";

const ComplaintDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Data State
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userInfo, setUserInfo] = useState(null);

  // Admin Edit Form States
  const [status, setStatus] = useState("");
  const [assignedDepartment, setAssignedDepartment] = useState("");
  const [priority, setPriority] = useState("");
  const [updating, setUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState("");

  useEffect(() => {
    const user = localStorage.getItem("userInfo");
    if (user) {
      setUserInfo(JSON.parse(user));
    }
    fetchComplaintDetails();
  }, [id]);

  const fetchComplaintDetails = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("userInfo"));
      if (!user) return;
      
      const res = await axios.get(`/api/complaints/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      
      setComplaint(res.data);
      
      // Initialize edit fields
      setStatus(res.data.status);
      setAssignedDepartment(res.data.assignedDepartment);
      setPriority(res.data.priority);
    } catch (err) {
      console.error(err);
      setError("Failed to retrieve complaint file details");
    } finally {
      setLoading(false);
    }
  };

  const handleAdminUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setUpdateSuccess("");
    setError("");

    try {
      const user = JSON.parse(localStorage.getItem("userInfo"));
      const res = await axios.put(
        `/api/complaints/${id}`,
        { status, assignedDepartment, priority },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setComplaint(res.data);
      setUpdateSuccess("Complaint updated successfully!");
      setTimeout(() => setUpdateSuccess(""), 4000);
    } catch (err) {
      console.error(err);
      setError("Failed to update complaint fields");
    } finally {
      setUpdating(false);
    }
  };

  // Helper: Status timeline calculations
  const getTimelineSteps = (currentStatus) => {
    const allSteps = [
      { name: "Pending", label: "Complaint Submitted", desc: "Citizen filed issue; awaiting review." },
      { name: "Assigned", label: "Assigned to Department", desc: "Dispatched to responsible municipal unit." },
      { name: "In Progress", label: "Work In Progress", desc: "Department crew resolving on site." },
      { name: "Resolved", label: "Issue Resolved", desc: "Completed and verified by official." },
    ];

    if (currentStatus === "Rejected") {
      return [
        { name: "Pending", label: "Complaint Submitted", desc: "Citizen filed issue." },
        { name: "Rejected", label: "Complaint Rejected", desc: "Rejected due to invalid data or coordinates.", isEnd: true },
      ];
    }

    // Determine completion index
    let activeIdx = allSteps.findIndex(s => s.name === currentStatus);
    if (activeIdx === -1) activeIdx = 0;

    return allSteps.map((step, idx) => ({
      ...step,
      completed: idx <= activeIdx,
      current: idx === activeIdx,
    }));
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Pending": return "bg-amber-100 text-amber-800 border border-amber-200";
      case "Assigned": return "bg-indigo-100 text-indigo-800 border border-indigo-200";
      case "In Progress": return "bg-blue-100 text-blue-800 border border-blue-200";
      case "Resolved": return "bg-emerald-100 text-emerald-800 border border-emerald-200";
      case "Rejected": return "bg-rose-100 text-rose-800 border border-rose-200";
      default: return "bg-slate-100 text-slate-800 border border-slate-200";
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="text-slate-500 text-xs mt-3">Loading file records...</p>
      </div>
    );
  }

  if (error && !complaint) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-xs font-semibold">
          {error}
        </div>
        <Link to="/dashboard" className="inline-flex items-center text-xs text-blue-600 hover:underline mt-4">
          <FaArrowLeft className="mr-1.5" /> Return to dashboard
        </Link>
      </div>
    );
  }

  const steps = getTimelineSteps(complaint.status);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <Link
        to={userInfo?.role === "admin" ? "/admin/complaints" : "/dashboard"}
        className="inline-flex items-center text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline mb-6"
      >
        <FaArrowLeft className="mr-2" />
        <span>Return to List</span>
      </Link>

      {/* Header Info */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-200 pb-6 mb-8 gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-heading">
              {complaint.title}
            </h1>
            <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${getStatusBadge(complaint.status)}`}>
              {complaint.status}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-2 flex items-center gap-4">
            <span>ID: <strong className="text-slate-700">{complaint.complaintId}</strong></span>
            <span className="flex items-center gap-1.5">
              <FaCalendarAlt /> {new Date(complaint.createdAt).toLocaleDateString()} at {new Date(complaint.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </p>
        </div>
      </div>

      {updateSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-lg text-xs font-semibold mb-6 flex items-center gap-2">
          <FaCheck className="text-emerald-600" />
          <span>{updateSuccess}</span>
        </div>
      )}

      {/* Main Grid: Details + Map + Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Col: Photo & Core Details */}
        <div className="lg:col-span-8 space-y-6">
          {/* Main Card */}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            {/* Image */}
            <div className="h-96 w-full overflow-hidden bg-slate-100">
              <img
                src={complaint.imageUrl}
                alt={complaint.title}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Details Panel */}
            <div className="p-6 space-y-6">
              <div>
                <h3 className="font-bold text-sm text-slate-800 border-b pb-2 mb-3">Complaint Description</h3>
                <p className="text-slate-600 text-xs leading-relaxed whitespace-pre-line">
                  {complaint.description}
                </p>
              </div>

              {/* Attributes Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-100">
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">Category</span>
                  <span className="inline-flex items-center gap-1.5 text-xs text-slate-700 font-bold">
                    <FaTag className="text-slate-400" /> {complaint.category}
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">Priority</span>
                  <span className="inline-flex items-center gap-1.5 text-xs text-slate-700 font-bold">
                    <FaFlag className="text-slate-400" /> {complaint.priority}
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">Department</span>
                  <span className="inline-flex items-center gap-1.5 text-xs text-slate-700 font-bold">
                    <FaBuilding className="text-slate-400" /> {complaint.assignedDepartment}
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">Reporter</span>
                  <span className="text-xs text-slate-700 font-bold block truncate">
                    {complaint.user?.name || "Unknown"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Map Location Card */}
          <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2">
              <FaMapMarkerAlt className="text-red-500" /> Map Coordinates
            </h3>
            <div className="h-64 rounded-xl overflow-hidden border border-slate-200">
              <MapView
                center={[complaint.latitude, complaint.longitude]}
                zoom={14}
                complaints={[complaint]}
              />
            </div>
            <div className="flex justify-between items-center text-[10px] text-slate-400 px-1">
              <span>Latitude: <strong>{complaint.latitude}</strong></span>
              <span>Longitude: <strong>{complaint.longitude}</strong></span>
            </div>
          </div>
        </div>

        {/* Right Col: Timeline & Admin Options */}
        <div className="lg:col-span-4 space-y-6">
          {/* Action Timeline */}
          <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-5">
            <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2 border-b pb-3">
              <FaHistory className="text-blue-500" /> Track Resolution SLA
            </h3>

            {/* Timeline Wrapper */}
            <div className="relative pl-6 space-y-6">
              {/* Central vertical line */}
              <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-slate-100"></div>

              {steps.map((step, idx) => (
                <div key={idx} className="relative">
                  {/* Dot */}
                  <div
                    className={`absolute -left-[24px] top-1 w-3.5 h-3.5 rounded-full border-2 border-white shadow flex items-center justify-center ${
                      step.name === "Rejected"
                        ? "bg-red-500"
                        : step.completed
                        ? step.current
                          ? "bg-blue-600 ring-4 ring-blue-100"
                          : "bg-emerald-500"
                        : "bg-slate-200"
                    }`}
                  >
                    {step.completed && !step.current && step.name !== "Rejected" && (
                      <FaCheck className="text-[7px] text-white" />
                    )}
                  </div>
                  
                  {/* Step labels */}
                  <div className="pl-1">
                    <h4
                      className={`text-xs font-bold ${
                        step.name === "Rejected"
                          ? "text-red-600"
                          : step.completed
                          ? "text-slate-800"
                          : "text-slate-400"
                      }`}
                    >
                      {step.label}
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">{step.desc}</p>
                    
                    {step.current && (
                      <span className="inline-block mt-2 text-[9px] font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full uppercase tracking-wider border border-blue-100">
                        Current State
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Admin Management Widget */}
          {userInfo?.role === "admin" && (
            <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2 border-b pb-3">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping"></span>
                <span>Admin Actions</span>
              </h3>
              
              <form onSubmit={handleAdminUpdate} className="space-y-4 text-xs">
                {/* Status Dropdown */}
                <div>
                  <label htmlFor="adm-status" className="block font-semibold text-slate-600 mb-1.5">Update Status</label>
                  <select
                    id="adm-status"
                    className="w-full bg-slate-50 border border-slate-200 py-2.5 px-3 rounded-lg focus:outline-none focus:border-blue-500 focus:bg-white"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Assigned">Assigned</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>

                {/* Priority Dropdown */}
                <div>
                  <label htmlFor="adm-priority" className="block font-semibold text-slate-600 mb-1.5">Priority Level</label>
                  <select
                    id="adm-priority"
                    className="w-full bg-slate-50 border border-slate-200 py-2.5 px-3 rounded-lg focus:outline-none focus:border-blue-500 focus:bg-white"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>

                {/* Department Dropdown */}
                <div>
                  <label htmlFor="adm-dept" className="block font-semibold text-slate-600 mb-1.5">Assign Department</label>
                  <select
                    id="adm-dept"
                    className="w-full bg-slate-50 border border-slate-200 py-2.5 px-3 rounded-lg focus:outline-none focus:border-blue-500 focus:bg-white"
                    value={assignedDepartment}
                    onChange={(e) => setAssignedDepartment(e.target.value)}
                  >
                    <option value="None">None</option>
                    <option value="Road Department">Road Department</option>
                    <option value="Water Department">Water Department</option>
                    <option value="Electricity Department">Electricity Department</option>
                    <option value="Sanitation Department">Sanitation Department</option>
                    <option value="Municipality">Municipality</option>
                    <option value="Public Works Department">Public Works Department</option>
                  </select>
                </div>

                {/* Save Buttons */}
                <button
                  type="submit"
                  disabled={updating}
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-600 text-white font-semibold rounded-lg text-xs transition duration-150 flex items-center justify-center space-x-1.5"
                >
                  {updating ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Saving Changes...</span>
                    </>
                  ) : (
                    <span>Apply Actions</span>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComplaintDetail;
