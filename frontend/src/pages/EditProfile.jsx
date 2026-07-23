import React, { useState, useEffect } from "react";
import { FaUser, FaPhone, FaMapMarkedAlt, FaLock, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import axios from "axios";

const EditProfile = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  
  // Password change fields
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ msg: "", type: "" });

  useEffect(() => {
    const userString = localStorage.getItem("userInfo");
    if (userString) {
      const user = JSON.parse(userString);
      setName(user.name);
      setEmail(user.email);
      setPhone(user.phone || "");
      setAddress(user.address || "");
    }
  }, []);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setAlert({ msg: "", type: "" });
    setLoading(true);

    try {
      const user = JSON.parse(localStorage.getItem("userInfo"));
      const res = await axios.put(
        "/api/auth/profile",
        { name, phone, address },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      // Save updated data
      localStorage.setItem("userInfo", JSON.stringify(res.data));
      setAlert({ msg: "Profile details updated successfully!", type: "success" });
    } catch (err) {
      console.error(err);
      setAlert({
        msg: err.response?.data?.message || "Failed to update profile details",
        type: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setAlert({ msg: "", type: "" });

    if (!password || !newPassword || !confirmPassword) {
      setAlert({ msg: "Please fill in all password fields", type: "danger" });
      return;
    }

    if (newPassword.length < 6) {
      setAlert({ msg: "New password must be at least 6 characters long", type: "danger" });
      return;
    }

    if (newPassword !== confirmPassword) {
      setAlert({ msg: "New passwords do not match", type: "danger" });
      return;
    }

    setLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem("userInfo"));
      await axios.put(
        "/api/auth/profile",
        { password: newPassword },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      setAlert({ msg: "Password changed successfully!", type: "success" });
      setPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error(err);
      setAlert({
        msg: err.response?.data?.message || "Failed to update password. Verify current password.",
        type: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight font-heading">Account Profile</h1>
        <p className="text-xs text-slate-500 mt-1">
          Maintain your contact address, phone records, and system access passwords.
        </p>
      </div>

      {alert.msg && (
        <div
          className={`px-4 py-3 rounded-lg text-xs font-semibold mb-6 flex items-center gap-2 border ${
            alert.type === "danger" ? "bg-red-50 border-red-200 text-red-600" : "bg-emerald-50 border-emerald-200 text-emerald-700"
          }`}
        >
          {alert.type === "danger" ? <FaExclamationCircle /> : <FaCheckCircle />}
          <span>{alert.msg}</span>
        </div>
      )}

      {/* Forms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Profile Card */}
        <div className="md:col-span-7 bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-slate-800 border-b pb-2 mb-2 flex items-center gap-1.5">
            <FaUser className="text-blue-600" /> <span>Personal Details</span>
          </h3>

          <form onSubmit={handleProfileUpdate} className="space-y-4 text-xs">
            {/* Email (Readonly) */}
            <div>
              <label htmlFor="prof-email" className="block font-semibold text-slate-400 mb-1.5">Email Address (Primary Login)</label>
              <input
                type="email"
                id="prof-email"
                readOnly
                value={email}
                className="w-full bg-slate-100 border border-slate-200 py-2.5 px-3 rounded-lg text-slate-400 focus:outline-none cursor-not-allowed"
              />
            </div>

            {/* Name */}
            <div>
              <label htmlFor="prof-name" className="block font-semibold text-slate-600 mb-1.5">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <FaUser className="text-xs" />
                </div>
                <input
                  type="text"
                  id="prof-name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:bg-white"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="prof-phone" className="block font-semibold text-slate-600 mb-1.5">Phone Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <FaPhone className="text-xs" />
                </div>
                <input
                  type="tel"
                  id="prof-phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:bg-white"
                  placeholder="e.g. 9876543210"
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <label htmlFor="prof-address" className="block font-semibold text-slate-600 mb-1.5">Residential Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <FaMapMarkedAlt className="text-xs" />
                </div>
                <input
                  type="text"
                  id="prof-address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:bg-white"
                  placeholder="e.g. Sector 4, Dwarka, New Delhi"
                />
              </div>
            </div>

            {/* Save Profile Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-lg transition duration-150"
              >
                Save Details
              </button>
            </div>
          </form>
        </div>

        {/* Change Password Card */}
        <div className="md:col-span-5 bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-slate-800 border-b pb-2 mb-2 flex items-center gap-1.5">
            <FaLock className="text-amber-600" /> <span>Security & Access</span>
          </h3>

          <form onSubmit={handlePasswordUpdate} className="space-y-4 text-xs">
            {/* Current Password */}
            <div>
              <label htmlFor="prof-pass" className="block font-semibold text-slate-600 mb-1.5">Current Password</label>
              <input
                type="password"
                id="prof-pass"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 py-2.5 px-3 rounded-lg focus:outline-none focus:border-blue-500 focus:bg-white"
                placeholder="••••••"
              />
            </div>

            {/* New Password */}
            <div>
              <label htmlFor="prof-newpass" className="block font-semibold text-slate-600 mb-1.5">New Password</label>
              <input
                type="password"
                id="prof-newpass"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 py-2.5 px-3 rounded-lg focus:outline-none focus:border-blue-500 focus:bg-white"
                placeholder="Min 6 chars"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="prof-confnewpass" className="block font-semibold text-slate-600 mb-1.5">Confirm New Password</label>
              <input
                type="password"
                id="prof-confnewpass"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 py-2.5 px-3 rounded-lg focus:outline-none focus:border-blue-500 focus:bg-white"
                placeholder="Re-enter new password"
              />
            </div>

            {/* Save Password Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-700 text-white font-semibold rounded-lg transition duration-150"
              >
                Change Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
