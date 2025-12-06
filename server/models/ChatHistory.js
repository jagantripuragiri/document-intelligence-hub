const mongoose = require('mongoose');

const chatHistorySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    query: {
        type: String,
        required: true
    },
    answer: {
        type: String,
        required: true
    },
    references: [{
        documentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Document'
        },
        title: String,
        snippet: String
    }],
    timestamp: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('ChatHistory', chatHistorySchema);
