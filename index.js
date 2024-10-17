const axios = require('axios');
const express = require('express');
const path = require('path');
const app = express();
require('dotenv').config();

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.get('/api/geocode', async (req, res) => {  // Updated path to '/api/geocode'
  const { address } = req.query;
  if (!address) return res.status(400).json({ error: 'Address is required' });

  try {
    const apiKey = process.env.LOCATIONIQ_API_KEY;
    const response = await axios.get(`https://us1.locationiq.com/v1/search.php?key=${apiKey}&q=${encodeURIComponent(address)}&format=json`);

    if (response.data.length === 0) {
      return res.status(404).json({ error: 'No results found for this address.' });
    }

    const { lat, lon } = response.data[0];
    res.json({ address: response.data[0].display_name, latitude: lat, longitude: lon });
  } catch (error) {
    res.status(500).json({ error: 'Geocoding failed', details: error.message });
  }
});

app.get('/api/reverse-geocode', async (req, res) => {  // Updated path to '/api/reverse-geocode'
  const { lat, lng } = req.query;
  if (!lat || !lng) return res.status(400).json({ error: 'Latitude and longitude are required' });

  try {
    const apiKey = process.env.LOCATIONIQ_API_KEY;
    const response = await axios.get(`https://us1.locationiq.com/v1/reverse.php?key=${apiKey}&lat=${lat}&lon=${lng}&format=json`);

    if (!response.data || !response.data.display_name) {
      return res.status(404).json({ error: 'No results found for these coordinates.' });
    }

    res.json({ address: response.data.display_name });
  } catch (error) {
    res.status(500).json({ error: 'Reverse geocoding failed', details: error.message });
  }
});

app.get('/api/geolocation', async (req, res) => {  // Updated path to '/api/geolocation'
  const { ip } = req.query;
  if (!ip) return res.status(400).json({ error: 'IP address is required' });

  try {
    const response = await axios.get(`https://ipinfo.io/${ip}?token=${process.env.IPINFO_API_KEY}`);

    if (!response.data) {
      return res.status(404).json({ error: 'No results found for this IP address.' });
    }

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Geolocation failed', details: error.message });
  }
});

// Serve the main HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Export the app for Vercel
module.exports = app; 
