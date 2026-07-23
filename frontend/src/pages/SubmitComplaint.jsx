import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCloudUploadAlt, FaBrain, FaMapPin, FaCompass, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import axios from "axios";
import MapView from "../components/MapView";

const SubmitComplaint = () => {
  const navigate = useNavigate();
  
  // Form fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  
  // AI Prediction state
  const [imageUrl, setImageUrl] = useState("");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState("");
  const [assignedDepartment, setAssignedDepartment] = useState("");
  const [confidence, setConfidence] = useState(null);
  const [isLowConfidence, setIsLowConfidence] = useState(false);

  // UI state
  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState("");

  // Map state
  const [mapCenter, setMapCenter] = useState([28.6139, 77.2090]); // Delhi
  const [selectedLoc, setSelectedLoc] = useState(null);

  // Auto detect location
  const handleAutoLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = parseFloat(position.coords.latitude.toFixed(6));
          const lng = parseFloat(position.coords.longitude.toFixed(6));
          setLatitude(lat.toString());
          setLongitude(lng.toString());
          setMapCenter([lat, lng]);
          setSelectedLoc({ lat, lng });
        },
        (error) => {
          setError("Failed to fetch location coordinates. Please select manually on the map.");
        }
      );
    } else {
      setError("Geolocation is not supported by your browser.");
    }
  };

  // Location select on map click
  const handleMapClick = (latlng) => {
    setLatitude(latlng.lat.toString());
    setLongitude(latlng.lng.toString());
    setSelectedLoc({ lat: latlng.lat, lng: latlng.lng });
  };

  // Upload image to backend for AI detection
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check size limit (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("File exceeds maximum upload size (5MB).");
      return;
    }

    setError("");
    setUploadingImage(true);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const user = JSON.parse(localStorage.getItem("userInfo"));
      const res = await axios.post("/api/complaints/detect", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${user.token}`,
        },
      });

      const { imageUrl: responseImg, detection } = res.data;
      
      setImageUrl(responseImg);
      setCategory(detection.category);
      setPriority(detection.priority);
      setAssignedDepartment(detection.suggested_department);
      
      const conf = Math.round(detection.confidence * 100);
      setConfidence(conf);
      setIsLowConfidence(conf < 70); // Mark low confidence if < 70%
    } catch (err) {
      console.error(err);
      setError("AI analysis failed, but you can still fill out the details manually.");
    } finally {
      setUploadingImage(false);
    }
  };

  // Handle final submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!title || !description || !latitude || !longitude || !imageUrl || !category || !priority) {
      setError("Please complete all sections, upload an image and select a map location.");
      return;
    }

    setSubmitLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem("userInfo"));
      await axios.post(
        "/api/complaints",
        {
          title,
          description,
          category,
          priority,
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
          imageUrl,
          assignedDepartment,
        },
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );

      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response && err.response.data.message
          ? err.response.data.message
          : "Submission failed. Please check network connections."
      );
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight font-heading">Report Civic Issue</h1>
        <p className="text-xs text-slate-500 mt-1">
          Upload an image, our AI will classify the department, and pinpoint it on the municipal mapping coordinate system.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-xs font-semibold mb-6">
          {error}
        </div>
      )}

      {/* Main Layout Grid */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: Photo + AI Classification Panel */}
        <div className="lg:col-span-6 space-y-6">
          {/* File Upload card */}
          <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-slate-800">1. Upload Issue Image</h3>
            
            {imageUrl ? (
              <div className="relative h-60 w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                <img src={imageUrl} alt="Uploaded Civic Issue" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => {
                    setImageUrl("");
                    setCategory("");
                    setPriority("");
                    setAssignedDepartment("");
                    setConfidence(null);
                    setIsLowConfidence(false);
                  }}
                  className="absolute bottom-3 right-3 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-[10px] font-bold shadow-md transition"
                >
                  Change Photo
                </button>
              </div>
            ) : (
              <label
                htmlFor="complaint-image"
                className={`h-60 w-full rounded-xl border-2 border-dashed border-slate-200 hover:border-blue-500 bg-slate-50 hover:bg-slate-100/40 cursor-pointer flex flex-col items-center justify-center transition p-4 ${
                  uploadingImage ? "pointer-events-none" : ""
                }`}
              >
                {uploadingImage ? (
                  <div className="text-center space-y-3">
                    <FaBrain className="text-4xl text-blue-600 animate-bounce mx-auto" />
                    <p className="font-bold text-xs text-slate-700">Analyzing Photo with AI...</p>
                    <p className="text-[10px] text-slate-400">Classifying issues & selecting departments</p>
                  </div>
                ) : (
                  <div className="text-center space-y-3">
                    <FaCloudUploadAlt className="text-4xl text-slate-400 mx-auto" />
                    <p className="font-bold text-xs text-slate-700">Click to upload photo</p>
                    <p className="text-[10px] text-slate-400">PNG, JPG, JPEG or WEBP up to 5MB</p>
                  </div>
                )}
                <input
                  type="file"
                  id="complaint-image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  disabled={uploadingImage}
                />
              </label>
            )}

            {/* AI Results Box */}
            {confidence !== null && (
              <div
                className={`p-4 rounded-xl border flex flex-col gap-3 ${
                  isLowConfidence
                    ? "bg-amber-50/50 border-amber-200 text-amber-900"
                    : "bg-blue-50/40 border-blue-100 text-slate-800"
                }`}
              >
                <div className="flex items-center justify-between border-b pb-2.5 border-slate-200/50">
                  <span className="text-xs font-bold flex items-center space-x-1.5">
                    <FaBrain className={isLowConfidence ? "text-amber-600" : "text-blue-600"} />
                    <span>AI Engine Categorization</span>
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isLowConfidence ? "bg-amber-100 text-amber-800" : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    Confidence: {confidence}%
                  </span>
                </div>
                
                {isLowConfidence ? (
                  <div className="flex items-start space-x-2 text-[11px] text-amber-700 leading-relaxed">
                    <FaExclamationCircle className="shrink-0 mt-0.5 text-xs text-amber-600" />
                    <p>
                      <strong>Low AI Confidence.</strong> Please review the classification fields below and correct them manually if they do not match the issue.
                    </p>
                  </div>
                ) : (
                  <div className="flex items-start space-x-2 text-[11px] text-blue-700 leading-relaxed">
                    <FaCheckCircle className="shrink-0 mt-0.5 text-xs text-emerald-600" />
                    <p>
                      <strong>High AI Confidence.</strong> AI successfully mapped this report to the proper civic category.
                    </p>
                  </div>
                )}

                {/* Form fields filled by AI */}
                <div className="grid grid-cols-3 gap-4 pt-1 text-xs">
                  <div>
                    <label htmlFor="comp-cat" className="block text-[10px] text-slate-400 font-semibold mb-1">Issue Category</label>
                    <select
                      id="comp-cat"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-white border border-slate-200 py-1.5 px-2 rounded focus:outline-none"
                    >
                      <option value="Pothole">Pothole</option>
                      <option value="Garbage">Garbage</option>
                      <option value="Water Leakage">Water Leakage</option>
                      <option value="Broken Streetlight">Broken Streetlight</option>
                      <option value="Damaged Road">Damaged Road</option>
                      <option value="Illegal Dumping">Illegal Dumping</option>
                      <option value="Open Drain">Open Drain</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="comp-pri" className="block text-[10px] text-slate-400 font-semibold mb-1">Priority Level</label>
                    <select
                      id="comp-pri"
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                      className="w-full bg-white border border-slate-200 py-1.5 px-2 rounded focus:outline-none"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Critical">Critical</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="comp-dept" className="block text-[10px] text-slate-400 font-semibold mb-1">Assigned Office</label>
                    <select
                      id="comp-dept"
                      value={assignedDepartment}
                      onChange={(e) => setAssignedDepartment(e.target.value)}
                      className="w-full bg-white border border-slate-200 py-1.5 px-2 rounded focus:outline-none"
                    >
                      <option value="Road Department">Road Dept.</option>
                      <option value="Water Department">Water Dept.</option>
                      <option value="Electricity Department">Electricity Dept.</option>
                      <option value="Sanitation Department">Sanitation Dept.</option>
                      <option value="Municipality">Municipality</option>
                      <option value="Public Works Department">PWD Dept.</option>
                      <option value="None">None</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Form details card */}
          <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-slate-800">2. Issue Details</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="comp-title" className="block text-xs font-semibold text-slate-600 mb-1.5">Complaint Title</label>
                <input
                  type="text"
                  id="comp-title"
                  required
                  placeholder="e.g. Broken streetlight on Ward 12 Main Road"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-xs px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:bg-white"
                />
              </div>
              <div>
                <label htmlFor="comp-desc" className="block text-xs font-semibold text-slate-600 mb-1.5">Description</label>
                <textarea
                  id="comp-desc"
                  required
                  rows="4"
                  placeholder="Provide precise details such as landmarks, approximate length of time the problem has existed, or specific risks to citizens..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full text-xs px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:bg-white"
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Map & GPS Positioning */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-4 flex flex-col h-full">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <h3 className="font-bold text-sm text-slate-800 flex items-center space-x-2">
                <FaMapPin className="text-red-500" />
                <span>3. Pinpoint Geolocation</span>
              </h3>
              <button
                type="button"
                onClick={handleAutoLocation}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 hover:text-slate-900 rounded-lg text-[10px] font-bold transition"
              >
                <FaCompass className="text-xs" />
                <span>Use Current GPS</span>
              </button>
            </div>

            {/* Map Container */}
            <div className="h-80 w-full flex-grow border border-slate-200 rounded-xl overflow-hidden shadow-inner">
              <MapView
                selectable={true}
                selectedLocation={selectedLoc}
                onLocationSelect={handleMapClick}
                center={mapCenter}
              />
            </div>

            {/* Manual Lat/Lng fields */}
            <div className="grid grid-cols-2 gap-4 text-xs pt-2">
              <div>
                <label htmlFor="comp-lat" className="block text-[10px] text-slate-400 font-semibold mb-1">Latitude</label>
                <input
                  type="number"
                  step="any"
                  id="comp-lat"
                  required
                  placeholder="e.g. 28.6139"
                  value={latitude}
                  onChange={(e) => {
                    setLatitude(e.target.value);
                    if (e.target.value && longitude) {
                      setSelectedLoc({ lat: parseFloat(e.target.value), lng: parseFloat(longitude) });
                    }
                  }}
                  className="w-full bg-slate-50 border border-slate-200 py-2.5 px-3 rounded-lg focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="comp-lng" className="block text-[10px] text-slate-400 font-semibold mb-1">Longitude</label>
                <input
                  type="number"
                  step="any"
                  id="comp-lng"
                  required
                  placeholder="e.g. 77.2090"
                  value={longitude}
                  onChange={(e) => {
                    setLongitude(e.target.value);
                    if (latitude && e.target.value) {
                      setSelectedLoc({ lat: parseFloat(latitude), lng: parseFloat(e.target.value) });
                    }
                  }}
                  className="w-full bg-slate-50 border border-slate-200 py-2.5 px-3 rounded-lg focus:outline-none"
                />
              </div>
            </div>

            <p className="text-[10px] text-slate-400 leading-relaxed">
              * Click directly on the map above to select the coordinates, or allow browser location access using the button.
            </p>

            {/* Submit Bar */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3 mt-auto">
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-800 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitLoading || uploadingImage}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-lg text-xs transition duration-150 shadow-md shadow-blue-500/10 flex items-center justify-center space-x-1.5"
              >
                {submitLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Filing Complaint...</span>
                  </>
                ) : (
                  <span>Submit Complaint</span>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SubmitComplaint;
