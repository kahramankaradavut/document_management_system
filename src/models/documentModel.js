const pool = require('./db');

// Belge oluşturma
const createDocument = async (unitId, originalName, filePath, subject) => {
  const result = await pool.query(
    `INSERT INTO documents (unit_id, original_name, subject, file_path)
     VALUES ($1, $2, $3, $4) RETURNING id`,
    [unitId, originalName, subject, filePath]
  );
  return result.rows[0].id;
};

const getDocumentById = async (documentId) => {
    const result = await pool.query(
      `SELECT * FROM documents WHERE id = $1 AND is_delete = false`,
      [documentId]
    );
    return result.rows;
  };

// Revizyon ekleme
const updateDocumentRevision = async (documentId, filePath, newVersion, revisionReason) => {
  await pool.query(
    `INSERT INTO document_revisions (document_id, version_number, file_path, revision_reason)
     VALUES ($1, $2, $3, $4)`,
    [documentId, newVersion, filePath, revisionReason]
  );
  await pool.query(
    `UPDATE documents SET current_version = $1 WHERE id = $2`,
    [newVersion, documentId]
  );
};

const getDocumentRevisions = async (documentId) => {
    const result = await pool.query(
        `SELECT * FROM document_revisions WHERE document_id = $1 ORDER BY version_number DESC`,
        [documentId]
    );
    return result.rows;
};

// Son halinden bir önceki halinin file_path'ini getir
const getPreviousRevisionFilePath = async (documentId) => {
  const result = await pool.query(
    `WITH revision_count AS (
       -- Belgeye ait revizyonların sayısı
       SELECT COUNT(*) AS rev_count
       FROM document_revisions
       WHERE document_id = $1
     ),
     revision_history AS (
       -- Belgeye ait tüm revizyonları büyükten küçüğe sırala
       SELECT *
       FROM document_revisions
       WHERE document_id = $1
       ORDER BY version_number DESC
     )

     -- Eğer revizyon yoksa ilk yüklenen dosyanın file_path'ini döndür
     SELECT d.file_path
     FROM documents d
     WHERE d.id = $1
     AND (SELECT rev_count FROM revision_count) = 1

     UNION ALL

     -- Eğer revizyon varsa son revizyonun bir öncesini getir yoksa en son revizyonu getir
     SELECT file_path
     FROM revision_history
     OFFSET GREATEST((SELECT COUNT(*) FROM revision_history) - 1, 0)
     LIMIT 1;`,
    [documentId]
  );
  
  return result.rows;
};

// Tüm birimleri ve onlara ait dokümanları getir
const getAllUnitsWithDocuments = async () => {
  const result = await pool.query(
    `SELECT units.*,
            (SELECT json_agg(dokuman)
             FROM (SELECT * FROM documents WHERE units.id = unit_id) dokuman) AS documents
     FROM units`
  );
  return result.rows;
};

module.exports = {
    createDocument,
    updateDocumentRevision,
    getDocumentRevisions,
    getDocumentById,
    getPreviousRevisionFilePath,
    getAllUnitsWithDocuments,
};


