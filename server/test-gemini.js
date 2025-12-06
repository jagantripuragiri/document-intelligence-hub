require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testGemini() {
    console.log("Testing Gemini API...");
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
        console.error("Error: GEMINI_API_KEY is missing in .env");
        return;
    }

    console.log(`API Key found: ${apiKey.substring(0, 5)}...`);

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const prompt = "Hello! Are you working?";
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        console.log("Success with gemini-2.0-flash! Gemini responded:");
        console.log(text);
    } catch (error) {
        console.error("Gemini API Error:", error.message);
        if (error.response) {
             console.error("Error Details:", JSON.stringify(error.response, null, 2));
        }
    }
}

testGemini();
