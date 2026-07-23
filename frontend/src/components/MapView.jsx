import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";

// Resolve Leaflet marker image missing assets in React/Vite builds
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

// Helper component to handle click events on the map
const MapEvents = ({ onClick }) => {
  useMapEvents({
    click(e) {
      if (onClick) {
        onClick(e.latlng);
      }
    },
  });
  return null;
};

// Helper component to programmatically pan/zoom when center props change
const ChangeMapCenter = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);
  return null;
};

const MapView = ({
  center = [28.6139, 77.2090], // Default Delhi coordinates
  zoom = 13,
  complaints = [],
  selectable = false,
  selectedLocation = null,
  onLocationSelect = null,
}) => {
  // Determine coordinate color class based on status
  const getStatusColor = (status) => {
    switch (status) {
      case "Pending": return "text-amber-600";
      case "Assigned": return "text-indigo-600";
      case "In Progress": return "text-blue-600";
      case "Resolved": return "text-emerald-600";
      case "Rejected": return "text-rose-600";
      default: return "text-slate-600";
    }
  };

  const handleMapClick = (latlng) => {
    if (selectable && onLocationSelect) {
      onLocationSelect({
        lat: parseFloat(latlng.lat.toFixed(6)),
        lng: parseFloat(latlng.lng.toFixed(6)),
      });
    }
  };

  return (
    <div className="relative w-full h-full min-h-[300px] bg-slate-100 rounded-xl overflow-hidden shadow-inner border border-slate-200">
      <MapContainer
        center={selectedLocation ? [selectedLocation.lat, selectedLocation.lng] : center}
        zoom={zoom}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Pan map center helper */}
        {selectedLocation && <ChangeMapCenter center={[selectedLocation.lat, selectedLocation.lng]} />}
        {!selectedLocation && center && <ChangeMapCenter center={center} />}

        {/* Click events helper */}
        {selectable && <MapEvents onClick={handleMapClick} />}

        {/* Place selectable location marker */}
        {selectable && selectedLocation && (
          <Marker position={[selectedLocation.lat, selectedLocation.lng]}>
            <Popup>
              <div className="text-center font-sans">
                <p className="font-semibold text-xs text-blue-600">Selected Location</p>
                <p className="text-[10px] text-slate-500 mt-1">
                  Lat: {selectedLocation.lat}<br />
                  Lng: {selectedLocation.lng}
                </p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Render complaints markers */}
        {!selectable &&
          complaints.map((c) => {
            if (!c.latitude || !c.longitude) return null;
            return (
              <Marker key={c._id || c.complaintId} position={[c.latitude, c.longitude]}>
                <Popup>
                  <div className="p-1 font-sans max-w-[200px]">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] font-bold text-slate-400">{c.complaintId}</span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-slate-100 ${getStatusColor(c.status)}`}>
                        {c.status}
                      </span>
                    </div>
                    <h4 className="font-bold text-xs text-slate-800 line-clamp-1">{c.title}</h4>
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{c.description}</p>
                    <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                      <span>Category: <strong className="text-slate-600">{c.category}</strong></span>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
      </MapContainer>
    </div>
  );
};

export default MapView;
