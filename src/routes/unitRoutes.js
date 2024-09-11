const express = require('express');
const unitController = require('../controllers/unitController');
const router = express.Router();

// Yeni birim oluşturma
router.post('/', unitController.createUnit);

// Tüm birimleri listeleme
router.get('/', unitController.getAllUnits);

// Root birimi getirme
router.get('/:unitId/root-parent', unitController.getRootParentUnit);

// birimin bir üst birimi
router.get('/:unitId/parent', unitController.getParentUnit);

// Tüm birimleri ve dokümanlarını child-parent yapısında getirme
router.get('/with-documents', unitController.getAllUnitsWithDocuments);


module.exports = router;
