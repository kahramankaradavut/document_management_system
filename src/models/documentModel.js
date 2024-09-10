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

module.exports = {
    createDocument,
    updateDocumentRevision,
    getDocumentRevisions,
    getDocumentById
};
