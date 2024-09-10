const express = require('express');
const documentRoutes = require('./src/routes/documentRoutes');
const unitRoutes = require('./src/routes/unitRoutes'); 
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/api/documents', documentRoutes);
app.use('/api/units', unitRoutes); 

app.use('/uploads', express.static('uploads'));

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
