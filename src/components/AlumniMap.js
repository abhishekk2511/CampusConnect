    import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './AlumniMap.css';

// Fix for default marker icons in react-leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const AlumniMap = () => {
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/alumni-locations');
                setLocations(res.data);
            } catch (error) {
                console.error("Failed to fetch alumni locations", error);
            } finally {
                setLoading(false);
            }
        };

        fetchLocations();
    }, []);

    return (
        <div className="alumni-map-container">
            <div className="alumni-map-header">
                <h2>Global Alumni Network</h2>
                <p>Connect with alumni across the globe. Click on a pin to view their profile.</p>
            </div>
            
            <div className="map-wrapper">
                {loading ? (
                    <div className="map-loading">Loading global data...</div>
                ) : (
                    <MapContainer 
                        center={[20, 0]} 
                        zoom={2} 
                        scrollWheelZoom={true} 
                        className="leaflet-map-instance"
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        
                        {locations.map((loc) => (
                            <Marker key={loc.id} position={[loc.lat, loc.lng]}>
                                <Popup className="alumni-popup">
                                    <div className="popup-content">
                                        <div 
                                            className="popup-avatar" 
                                            style={{ backgroundColor: loc.avatarColor }}
                                        >
                                            {loc.name.charAt(0)}
                                        </div>
                                        <div className="popup-info">
                                            <h4>{loc.name}</h4>
                                            <span className="popup-batch">Batch of {loc.batch}</span>
                                            <p className="popup-role">{loc.role} @ <strong>{loc.company}</strong></p>
                                            <button className="popup-connect-btn">Connect</button>
                                        </div>
                                    </div>
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                )}
            </div>
        </div>
    );
};

export default AlumniMap;
