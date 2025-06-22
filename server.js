const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;


app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


app.get('/api/questions', (req, res) => {
  const questionsPath = path.join(__dirname, 'public', 'questions.json');
  try {
    const data = JSON.parse(fs.readFileSync(questionsPath, 'utf-8'));
    const shuffled = data.sort(() => 0.5 - Math.random());
    const count = parseInt(req.query.count || 10);
    res.json(shuffled.slice(0, count));
  } catch (err) {
    res.status(500).json({ error: 'Failed to load questions' });
  }
});


app.post('/signup', (req, res) => {
  console.log('signup data:', req.body);
  res.redirect('/');
});


app.post('/submit-score', (req, res) => {
  const { name, score } = req.body;

  if (!name || typeof score !== 'number') {
    return res.status(400).json({ error: 'Missing name or score' });
  }

  const scoresPath = path.join(__dirname, 'scores.json');
  let scores = [];

  try {
    const data = fs.readFileSync(scoresPath, 'utf-8');
    scores = JSON.parse(data);
  } catch (err) {
    console.error('Error reading scores.json:', err);
  }

  scores.push({ name, score });

  try {
    fs.writeFileSync(scoresPath, JSON.stringify(scores, null, 2));
    res.json({ message: 'Score saved successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save score' });
  }
});


app.get('/api/leaderboard', (req, res) => {
  const scoresPath = path.join(__dirname, 'scores.json');
  try {
    const data = fs.readFileSync(scoresPath, 'utf-8');
    const scores = JSON.parse(data);
    const last20 = scores.slice(-20).reverse();
    res.json(last20);
  } catch (err) {
    res.status(500).json({ error: 'Could not load leaderboard' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Express server running: http://localhost:${PORT}`);
});