const express = require('express');
const router = express.Router();
const multer = require('multer');
const Document = require('../models/document');
const authenticateToken = require('../middleware/authenticateToken');
const authorizeRoles = require('../middleware/authorizeRoles');
const authorizeActiveUser = require('../middleware/authorizeRoles');

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// Create Document
router.post('/', upload.single('file'),authenticateToken,authorizeRoles('IT', 'HR','BOARD','HEAD'), async (req, res) => {
  const { userId, title, detail, approvers, department } = req.body;
  const file = req.file ? req.file.path : null;

  if (!file) {
    return res.status(400).json({ message: 'File is required' });
  }

  try {
    const document = new Document({
      userId,
      title,
      detail,
      file,
      approvers: JSON.parse(approvers),
      department
    });
    await document.save();
    res.status(201).json(document);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all Documents
router.get('/',authenticateToken,authorizeRoles('IT', 'HR','BOARD','HEAD'), async (req, res) => {
  try {
    const documents = await Document.find().populate('userId', 'username');
    res.json(documents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get Document by ID
router.get('/:id',authenticateToken,authorizeRoles('IT', 'HR','BOARD','HEAD'), async (req, res) => {
  try {
    const document = await Document.findById(req.params.id).populate('userId', 'username');
    if (!document) return res.status(404).json({ message: 'Document not found' });
    res.json(document);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update Document
router.put('/:id',authenticateToken,authorizeRoles('IT', 'HR','BOARD','HEAD'), upload.single('file'), async (req, res) => {
  const { title, detail, approvers, department } = req.body;
  const file = req.file ? req.file.path : null;

  try {
    const document = await Document.findById(req.params.id);
    if (!document) return res.status(404).json({ message: 'Document not found' });

    document.title = title || document.title;
    document.detail = detail || document.detail;
    if (file) document.file = file;
    document.approvers = approvers ? JSON.parse(approvers) : document.approvers;
    document.department = department || document.department;

    const updatedDocument = await document.save();
    res.json(updatedDocument);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete Document
router.delete('/:id',authenticateToken,authorizeRoles('IT', 'HR','BOARD','HEAD'), async (req, res) => {
  try {
    const document = await Document.findByIdAndDelete(req.params.id);
    if (!document) return res.status(404).json({ message: 'Document not found' });
    res.json({ message: 'Document deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
