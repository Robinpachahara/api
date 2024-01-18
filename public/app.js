const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors'); // Add cors middleware

const app = express();
const port = 5000;

// Connect to MongoDB
mongoose.connect('mongodb://13.233.235.138:27017/demoData', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
mongoose.set('debug', true);

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Enable cors middleware
app.use(cors());
// Use bodyParser middleware to parse JSON requests
app.use(bodyParser.json());

// Define a simple mongoose model
const SampleModel = mongoose.model('SampleModel', {
  category: String,
  'Pixel ': Number,
  'Ample ': Number,
}, 'demo');

// Define a route for adding data to the 'demo' collection
app.post('/api/add-demo-data', async (req, res) => {
  try {
    // Create a new document based on the request body
    const newData = new SampleModel(req.body);

    // Save the new document to the 'demo' collection
    await newData.save();

    res.json({ message: 'Data added successfully' });
  } catch (error) {
    console.error('Error adding data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Define a route for fetching data from the 'demo' collection
app.get('/api/demo-data', async (req, res) => {
  try {
    const data = await SampleModel.find({}, null, { collection: 'demo' });
    console.log('Fetched data:', data);
    res.json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Serve the index.html file on the root URL
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
