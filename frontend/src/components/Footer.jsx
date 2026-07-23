import React from "react";
import { FaPhoneAlt, FaEnvelope, FaBuilding, FaMapMarkerAlt } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-sm border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: About */}
          <div className="space-y-4">
            <h3 className="text-white font-bold text-base tracking-wide uppercase">Smart Civic AI</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              An AI-powered public infrastructure management system. Streamlining civic complaints, automated category classification, and prompt dispatch to Municipal bodies.
            </p>
            <div className="flex items-center space-x-2 text-xs">
              <FaBuilding className="text-blue-500" />
              <span>Smart India Hackathon 2026 Initiative</span>
            </div>
          </div>

          {/* Col 2: Useful Links */}
          <div>
            <h3 className="text-white font-bold text-xs uppercase tracking-wider mb-4">Quick Links</h3>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#about" className="hover:text-white transition">About the Platform</a>
              </li>
              <li>
                <a href="#features" className="hover:text-white transition">Core Features</a>
              </li>
              <li>
                <a href="https://data.gov.in" target="_blank" rel="noreferrer" className="hover:text-white transition">Data.gov.in Portal</a>
              </li>
              <li>
                <a href="https://mygov.in" target="_blank" rel="noreferrer" className="hover:text-white transition">MyGov India</a>
              </li>
            </ul>
          </div>

          {/* Col 3: Departments */}
          <div>
            <h3 className="text-white font-bold text-xs uppercase tracking-wider mb-4">Partner Depts.</h3>
            <ul className="space-y-2 text-xs">
              <li>Public Works Department (PWD)</li>
              <li>Municipal Corporation (Sanitation)</li>
              <li>State Electricity Board</li>
              <li>Water Resources & Sewage</li>
            </ul>
          </div>

          {/* Col 4: Helpdesk */}
          <div className="space-y-3 text-xs">
            <h3 className="text-white font-bold text-xs uppercase tracking-wider mb-4">National Helpdesk</h3>
            <div className="flex items-center space-x-2">
              <FaPhoneAlt className="text-blue-500" />
              <span>1800-111-CIVIC (1800-111-2484)</span>
            </div>
            <div className="flex items-center space-x-2">
              <FaEnvelope className="text-blue-500" />
              <span>support-civicai@gov.in</span>
            </div>
            <div className="flex items-start space-x-2">
              <FaMapMarkerAlt className="text-blue-500 mt-0.5" />
              <span>
                Ministry of Housing and Urban Affairs,<br />
                Nirman Bhawan, New Delhi, 110011
              </span>
            </div>
          </div>
        </div>

        <hr className="border-slate-800 my-8" />

        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Smart Civic AI. Developed for SIH 2026. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 sm:mt-0">
            <a href="#" className="hover:text-slate-400">Privacy Policy</a>
            <span>•</span>
            <a href="#" className="hover:text-slate-400">Terms of Service</a>
            <span>•</span>
            <a href="#" className="hover:text-slate-400">Security Guidelines</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
