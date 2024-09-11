const documentModel = require('../models/documentModel');
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');  // Benzersiz dosya adı için uuid kullanıyoruz

// Multer storage ayarları
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}-${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage }); // Multer middleware

// Belge Yükleme İşlemi
const uploadDocument = async (req, res) => {
  try {
    console.log("Request body: ", req.body);
    console.log("Request file: ", req.file);

    const { unitId, subject } = req.body;
    const file = req.file;

    // Gerekli alanların doğruluğunu kontrol et
    if (!unitId || !file || !subject) {
      return res.status(400).json({ message: 'Unit ID, subject, and file are required.' });
    }

    // Veritabanına belgeyi ekleyin
    const documentId = await documentModel.createDocument(unitId, file.originalname, file.path, subject);
    res.status(201).json({ documentId, message: 'Document uploaded successfully.' });
  } catch (error) {
    console.error("Upload error: ", error);
    res.status(500).json({ message: 'Server error.' });
  }
};


const updateDocument = async (req, res) => {
    try {
      const { documentId, revisionReason } = req.body;
      const file = req.file;
  
      if (!documentId || !file || !revisionReason) {
        return res.status(400).json({ message: 'Document ID, file, and revision reason are required.' });
      }
  
      //console.log((await documentModel.getDocumentRevisions(documentId)).length);



      // Dokümanın mevcut versiyon numarasını al
      const document = await documentModel.getDocumentById(documentId);
  
      // Eğer doküman bulunamazsa
      if (document.length === 0) {
        return res.status(404).json({ message: 'Document not found.' });
      }
  
      // Son revizyon numarasını al
      const latestVersion = document[0].current_version;
  
      // Yeni versiyonu bir artırarak belirle
      const newVersion = latestVersion + 1;
      // Belgeyi güncelle
      await documentModel.updateDocumentRevision(documentId, file.path, newVersion, revisionReason);


      // Belgeyi güncelle


      res.status(200).json({ message: 'Document updated successfully.', revisionReason});
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error.' });
    }
  };

  
// Belirli bir dokümanı ve revizyonlarını getirme
const getDocument = async (req, res) => {
  const { id } = req.params; 

  try {
    // Dokümanı veritabanından al
    const document = await documentModel.getDocumentById(id);

    if (document.length === 0) {
      return res.status(404).json({ message: 'Document not found.' });
    }

    // Revizyonları al
    const revisions = await documentModel.getDocumentRevisions(id);

    // Doküman bilgisine revizyonları ekle
    document[0].revisions = revisions;

    res.status(200).json(document[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Son halinden bir önceki halinin file_path'ini getir
const getPreviousRevisionFilePath = async (req, res) => {
  const { documentId } = req.params;

  try {
    const previousRevision = await documentModel.getPreviousRevisionFilePath(documentId);

    if (previousRevision.length === 0) {
      return res.status(404).json({ message: 'No previous revision found for this document.' });
    }

    res.status(200).json(previousRevision[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error.' });
  }
};


  

module.exports = {
  uploadDocument,
  updateDocument,
  uploadMiddleware: upload.single('file'), 
  getDocument,
  getPreviousRevisionFilePath,
};
