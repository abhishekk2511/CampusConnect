const axios = require('axios');

const mockJobs = [
    {
        title: "Software Engineering Intern",
        company: "Google",
        location: "Bangalore, India",
        type: "Internship",
        description: "Join Google's core search team for a 6-month internship. You will work on scalable backend systems using C++ and Go. Strong data structures and algorithms knowledge required.",
        applyLink: "https://careers.google.com/jobs/results/",
        name: "Vikram Malhotra",
        role: "alumni",
        rollNo: "1029384756"
    },
    {
        title: "Frontend Developer",
        company: "Microsoft",
        location: "Hyderabad, India (Hybrid)",
        type: "Full-time",
        description: "Looking for a passionate React developer to join the MS Teams frontend division. You should have 1-2 years of experience with React, Redux, and modern CSS frameworks.",
        applyLink: "https://careers.microsoft.com/",
        name: "Rohan Verma",
        role: "alumni",
        rollNo: "9876543210"
    },
    {
        title: "Data Analyst",
        company: "Amazon",
        location: "Remote",
        type: "Contract",
        description: "6-month contract role for a Data Analyst. Proficiency in SQL, Python, and Tableau required. You will be analyzing customer purchase patterns and generating actionable insights.",
        applyLink: "hr@amazon-analytics.example.com",
        name: "Neha Joshi",
        role: "alumni",
        rollNo: "5647382910"
    },
    {
        title: "SDE-1",
        company: "Atlassian",
        location: "Remote",
        type: "Full-time",
        description: "Join Atlassian to work on Jira's performance optimization team. We are looking for fresh graduates with a solid understanding of Node.js, React, and system design basics.",
        applyLink: "https://www.atlassian.com/company/careers",
        name: "Priya Kapoor",
        role: "alumni",
        rollNo: "1122334455"
    }
];

async function seedJobs() {
    for (const job of mockJobs) {
        try {
            await axios.post('http://localhost:5000/api/jobs', job);
            console.log(`Successfully added job: ${job.title}`);
        } catch (error) {
            console.error(`Failed to add job: ${job.title}`, error.message);
        }
    }
}

seedJobs();
