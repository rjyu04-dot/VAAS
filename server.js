// server.js
const express = require('express');
const { Pool } = require('pg'); // PostgreSQL client
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express(); // ← declare app first

// Serve all files in the project folder
app.use(express.static(path.join(__dirname)));

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ← Replace these with your actual Supabase credentials
const db = new Pool({ host: 'qfbnqzkfibvqqodohdkq.supabase.co', user: 'postgres', password: 'RusselJamesYu.11', database: 'postgres', port: 5432, ssl: { rejectUnauthorized: false } });

// Test DB connection
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://qfbnqzkfibvqqodohdkq.supabase.co', // your project URL
  'sb_publishable_5iqwo3kLms7Y9HuTIDwbwA_j1TENl8x'                             // from Supabase Settings → API → anon key
);

// Test route so we can open localhost in browser
app.get('/', (req, res) => res.send('Server is running!'));

// Sign-Up endpoint
app.post('/signup', async (req, res) => {
  const { fn, cn, email, Username, password } = req.body;

  try {
    const { data: existing, error: errExists } = await supabase
      .from('users')
      .select('*')
      .eq('username', Username);

    if (existing.length > 0) {
      return res.json({ success: false, message: 'Username already exists!' });
    }

    const { data, error } = await supabase
      .from('users')
      .insert([{ full_name: fn, contact_number: cn, email, username: Username, password }]);

    if (error) throw error;

    res.json({ success: true, message: 'Sign-up successful!' });
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: 'Error occurred' });
  }
});

// Login endpoint using Supabase
app.post('/login', async (req, res) => {
  const { Username, password } = req.body;

  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', Username)
      .eq('password', password);

    if (error) throw error;

    if (user.length > 0) {
      res.json({ success: true, message: 'Login successful!' });
    } else {
      res.json({ success: false, message: 'Invalid username or password.' });
    }

  } catch (err) {
    console.error(err);
    res.json({ success: false, message: 'Error occurred' });
  }
});

const PORT = 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${PORT}`);
});