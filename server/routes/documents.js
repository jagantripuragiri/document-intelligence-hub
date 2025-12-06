const express = require('express');
const router = express.Router();
const multer = require('multer');
const pdf = require('pdf-parse');
const Document = require('../models/Document');
const { protect } = require('../middleware/auth');

// Configure Multer (Memory Storage)
const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// @route   POST api/documents/upload
// @desc    Upload PDF/Text and extract content
// @access  Private
router.post('/upload', protect, upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    try {
        let content = '';

        if (req.file.mimetype === 'application/pdf') {
            const data = await pdf(req.file.buffer);
            content = data.text;
        } else if (req.file.mimetype === 'text/plain') {
            content = req.file.buffer.toString('utf8');
        } else {
            return res.status(400).json({ message: 'Unsupported file type. Use PDF or TXT.' });
        }

        // Basic clean up of text (remove excessive newlines)
        content = content.replace(/\n\s*\n/g, '\n').trim();

        const document = await Document.create({
            user: req.user._id,
            title: req.file.originalname,
            fileType: req.file.mimetype,
            content: content
        });

        res.status(201).json(document);

    } catch (error) {
        console.error('Upload Error:', error);
        res.status(500).json({ message: 'Server Error during file processing', error: error.message });
    }
});

// @route   GET api/documents
// @desc    Get all documents for user
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const documents = await Document.find({ user: req.user._id }).sort({ uploadDate: -1 });
        res.json(documents);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   GET api/documents/:id
// @desc    Get single document
// @access  Private
router.get('/:id', protect, async (req, res) => {
    try {
        const document = await Document.findById(req.params.id);

        if (!document) {
            return res.status(404).json({ message: 'Document not found' });
        }

        // Ensure user owns the document
        if (document.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        res.json(document);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   DELETE api/documents/:id
// @desc    Delete a document
// @access  Private
router.delete('/:id', protect, async (req, res) => {
    try {
        const document = await Document.findById(req.params.id);

        if (!document) {
            return res.status(404).json({ message: 'Document not found' });
        }

        if (document.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await document.deleteOne();
        res.json({ message: 'Document removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

module.exports = router;
