exports.getAlumniLocations = async (req, res) => {
    try {
        // Mock data for alumni locations around the globe
        const mockLocations = [
            {
                id: 1,
                name: "Vikram Malhotra",
                batch: "2019",
                company: "Microsoft",
                role: "Software Engineer",
                lat: 47.6062,
                lng: -122.3321, // Seattle, WA
                avatarColor: "#0284c7"
            },
            {
                id: 2,
                name: "Ananya Sharma",
                batch: "2021",
                company: "Amazon",
                role: "Data Analyst",
                lat: 51.5074,
                lng: -0.1278, // London, UK
                avatarColor: "#e11d48"
            },
            {
                id: 3,
                name: "Rohan Verma",
                batch: "2020",
                company: "Google",
                role: "Frontend Developer",
                lat: 12.9716,
                lng: 77.5946, // Bangalore, India
                avatarColor: "#16a34a"
            },
            {
                id: 4,
                name: "Neha Joshi",
                batch: "2018",
                company: "Grab",
                role: "Product Manager",
                lat: 1.3521,
                lng: 103.8198, // Singapore
                avatarColor: "#9333ea"
            },
            {
                id: 5,
                name: "Rahul Singh",
                batch: "2022",
                company: "Atlassian",
                role: "SDE-1",
                lat: -33.8688,
                lng: 151.2093, // Sydney, Australia
                avatarColor: "#c9a84c"
            },
            {
                id: 6,
                name: "Priya Kapoor",
                batch: "2021",
                company: "Shopify",
                role: "UX Designer",
                lat: 43.6510,
                lng: -79.3470, // Toronto, Canada
                avatarColor: "#2563eb"
            }
        ];

        res.status(200).json(mockLocations);
    } catch (err) {
        console.error("Error fetching locations:", err);
        res.status(500).json({ error: "Internal server error fetching locations" });
    }
};
