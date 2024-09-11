const express = require('express');
const documentController = require('../controllers/documentController');
const router = express.Router();

// Belge yükleme
router.post('/upload', documentController.uploadMiddleware, documentController.uploadDocument);

// Belge güncelleme
router.post('/update', documentController.uploadMiddleware, documentController.updateDocument);

// Belgeyi ve revizyonlarını getirme
router.get('/:id', documentController.getDocument);

// Son halinden bir önceki halinin file_path'ini getir
router.get('/:documentId/previous-revision', documentController.getPreviousRevisionFilePath);

module.exports = router;
