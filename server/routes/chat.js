const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Document = require('../models/Document');
const ChatHistory = require('../models/ChatHistory');
const { protect } = require('../middleware/auth');

// Initialize Gemini
// Note: This relies on GEMINI_API_KEY being present in .env
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'API_KEY_MISSING');

// @route   POST api/chat
// @desc    Ask a question about uploaded documents
// @access  Private
router.post('/', protect, async (req, res) => {
    const { query } = req.body;

    if (!query) {
        return res.status(400).json({ message: 'Query is required' });
    }

    try {
        // 1. Fetch user's documents
        // Optimization: In a real app, we would use vector search here. 
        // For this version, we load all text (assuming < 1MB total text for personal use).
        const documents = await Document.find({ user: req.user._id });

        if (documents.length === 0) {
            return res.status(400).json({ 
                answer: "You haven't uploaded any documents yet. Please upload some documents so I can answer your questions!",
                references: []
            });
        }

        // 2. Construct Context
        let context = "";
        let docMap = {}; 

        documents.forEach(doc => {
            // Add document markers for the AI to reference
            context += `\n--- BEGIN DOCUMENT: ${doc.title} ---\n${doc.content}\n--- END DOCUMENT: ${doc.title} ---\n`;
            docMap[doc.title] = doc._id;
        });

        // 3. Construct Prompt
        const systemPrompt = `You are a helpful Document Intelligence Assistant. 
        Your task is to answer the user's question STRICTLY based on the provided documents.
        
        Rules:
        1. If the answer is not in the documents, state that you cannot find the information in the provided documents.
        2. Citations are MANDATORY. When you state a fact, you must reference the document it came from.
        3. Format your answer in Markdown.
        4. At the end of your answer, list the "References" used.
        
        User Question: ${query}
        
        Documents Context:
        ${context}`;

        // 4. Call Gemini
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
        const result = await model.generateContent(systemPrompt);
        const response = await result.response;
        const answer = response.text();

        // 5. Save History
        // We try to extract references from the AI response or just link all docs used in context (simplified)
        // For this prototype, we'll link all documents that were *potentially* relevant (all of them), 
        // or we could ask the AI to output JSON references.
        // For simplicity, we store the raw answer and list "All uploaded documents" as potential scope, 
        // but the UI will show the answer's text references.
        
        const chatEntry = await ChatHistory.create({
            user: req.user._id,
            query: query,
            answer: answer,
            // In a better version, we'd parse the answer to find exactly which docs were cited.
            // For now, we leave the structured references empty and rely on the markdown text.
            references: [] 
        });

        res.json({
            answer: answer,
            chatId: chatEntry._id
        });

    } catch (error) {
        console.error('AI Error:', error);
        res.status(500).json({ message: 'Error generating answer', error: error.message });
    }
});

// @route   GET api/chat/history
// @desc    Get chat history
// @access  Private
router.get('/history', protect, async (req, res) => {
    try {
        const history = await ChatHistory.find({ user: req.user._id })
            .sort({ timestamp: -1 })
            .limit(20); // Limit to last 20 queries for now
        res.json(history);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
