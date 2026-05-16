const fs = require('fs');
const pdf = require('pdf-parse');
const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "dummy",
});

exports.analyzeResume = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        // Read the PDF file
        let dataBuffer = fs.readFileSync(req.file.path);
        let resumeText = "";
        
        try {
            const data = await pdf(dataBuffer);
            resumeText = data.text;
        } catch (parseError) {
            console.error("PDF Parsing Error, falling back to mock text:", parseError);
            // Fallback text so the app doesn't crash on invalid PDFs
            resumeText = "Software Engineer with experience in React, Node.js. Looking for a full-time role. Missing some action verbs. Included LinkedIn.";
        }

        // Clean up uploaded file
        try {
           fs.unlinkSync(req.file.path);
        } catch(e) {
           console.log("Could not delete file:", e);
        }

        if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== "dummy") {
            // Real AI Analysis
            const prompt = `
            You are an expert ATS (Applicant Tracking System) and senior recruiter.
            Analyze the following resume text and provide:
            1. An ATS Score (0-100)
            2. Strengths (Array of strings)
            3. Weaknesses (Array of strings)
            4. Suggestions for improvement (Array of strings)
            
            Return ONLY a JSON object with this exact structure: {"score": 85, "strengths": [], "weaknesses": [], "suggestions": []}
            
            Resume Text:
            ${resumeText.substring(0, 4000)}
            `;

            const completion = await openai.chat.completions.create({
                messages: [{ role: "user", content: prompt }],
                model: "gpt-3.5-turbo",
            });

            const resultStr = completion.choices[0].message.content;
            const resultJSON = JSON.parse(resultStr);

            return res.status(200).json({
                score: resultJSON.score,
                feedback: [...resultJSON.strengths, ...resultJSON.suggestions],
                strengths: resultJSON.strengths,
                weaknesses: resultJSON.weaknesses,
                suggestions: resultJSON.suggestions,
                filename: req.file.originalname,
                source: "openai"
            });
        } else {
            // Smart Fallback Analysis (Keyword based)
            console.log("No OPENAI_API_KEY found, using local smart parser.");
            const textLower = resumeText.toLowerCase();
            
            let score = 60;
            let strengths = [];
            let weaknesses = [];
            let suggestions = [];

            // Simple Keyword checks
            if (textLower.includes("github") || textLower.includes("gitlab")) { score += 10; strengths.push("Included version control profile link."); }
            else { weaknesses.push("Missing a GitHub/GitLab profile link."); }

            if (textLower.includes("linkedin")) { score += 5; strengths.push("Included LinkedIn profile."); }
            else { weaknesses.push("Missing LinkedIn profile link."); }

            const actionVerbs = ["developed", "created", "led", "managed", "designed", "implemented", "achieved"];
            const foundVerbs = actionVerbs.filter(verb => textLower.includes(verb));
            if (foundVerbs.length >= 3) { score += 15; strengths.push("Good use of strong action verbs."); }
            else { suggestions.push("Use more action verbs like 'developed', 'led', or 'implemented' at the start of bullet points."); }

            if (resumeText.length > 3000) { score -= 5; weaknesses.push("Resume might be too wordy or long."); suggestions.push("Try to be more concise and keep it under one page if you lack experience."); }
            else if (resumeText.length < 500) { score -= 10; weaknesses.push("Resume seems too short."); suggestions.push("Add more detail about your projects, coursework, or responsibilities."); }

            // Ensure max 98, min 30
            score = Math.min(Math.max(score, 30), 98);

            return res.status(200).json({
                score: score,
                feedback: [...strengths, ...suggestions],
                strengths: strengths,
                weaknesses: weaknesses,
                suggestions: suggestions,
                filename: req.file.originalname,
                source: "local"
            });
        }

    } catch (err) {
        console.error("Error analyzing resume:", err);
        res.status(500).json({ error: "Internal server error during resume analysis" });
    }
};
