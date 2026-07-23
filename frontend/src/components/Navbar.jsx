import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaBell, FaUser, FaSignOutAlt, FaMapMarkedAlt, FaPlusCircle, FaRegCheckCircle } from "react-icons/fa";
import axios from "axios";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userInfo, setUserInfo] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const user = localStorage.getItem("userInfo");
    if (user) {
      setUserInfo(JSON.parse(user));
      fetchNotifications();
    }
  }, [location]);

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("userInfo"));
      if (!user) return;
      const res = await axios.get("/api/notifications", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setNotifications(res.data);
      setUnreadCount(res.data.filter((n) => !n.read).length);
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMarkAllRead = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("userInfo"));
      await axios.put("/api/notifications/read", {}, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setNotifications(notifications.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error("Failed to mark notifications read", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    setUserInfo(null);
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 bg-gov-navy text-white shadow-md glass-nav border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3">
              <div className="p-2 bg-blue-600 rounded-lg text-white shadow-lg shadow-blue-500/30">
                <FaMapMarkedAlt className="text-xl" />
              </div>
              <div>
                <span className="font-extrabold text-lg tracking-wider block font-heading">
                  SMART CIVIC <span className="text-blue-400">AI</span>
                </span>
                <span className="text-[10px] text-slate-400 block tracking-widest uppercase font-sans">
                  Govt. of India Initiative
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6 text-sm font-medium">
            {userInfo ? (
              userInfo.role === "admin" ? (
                <>
                  <Link
                    to="/admin"
                    className={`hover:text-blue-400 transition-colors ${
                      location.pathname === "/admin" ? "text-blue-400 font-semibold" : "text-slate-300"
                    }`}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/admin/complaints"
                    className={`hover:text-blue-400 transition-colors ${
                      location.pathname === "/admin/complaints" ? "text-blue-400 font-semibold" : "text-slate-300"
                    }`}
                  >
                    Manage Issues
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/dashboard"
                    className={`hover:text-blue-400 transition-colors ${
                      location.pathname === "/dashboard" ? "text-blue-400 font-semibold" : "text-slate-300"
                    }`}
                  >
                    Citizen Dashboard
                  </Link>
                  <Link
                    to="/complaints/new"
                    className="flex items-center space-x-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition shadow-md shadow-blue-600/20"
                  >
                    <FaPlusCircle className="text-xs" />
                    <span>Report Issue</span>
                  </Link>
                </>
              )
            ) : (
              <>
                <a href="#about" className="text-slate-300 hover:text-white transition">
                  About
                </a>
                <a href="#features" className="text-slate-300 hover:text-white transition">
                  Features
                </a>
                <a href="#contact" className="text-slate-300 hover:text-white transition">
                  Contact
                </a>
              </>
            )}
          </div>

          {/* User Section / Actions */}
          <div className="flex items-center space-x-4">
            {userInfo ? (
              <>
                {/* Notification Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => {
                      setShowNotifications(!showNotifications);
                      if (!showNotifications) fetchNotifications();
                    }}
                    className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-full transition relative focus:outline-none"
                    aria-label="View notifications"
                  >
                    <FaBell className="text-lg" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-[9px] font-bold text-white flex items-center justify-center animate-pulse">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {showNotifications && (
                    <div className="absolute right-0 mt-3 w-80 bg-white text-slate-800 rounded-xl shadow-2xl border border-slate-100 overflow-hidden z-50">
                      <div className="p-3 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                        <span className="font-semibold text-sm">Notifications</span>
                        {unreadCount > 0 && (
                          <button
                            onClick={handleMarkAllRead}
                            className="text-[11px] text-blue-600 hover:underline flex items-center space-x-1"
                          >
                            <FaRegCheckCircle /> <span>Mark read</span>
                          </button>
                        )}
                      </div>
                      <div className="max-h-64 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="p-4 text-center text-xs text-slate-400">
                            No notifications yet
                          </div>
                        ) : (
                          notifications.map((n) => (
                            <div
                              key={n._id}
                              className={`p-3 border-b border-slate-50 hover:bg-slate-50 transition text-xs ${
                                !n.read ? "bg-blue-50/40" : ""
                              }`}
                            >
                              <div className="flex justify-between items-start">
                                <span className={`font-semibold ${!n.read ? "text-blue-700" : "text-slate-700"}`}>
                                  {n.title}
                                </span>
                                <span className="text-[10px] text-slate-400">
                                  {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                              <p className="text-slate-500 mt-1">{n.message}</p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Profile Link */}
                {userInfo.role === "citizen" && (
                  <Link
                    to="/profile"
                    className="flex items-center space-x-2 text-sm text-slate-300 hover:text-white p-1 rounded-lg transition hover:bg-white/5"
                  >
                    <div className="w-8 h-8 rounded-full bg-slate-700 border border-slate-500 flex items-center justify-center text-slate-200">
                      <FaUser className="text-xs" />
                    </div>
                    <span className="hidden lg:inline">{userInfo.name.split(" ")[0]}</span>
                  </Link>
                )}

                {userInfo.role === "admin" && (
                  <div className="hidden lg:flex items-center space-x-2 text-xs bg-red-950/40 border border-red-500/30 text-red-300 px-2.5 py-1.5 rounded-lg">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                    <span className="font-medium tracking-wide">ADMINISTRATOR</span>
                  </div>
                )}

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-300 hover:text-red-400 hover:bg-red-500/10 rounded-full transition"
                  title="Logout"
                >
                  <FaSignOutAlt className="text-lg" />
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm text-slate-300 hover:text-white transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition shadow-lg shadow-blue-500/20"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
