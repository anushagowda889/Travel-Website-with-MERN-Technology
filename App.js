const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 5000;
const JWT_SECRET = 'your-secret-key';

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB Connection
mongoose
  .connect('mongodb://localhost:27017/travelwonder', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.error(err));

// User Schema
const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
});

const User = mongoose.model('User', UserSchema);

// Routes

// Sign Up
app.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const user = new User({ name, email, password: hashedPassword });
    await user.save();
    res.json({ message: 'User Registered Successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Email already exists' });
  }
});

// Sign In
app.post('/signin', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ error: 'User not found' });

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) return res.status(400).json({ error: 'Invalid Password' });

  const token = jwt.sign({ id: user._id }, JWT_SECRET);
  res.json({ message: 'Sign In Successful', token });
});

// Start Server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
