exports.getAlumniLocations = async (req, res) => {
    try {
        const mockLocations = [
            { id: 101, name: "Vikram Malhotra",  batch: "2019", company: "Microsoft",  role: "SDE-II",           lat: 47.6062,  lng: -122.3321, avatarColor: "#0284c7", branch: "CSE", city: "Seattle, USA"      },
            { id: 102, name: "Ananya Sharma",    batch: "2021", company: "Amazon",      role: "Data Analyst",     lat: 12.9716,  lng: 77.5946,  avatarColor: "#e11d48", branch: "IT",  city: "Bangalore, India"  },
            { id: 103, name: "Rohan Verma",      batch: "2020", company: "Google",      role: "Frontend Dev",     lat: 17.3850,  lng: 78.4867,  avatarColor: "#16a34a", branch: "CSE", city: "Hyderabad, India"  },
            { id: 104, name: "Neha Joshi",       batch: "2018", company: "Grab",        role: "Product Manager",  lat: 1.3521,   lng: 103.8198, avatarColor: "#9333ea", branch: "MBA", city: "Singapore"         },
            { id: 105, name: "Rahul Singh",      batch: "2022", company: "Atlassian",   role: "SDE-I",            lat: -33.8688, lng: 151.2093, avatarColor: "#c9a84c", branch: "ECE", city: "Sydney, Australia" },
            { id: 106, name: "Priya Kapoor",     batch: "2021", company: "Shopify",     role: "UX Designer",      lat: 43.6510,  lng: -79.3470, avatarColor: "#2563eb", branch: "IT",  city: "Toronto, Canada"   },
            { id: 107, name: "Aditya Kumar",     batch: "2020", company: "Deloitte",    role: "Consultant",       lat: 28.6139,  lng: 77.2090,  avatarColor: "#86bc25", branch: "MBA", city: "New Delhi, India"  },
            { id: 108, name: "Sakshi Gupta",     batch: "2019", company: "Infosys",     role: "Sr. Engineer",     lat: 18.5204,  lng: 73.8567,  avatarColor: "#007cc5", branch: "CSE", city: "Pune, India"       },
        ];
        res.status(200).json(mockLocations);
    } catch (err) {
        console.error("Error fetching locations:", err);
        res.status(500).json({ error: "Internal server error fetching locations" });
    }
};
