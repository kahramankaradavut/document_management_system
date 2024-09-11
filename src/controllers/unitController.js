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

async function fonksiyon1(array, anaArray){
array.forEach(element => {
    element.child = []
    let array1 = anaArray.filter(items =>{
      console.log(items)
      return element.id == items.parent_id;
    })
    element.child.push(array1)
    if(array1.length > 0){
      fonksiyon1(array1, anaArray)
    }


  });
  return array
}




// Birim listesini alma
const getAllUnits = async (req, res) => {
    try {
        const units = await unitModel.getAllUnits();
        let array1 = units.filter(items =>{
          return items.parent_id == null;
        })
        console.log(array1);
        let degisken = await fonksiyon1(array1, units)
        res.status(200).json(degisken);
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


  // Recursive fonksiyon: Child birimleri ve dokümanları bulma
async function buildUnitTree(array, allUnits) {
  array.forEach(element => {
    element.child = [];
    element.documents = element.documents || [];  // Eğer doküman yoksa boş bir dizi ata
    let childUnits = allUnits.filter(unit => unit.parent_id === element.id);
    element.child.push(...childUnits);
    if (childUnits.length > 0) {
      buildUnitTree(childUnits, allUnits);
    }
  });
  return array;
}

// Tüm birimlerin child'ları ve dokümanları ile birlikte döndürme
const getAllUnitsWithDocuments = async (req, res) => {
  try {
    // Tüm birimleri ve dokümanlarını alıyoruz
    const unitsWithDocuments = await unitModel.getAllUnitsWithDocuments();

    // Ana birimleri (parent_id null olan birimleri) alıyoruz
    let rootUnits = unitsWithDocuments.filter(unit => unit.parent_id === null);

    // Recursive olarak tüm child'ları ve dokümanları birleştiriyoruz
    let result = await buildUnitTree(rootUnits, unitsWithDocuments);

    res.status(200).json(result);
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
    getAllUnitsWithDocuments,
};
