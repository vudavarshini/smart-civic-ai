import React from "react";
import { Link } from "react-router-dom";
import { FaBrain, FaMapMarkerAlt, FaFileAlt, FaCheckCircle, FaUsers, FaArrowRight, FaShieldAlt } from "react-icons/fa";

const LandingPage = () => {
  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-gov-navy via-slate-900 to-blue-950 text-white py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Decorative Grid Overlays */}
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-600 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-emerald-600 rounded-full blur-3xl opacity-10"></div>

        <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero text */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-500/30 px-3.5 py-1.5 rounded-full text-xs font-semibold text-blue-400 tracking-wide">
              <FaShieldAlt className="text-xs" />
              <span>Smart India Hackathon 2026 Initiative</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-heading leading-tight">
              AI-Powered Civic <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">
                Complaint Management
              </span>
            </h1>
            <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto lg:mx-0 leading-relaxed font-sans font-light">
              Empowering citizens to report public infrastructure issues directly to local municipalities. Upload a photo, and let our AI classify, prioritize, and assign it to the proper department automatically.
            </p>
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 pt-4">
              <Link
                to="/login"
                className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition duration-200 shadow-xl shadow-blue-500/25 flex items-center justify-center space-x-2 text-sm"
              >
                <span>Report an Issue</span>
                <FaArrowRight className="text-xs" />
              </Link>
              <Link
                to="/login"
                className="px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold rounded-xl transition duration-200 backdrop-blur text-sm"
              >
                Admin Portal
              </Link>
            </div>
          </div>

          {/* Hero image placeholder or visual card */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-md bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-xl shadow-2xl space-y-6 relative">
              <div className="absolute top-4 right-4 flex items-center space-x-1.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full text-[10px] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                <span>Active</span>
              </div>
              <h3 className="text-white font-bold text-sm uppercase tracking-wider border-b border-white/10 pb-3">AI Detection Preview</h3>
              <div className="h-48 bg-slate-800 rounded-lg overflow-hidden flex items-center justify-center border border-slate-700 relative">
                {/* SVG representing a camera upload */}
                <svg className="w-12 h-12 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                <div className="absolute bottom-2 left-2 right-2 bg-slate-900/80 backdrop-blur border border-slate-700 p-2.5 rounded text-[11px] text-slate-300">
                  <span className="font-bold text-white">Detection Output:</span> Pothole (96% Confidence)
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                  <p className="text-slate-400">Severity</p>
                  <p className="text-amber-400 font-bold mt-0.5">High Priority</p>
                </div>
                <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                  <p className="text-slate-400">Assigned</p>
                  <p className="text-blue-400 font-bold mt-0.5">PWD Dept.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative -mt-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-xl border border-slate-100 p-6 sm:p-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="border-r border-slate-100 last:border-0">
            <p className="text-3xl font-extrabold text-blue-600 font-heading">24,800+</p>
            <p className="text-xs text-slate-500 font-medium mt-1">Issues Reported</p>
          </div>
          <div className="border-r border-slate-100 last:border-0">
            <p className="text-3xl font-extrabold text-emerald-600 font-heading">92.4%</p>
            <p className="text-xs text-slate-500 font-medium mt-1">Resolution Rate</p>
          </div>
          <div className="border-r border-slate-100 last:border-0">
            <p className="text-3xl font-extrabold text-indigo-600 font-heading">15 Mins</p>
            <p className="text-xs text-slate-500 font-medium mt-1">Avg. Dispatch Time</p>
          </div>
          <div className="last:border-0">
            <p className="text-3xl font-extrabold text-slate-900 font-heading">6 Departments</p>
            <p className="text-xs text-slate-500 font-medium mt-1">Integrated Systems</p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 font-heading">About the Portal</h2>
            <p className="text-slate-600 leading-relaxed text-sm">
              Smart Civic AI is a state-of-the-art administrative bridge developed for the Smart India Hackathon. The platform addresses a common pain point: manual routing delays and misclassified civic issues that stagnate municipal queues.
            </p>
            <p className="text-slate-600 leading-relaxed text-sm">
              By utilizing visual AI algorithms in combination with coordinate-mapped location services, citizens can flag road potholes, sewer damage, water loggings, or power grid streetlights. Our pipeline inspects the telemetry and dispatches work orders instantly, generating absolute administrative transparency.
            </p>
          </div>
          <div className="bg-slate-100 p-8 rounded-2xl border border-slate-200 space-y-4">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-blue-100 rounded-xl text-blue-600 shrink-0">
                <FaUsers className="text-xl" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Citizen Empowerment</h4>
                <p className="text-slate-500 text-xs mt-1">Gives local residents a direct voice and real-time validation for local issues.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-indigo-100 rounded-xl text-indigo-600 shrink-0">
                <FaCheckCircle className="text-xl" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Accountability & SLA Tracking</h4>
                <p className="text-slate-500 text-xs mt-1">Track issues from Pending, to Assigned, to In-Progress, and ultimate Resolution.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 bg-slate-100 border-t border-b border-slate-200 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center space-y-4 mb-16">
          <h2 className="text-3xl font-bold text-slate-900 font-heading">System Features</h2>
          <p className="text-slate-500 max-w-xl mx-auto text-sm">
            Discover the intelligent pipelines driving civic reporting efficiency.
          </p>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition space-y-4">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
              <FaBrain className="text-xl" />
            </div>
            <h3 className="font-bold text-lg text-slate-900">AI Image Analysis</h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              Detects potholes, electrical damage, sewage leakage, and garbage accumulations. Establishes priority scores and suggests proper municipal offices instantly.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition space-y-4">
            <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
              <FaMapMarkerAlt className="text-xl" />
            </div>
            <h3 className="font-bold text-lg text-slate-900">Geospatial Mapping</h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              Incorporates Leaflet and OpenStreetMap. Allows citizens to manually select exact complaint spots on a map or auto-detect using modern GPS positioning coordinates.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition space-y-4">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
              <FaFileAlt className="text-xl" />
            </div>
            <h3 className="font-bold text-lg text-slate-900">Report & Analytics</h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              Equips administrative units with dynamic charts, Excel and PDF report compilations, custom sorting, search filtering, and complaint assignment dispatch controls.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-12 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5 space-y-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-heading">Citizen Feedback Desk</h2>
            <p className="text-slate-500 text-sm leading-relaxed">
              For system inquiries, server support requests, or integration suggestions for local municipal wards, feel free to fill out the form or dial our desk.
            </p>
            <div className="space-y-3 text-xs text-slate-600">
              <p><strong>Nodal Office:</strong> Ministry of Housing & Urban Affairs, Delhi</p>
              <p><strong>General Support:</strong> support-civicai@gov.in</p>
              <p><strong>SLA Hotline:</strong> 1800-111-2484</p>
            </div>
          </div>

          <div className="lg:col-span-7">
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="contact-name" className="block text-xs font-semibold text-slate-600 mb-1.5">Name</label>
                  <input
                    type="text"
                    id="contact-name"
                    className="w-full text-xs px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="Enter name"
                  />
                </div>
                <div>
                  <label htmlFor="contact-email" className="block text-xs font-semibold text-slate-600 mb-1.5">Email</label>
                  <input
                    type="email"
                    id="contact-email"
                    className="w-full text-xs px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="Enter email"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="contact-message" className="block text-xs font-semibold text-slate-600 mb-1.5">Message</label>
                <textarea
                  id="contact-message"
                  rows="4"
                  className="w-full text-xs px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="Describe your query..."
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-xs transition duration-150"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
