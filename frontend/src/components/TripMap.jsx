import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default Leaflet marker icon issue in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Create custom icons with numbers
const createNumberedIcon = (number) => {
  return L.divIcon({
    className: 'custom-div-icon',
    html: `<div style="background-color: #2a7c76; color: white; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 12px; border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);">${number}</div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

const MapUpdater = ({ positions }) => {
  const map = useMap();
  useEffect(() => {
    if (positions.length > 0) {
      const bounds = L.latLngBounds(positions);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [positions, map]);
  return null;
};

const TripMap = ({ stops }) => {
  const validStops = stops.filter(s => s.lat != null && s.lng != null).sort((a, b) => a.order_index - b.order_index);
  
  if (validStops.length === 0) {
    return (
      <div className="w-full h-[400px] bg-stone-100 rounded-xl flex items-center justify-center flex-col text-stone-500">
        <p className="font-medium mb-1">No map data available</p>
        <p className="text-sm">Add stops with valid city names to see the map route.</p>
      </div>
    );
  }

  const positions = validStops.map(s => [s.lat, s.lng]);

  return (
    <div className="w-full h-[400px] md:h-[500px] rounded-xl overflow-hidden shadow-sm border border-stone-200 z-0 relative">
      <MapContainer 
        center={positions[0]} 
        zoom={4} 
        style={{ height: '100%', width: '100%', zIndex: 0 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {validStops.map((stop, index) => (
          <Marker 
            key={stop.stop_id} 
            position={[stop.lat, stop.lng]}
            icon={createNumberedIcon(index + 1)}
          >
            <Popup>
              <div className="font-sans">
                <h3 className="font-bold text-stone-800">{stop.city_name}</h3>
                <p className="text-xs text-stone-500 m-0">{stop.arrival_date} to {stop.departure_date}</p>
                {stop.activities && stop.activities.length > 0 && (
                  <p className="text-xs mt-1 font-medium text-teal-600">{stop.activities.length} activities planned</p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}

        {positions.length > 1 && (
          <Polyline 
            positions={positions} 
            color="#2a7c76" 
            weight={3} 
            opacity={0.7} 
            dashArray="8, 8"
          />
        )}

        <MapUpdater positions={positions} />
      </MapContainer>
    </div>
  );
};

export default TripMap;
