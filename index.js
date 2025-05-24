// index.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { connectCosmosDB } = require('./config/cosmosClient');
const authRoutes = require('./routes/authRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const errorHandler = require('./middleware/errorHandler');

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// DB Connection
connectCosmosDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);

// Error Handling
app.use(errorHandler);

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
