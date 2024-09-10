const unitModel = require('../models/unitModel');

// Yeni birim oluşturma
const createUnit = async (req, res) => {
    try {
        const { name, parentId } = req.body;
        if (!name) {
            return res.status(400).json({ message: 'Unit name is required.' });
        }

        const unit = await unitModel.createUnit(name, parentId);
        res.status(201).json(unit);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error.' });
    }
};

// Birim listesini alma
const getAllUnits = async (req, res) => {
    try {
        const units = await unitModel.getAllUnits();
        res.status(200).json(units);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error.' });
    }
};

const getRootParentUnit = async (req, res) => {
    const { unitId } = req.params;
  
    try {
      const rootParentUnit = await unitModel.getRootParentUnit(unitId);
  
      if (rootParentUnit.length === 0) {
        return res.status(404).json({ message: 'No root parent unit found for this unit.' });
      }
  
      res.status(200).json(rootParentUnit[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error.' });
    }
  };


  // birimin bir üst birimini getirme
  const getParentUnit = async (req, res) => {
    const { unitId } = req.params;
  
    try {
      const parentUnit = await unitModel.getParentUnit(unitId);
  
      if (parentUnit.length === 0) {
        return res.status(404).json({ message: 'No parent unit found for this unit.' });
      }
  
      res.status(200).json(parentUnit[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error.' });
    }
  };

module.exports = {
    createUnit,
    getAllUnits,
    getRootParentUnit,
    getParentUnit,
};
