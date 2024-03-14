

require('dotenv').config();
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
const cors = require('cors');

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

  const corsOptions = {
    origin: 'http://127.0.0.1:5500', // Set to your frontend's origin
    credentials: true, // To allow cookies and sessions
  };

  const express = require('express');

const User = require('./User'); // Adjust the path as necessary
const bcrypt = require('bcrypt');
const session =require("express-session")
const cookieParser = require("cookie-parser")
const store = new session.MemoryStore();
const validator = require('validator');

const app = express();
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(session({
  secret: "secret",
  resave: true,
  saveUninitialized: false, // Creates a session for every visitor, regardless of changes
  store, // Ensure you have defined 'store' for session persistence
  cookie: {
    domain: 'localhost', // Specifies where the cookie is valid
    path: '/', // Specifies the path where the cookie is valid
    httpOnly: false, // For development, but consider true for production to prevent XSS attacks
    secure: false, // For HTTPS, set this to true in production
    sameSite: 'lax', // Lax is suitable for development and most production cases
    maxAge: 1000 * 60 * 60 * 24 * 365 // Cookie expiry set to one year
  }
}));


app.use(express.static(__dirname));


app.post('/signup', async (req, res) => {

  try {
    const { email, username, password } = req.body;

    // Validate email format
    if (!validator.isEmail(email)) {
      return res.status(400).send('Invalid email format.');
    }

    // Proceed with user creation if email is valid
    const user = new User({ email, username, password });
    await user.save();
    res.status(201).send('User created successfully. Please log in.');
  } catch (error) {
    // Check for duplicate email error
    if (error.code === 11000) {
      if (error.keyPattern && error.keyPattern.email) {
        return res.status(409).json({ message: 'This email is already in use. Please use a different email.' });
      } 
      if (error.keyPattern && error.keyPattern.username) {
        return res.status(409).json({ message: 'This username is already in use. Please choose a different username.' });
      }
    }
    // For other errors
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
    
    // Set user info in session
    req.session.user = user;

    // Explicitly save the session before sending the response
    req.session.save(err => {
      if (err) {
        // Handle error, could log it and return a 500 error to the client
        console.error("Session save error:", err);
        return res.status(500).send("An error occurred");
      }
      // Only send the response after the session has been saved successfully
      res.status(200).send('Login successful');
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
});


app.post("/user", (req,res) =>{
  return res.send(req.session.user);
});

app.post("/logout", (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).send("Could not log out, please try again.");
    }
    res.clearCookie('connect.sid'); // Replace 'connect.sid' with the name of your session cookie if different
    res.send("User logged out");
  });
});

app.post('/saveReactionTime', async (req, res) => {
  if (!req.session.user) {
    return res.status(401).send('Unauthorized');
  }

  const { reactionTime } = req.body;
  if (reactionTime == null) {
    return res.status(400).send('No reaction time provided');
  }

  try {
    // Find the user in the database using the ID stored in the session
    const user = await User.findById(req.session.user._id);

    if (!user) {
      return res.status(404).send('User not found');
    }

    // Create a new object for the reaction time including the timestamp
    const reactionTimeEntry = {
      time: reactionTime,
      recordedAt: new Date() // Current date and time
    };

    // Add the new reaction time object to the user's reactionTimes array
    // This example assumes you want to limit the array to the last 50 reaction times
    user.reactionTimes = [...user.reactionTimes, reactionTimeEntry].slice(-50);
    
    // Save the updated user document to the database
    await user.save();

    // Update the user data in the session to reflect the changes
    req.session.user = user.toObject(); // Ensure the session contains the updated user data
    req.session.save((err) => { // Save the session
      if (err) {
        throw err;
      }
      res.send('Reaction time and timestamp saved and session updated');
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
});



app.get('/getReactionTimes', async (req, res) => {
  if (!req.session.user) {
    return res.status(401).send('Unauthorized');
  }

  try {
    // Find the user in the database using the ID stored in the session
    const user = await User.findById(req.session.user._id);

    if (!user) {
      return res.status(404).send('User not found');
    }

    // Send back the user's reaction times
    res.json(user.reactionTimes);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));