const pool = require('./db');


const createUnit = async (name, parentId = null) => {
    const result = await pool.query(
        'INSERT INTO units (name, parent_id) VALUES ($1, $2) RETURNING *',
        [name, parentId]
    );
    return result.rows[0];
};


const getAllUnits = async () => {
    const result = await pool.query('SELECT * FROM units WHERE is_delete = false');
    return result.rows;
};

// Verilen bir child unit'in en üst (root) ana birimini bulma
const getRootParentUnit = async (unitId) => {
    const result = await pool.query(
      `WITH RECURSIVE unit_hierarchy AS (
         SELECT id, name, parent_id
         FROM units
         WHERE id = $1
  
         UNION
  
         SELECT u.id, u.name, u.parent_id
         FROM units u
         INNER JOIN unit_hierarchy uh ON u.id = uh.parent_id
       )
       SELECT * 
       FROM unit_hierarchy
       WHERE parent_id IS NULL;`,
      [unitId]
    );
    return result.rows;
  };

  // birimin bir üst birimini getime
  const getParentUnit = async (unitId) => {
    const result = await pool.query(
      `SELECT parent.*
       FROM units AS child
       JOIN units AS parent ON child.parent_id = parent.id
       WHERE child.id = $1 AND child.is_delete = false`,
      [unitId]
    );
    return result.rows;
  };
  

module.exports = {
    createUnit,
    getAllUnits,
    getRootParentUnit,
    getParentUnit,
};
