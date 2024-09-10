const express = require('express');
const documentController = require('../controllers/documentController');
const router = express.Router();

// Belge yükleme
router.post('/upload', documentController.uploadMiddleware, documentController.uploadDocument);

// Belge güncelleme
router.post('/update', documentController.uploadMiddleware, documentController.updateDocument);

// Belgeyi ve revizyonlarını getirme (GET method)
router.get('/:id', documentController.getDocument);

module.exports = router;
