const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    fileType: {
        type: String, // e.g., 'application/pdf', 'text/plain'
        required: true
    },
    content: {
        type: String, // Extracted text
        required: true
    },
    summary: { // Optional: Generated summary for quick preview
        type: String
    },
    uploadDate: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Document', documentSchema);
