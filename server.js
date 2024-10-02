const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 5000;


// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Define a schema and model with timestamps
const roundSchema = new mongoose.Schema({
  round: Number,
  player1: Object,
  player2: Object,
  winner: String,
}, { timestamps: true });

const Round = mongoose.model('Round', roundSchema);

// Route to receive data
app.post('/api/rounds', async (req, res) => {
  try {
    const rounds = req.body; // Expecting an array of rounds
    await Round.insertMany(rounds); // Insert all rounds into the database
    res.status(201).send({ message: 'Rounds saved successfully!' });
  } catch (error) {
    console.error('Error saving rounds:', error);
    res.status(500).send({ error: 'An error occurred while saving rounds' });
  }
});

// Route to get all rounds
app.get('/api/rounds', async (req, res) => {
  try {
    const rounds = await Round.find(); // Fetch all rounds from the database
    res.status(200).send(rounds); // Send the rounds back as a response
    console.log(rounds);
  } catch (error) {
    console.error('Error fetching rounds:', error);
    res.status(500).send({ error: 'An error occurred while fetching rounds' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
