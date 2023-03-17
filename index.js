require('dotenv').config();
require('./config/dbConfig').config();
const express = require('express');
const homeRoutes = require('./routes/home');

// Important constants
const app = express();
const PORT = process.env.PORT || 5000;

// Middle wares
app.use(express.json());

// Routing
app.use('/', homeRoutes);

// Listen at PORT
app.listen(PORT, () => {
    console.log(`Server is up at ${PORT}`);
});
