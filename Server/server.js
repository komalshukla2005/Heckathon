const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const expenseRoutes = require('./routes/expense');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/expenseTracker', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Serve static frontend files
app.use(express.static(path.join(__dirname, '../Client')));

// Serve index.html for the frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../Client/index.html'));
});

// API routes
app.use('/api/expenses', expenseRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

