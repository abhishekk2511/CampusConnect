import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './AlumniMap.css';

// Fix leaflet default icon
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({ iconUrl: icon, shadowUrl: iconShadow, iconSize: [25, 41], iconAnchor: [12, 41] });
L.Marker.prototype.options.icon = DefaultIcon;

// Custom coloured pin icon
const createColorIcon = (color) =>
    L.divIcon({
        className: '',
        html: `<div style="
            width:32px; height:32px; border-radius:50% 50% 50% 0;
            background:${color}; border:3px solid #fff;
            box-shadow:0 4px 14px rgba(0,0,0,0.35);
            transform:rotate(-45deg);
            display:flex; align-items:center; justify-content:center;">
        </div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -36],
    });

// Fly-to controller triggered by clicking a stat card
const FlyTo = ({ center, zoom }) => {
    const map = useMap();
    useEffect(() => { if (center) map.flyTo(center, zoom, { duration: 1.2 }); }, [center]);
    return null;
};

// GGSIPU-focused alumni data
const GGSIPU_ALUMNI = [
    { id: 1,  name: 'Vikram Malhotra',  batch: '2019', company: 'Microsoft',    role: 'SDE-II',             city: 'Seattle, USA',     lat: 47.6062,  lng: -122.3321, color: '#0078d4', branch: 'CSE' },
    { id: 2,  name: 'Ananya Sharma',    batch: '2021', company: 'Amazon',       role: 'Data Analyst',       city: 'Bangalore, India', lat: 12.9716,  lng: 77.5946,  color: '#ff9900', branch: 'IT'  },
    { id: 3,  name: 'Rohan Verma',      batch: '2020', company: 'Google',       role: 'Frontend Dev',       city: 'Hyderabad, India', lat: 17.3850,  lng: 78.4867,  color: '#34a853', branch: 'CSE' },
    { id: 4,  name: 'Neha Joshi',       batch: '2018', company: 'Grab',         role: 'Product Manager',    city: 'Singapore',        lat: 1.3521,   lng: 103.8198, color: '#00b14f', branch: 'MBA' },
    { id: 5,  name: 'Rahul Singh',      batch: '2022', company: 'Atlassian',    role: 'SDE-I',              city: 'Sydney, Australia',lat: -33.8688, lng: 151.2093, color: '#0052cc', branch: 'ECE' },
    { id: 6,  name: 'Priya Kapoor',     batch: '2021', company: 'Shopify',      role: 'UX Designer',        city: 'Toronto, Canada',  lat: 43.6510,  lng: -79.3470, color: '#5c6ac4', branch: 'IT'  },
    { id: 7,  name: 'Aditya Kumar',     batch: '2020', company: 'Deloitte',     role: 'Consultant',         city: 'New Delhi, India', lat: 28.6139,  lng: 77.2090,  color: '#86bc25', branch: 'MBA' },
    { id: 8,  name: 'Sakshi Gupta',     batch: '2019', company: 'Infosys',      role: 'Sr. Engineer',       city: 'Pune, India',      lat: 18.5204,  lng: 73.8567,  color: '#007cc5', branch: 'CSE' },
    { id: 9,  name: 'Manish Yadav',     batch: '2023', company: 'TCS',          role: 'Developer',          city: 'Noida, India',     lat: 28.5355,  lng: 77.3910,  color: '#e63529', branch: 'ECE' },
    { id: 10, name: 'Divya Nair',       batch: '2021', company: 'Accenture',    role: 'Business Analyst',   city: 'Mumbai, India',    lat: 19.0760,  lng: 72.8777,  color: '#a100ff', branch: 'IT'  },
    { id: 11, name: 'Karan Mehta',      batch: '2018', company: 'Oracle',       role: 'Cloud Architect',    city: 'Austin, USA',      lat: 30.2672,  lng: -97.7431, color: '#f80000', branch: 'CSE' },
    { id: 12, name: 'Pooja Sharma',     batch: '2022', company: 'Wipro',        role: 'QA Engineer',        city: 'Chennai, India',   lat: 13.0827,  lng: 80.2707,  color: '#9c27b0', branch: 'IT'  },
];

const STAT_COUNTRIES = [
    { label: 'India', count: 7, icon: '🇮🇳', center: [22.0, 78.0], zoom: 5 },
    { label: 'USA',   count: 2, icon: '🇺🇸', center: [37.0, -95.0], zoom: 4 },
    { label: 'Others',count: 3, icon: '🌏', center: [20, 60], zoom: 2 },
];

const AlumniMap = () => {
    const [locations, setLocations] = useState(GGSIPU_ALUMNI);
    const [loading, setLoading] = useState(false);
    const [flyTarget, setFlyTarget] = useState(null);
    const [activeFilter, setActiveFilter] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedAlumni, setSelectedAlumni] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:5000/api/alumni-locations')
            .then(res => { if (res.data?.length) setLocations(prev => [...GGSIPU_ALUMNI, ...res.data]); })
            .catch(() => {});
    }, []);

    const branches = ['All', ...new Set(GGSIPU_ALUMNI.map(a => a.branch))];

    const filtered = locations.filter(loc => {
        const matchBranch = activeFilter === 'All' || loc.branch === activeFilter;
        const matchSearch = !searchTerm || loc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            loc.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            loc.city?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchBranch && matchSearch;
    });

    return (
        <div className="am-root">
            {/* ── Header ── */}
            <div className="am-header">
                <div className="am-header-left">
                    <span className="am-eyebrow">GGSIPU Alumni Network</span>
                    <h2 className="am-title">Global Alumni Map</h2>
                    <p className="am-sub">Explore where GGSIPU graduates are making an impact worldwide.</p>
                </div>
                <div className="am-header-stats">
                    {STAT_COUNTRIES.map(s => (
                        <button key={s.label} className="am-stat-pill" onClick={() => setFlyTarget({ center: s.center, zoom: s.zoom })}>
                            <span className="am-stat-flag">{s.icon}</span>
                            <span className="am-stat-count">{s.count}</span>
                            <span className="am-stat-lbl">{s.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* ── Controls ── */}
            <div className="am-controls">
                <div className="am-search-wrap">
                    <span className="am-search-icon">🔍</span>
                    <input
                        className="am-search"
                        placeholder="Search by name, company or city…"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="am-filters">
                    {branches.map(b => (
                        <button
                            key={b}
                            className={`am-filter-btn ${activeFilter === b ? 'active' : ''}`}
                            onClick={() => setActiveFilter(b)}
                        >{b}</button>
                    ))}
                </div>
                <div className="am-result-count">{filtered.length} alumni shown</div>
            </div>

            {/* ── Map + Sidebar ── */}
            <div className="am-body">
                <div className="am-map-wrap">
                    {loading ? (
                        <div className="am-loading"><div className="am-spinner" /><p>Loading map…</p></div>
                    ) : (
                        <MapContainer center={[25, 55]} zoom={3} scrollWheelZoom className="am-map-instance">
                            <TileLayer
                                attribution='&copy; <a href="https://carto.com">CARTO</a>'
                                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                            />
                            {flyTarget && <FlyTo center={flyTarget.center} zoom={flyTarget.zoom} />}
                            {filtered.map(loc => (
                                <Marker
                                    key={loc.id}
                                    position={[loc.lat, loc.lng]}
                                    icon={createColorIcon(loc.color || '#c9a84c')}
                                    eventHandlers={{ click: () => setSelectedAlumni(loc) }}
                                >
                                    <Popup className="am-popup">
                                        <div className="am-popup-inner">
                                            <div className="am-popup-avatar" style={{ background: loc.color || '#c9a84c' }}>
                                                {loc.name.charAt(0)}
                                            </div>
                                            <div className="am-popup-info">
                                                <h4>{loc.name}</h4>
                                                <span className="am-popup-batch">Batch of {loc.batch} · {loc.branch}</span>
                                                <p className="am-popup-role">{loc.role} @ <strong>{loc.company}</strong></p>
                                                <p className="am-popup-city">📍 {loc.city}</p>
                                            </div>
                                        </div>
                                    </Popup>
                                </Marker>
                            ))}
                        </MapContainer>
                    )}
                </div>

                {/* ── Alumni List Sidebar ── */}
                <div className="am-sidebar">
                    <h4 className="am-sidebar-title">Alumni List</h4>
                    <div className="am-alumni-list">
                        {filtered.map(loc => (
                            <div
                                key={loc.id}
                                className={`am-alumni-card ${selectedAlumni?.id === loc.id ? 'active' : ''}`}
                                onClick={() => {
                                    setSelectedAlumni(loc);
                                    setFlyTarget({ center: [loc.lat, loc.lng], zoom: 6 });
                                }}
                            >
                                <div className="am-ac-avatar" style={{ background: loc.color || '#c9a84c' }}>{loc.name.charAt(0)}</div>
                                <div className="am-ac-info">
                                    <p className="am-ac-name">{loc.name}</p>
                                    <p className="am-ac-meta">{loc.role} · {loc.company}</p>
                                    <p className="am-ac-city">📍 {loc.city}</p>
                                </div>
                                <span className="am-ac-batch">{loc.batch}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AlumniMap;
