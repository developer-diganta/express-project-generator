
const express = require('express');
const cors = require('cors');


require('dotenv').config(); // Load environment variables from .env file

const app = express(); // Create an Express.js app
const PORT = process.env.PORT || 3000; // Set the port for the server

// Middlewares
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON requests
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded requests
app.use(express.static('static')); // Serve static files from 'static' folder

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to this new Express.js Project' });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}/`);
});

module.exports = app;