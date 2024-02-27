

require('dotenv').config();
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
const cors = require('cors');

mongoose.connect('mongodb+srv://hrant:password@testserver.rxdp7dj.mongodb.net/?retryWrites=true&w=majority&appName=testserver')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));


  const express = require('express');
const User = require('./User'); // Adjust the path as necessary
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/signup', async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const user = new User({ email, username, password });
    await user.save();
    res.status(201).send('User created successfully');
  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).send('Email or password is incorrect');
    }
    // Generate token (optional)
    // const token = jwt.sign({ userId: user._id }, 'your_jwt_secret', { expiresIn: '1d' });
    // res.status(200).json({ token });
    res.status(200).send('Login successful');
  } catch (error) {
    res.status(400).send(error.message);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
