exports.analyzeResume = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        // Mock a slight delay to simulate processing
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Generate a random mock score between 65 and 95
        const score = Math.floor(Math.random() * (95 - 65 + 1)) + 65;

        // Generate mock feedback
        const allFeedback = [
            "Consider adding more quantifiable metrics to your experiences.",
            "Great formatting, it's very easy to read and ATS friendly.",
            "Action verbs at the beginning of bullet points could be stronger.",
            "Ensure your contact information is up to date and professional.",
            "Your skills section matches well with standard software engineering roles.",
            "Try to limit your resume to a single page if you have less than 5 years of experience.",
            "Include a summary section at the top highlighting your key achievements.",
            "Make sure to list your technical projects with GitHub links if applicable."
        ];
        
        // Pick 3-4 random feedback points
        const numFeedback = Math.floor(Math.random() * 2) + 3;
        const shuffled = allFeedback.sort(() => 0.5 - Math.random());
        const selectedFeedback = shuffled.slice(0, numFeedback);

        res.status(200).json({
            score: score,
            feedback: selectedFeedback,
            filename: req.file.originalname
        });

    } catch (err) {
        console.error("Error analyzing resume:", err);
        res.status(500).json({ error: "Internal server error during resume analysis" });
    }
};
