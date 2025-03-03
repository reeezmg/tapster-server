const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();
const cookieParser = require('cookie-parser');
const authenticateToken = require('../middleware/auth');
const Set = require('../models/Set');
const JWT_SECRET = 'your_jwt_secret'; // Replace with your actual secret key

// Use cookie-parser middleware
router.use(cookieParser());

// Register Route
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists.' });
    }

    // Create a new user
    const newUser = new User({ name, email, password });
    await newUser.save();

    const token = jwt.sign({ id: newUser._id, userType:'custom' }, JWT_SECRET, {
      expiresIn: '7d', // Token expires in 1 week
    });


    res.cookie('token', token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,  // 1 week in milliseconds
      httpOnly: false,                   // Protect against XSS
      secure: true,                     // Ensure cookie is sent over HTTPS only
      sameSite: 'None',                 // Allow cross-site cookies
      domain: '.tapster.shop',  
    });
    


    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Error registering user', error });
  }
});

router.post('/dregister', async (req, res) => {
  try {
    const { name, email, password,id } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists.' });
    }
    const set = await Set.findById(id);
    if(set.user){
      return res.status(400).json({ message: 'user already registered for this card' });
    }


    // Create a new user
    const newUser = new User({ name, email, password });
    await newUser.save();

 
    set.user = newUser._id;
    await set.save();

    const token = jwt.sign({ id: newUser._id, userType:'ready' }, JWT_SECRET, {
      expiresIn: '7d', // Token expires in 1 week
    });


    res.cookie('token', token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,  // 1 week in milliseconds

    });

    res.status(201).json(set._id);
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Error registering user', error });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email 
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    const token = jwt.sign({ id: user._id, userType:'custom'}, JWT_SECRET, {
      expiresIn: '7d', // Token expires in 1 week
    });

    // Set token as HTTP-only cookie for 1 week
    res.cookie('token', token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,  // 1 week in milliseconds
      httpOnly: false,                   // Protect against XSS
      secure: true,                     // Ensure cookie is sent over HTTPS only
      sameSite: 'None',                 // Allow cross-site cookies
      domain: '.tapster.shop', 
    
    });
    

    res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error });
  }
});

router.post('/dlogin', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email 
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    console.log('User ID:', user._id);

    // Check password (assuming user model has a comparePassword method)
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    // Find the associated Set
    const set = await Set.findOne({ user: user._id.toString() });

    if (!set) {
      return res.status(404).json({ message: 'Set not found for this user' });
    }

    console.log('Set ID:', set._id);
    const token = jwt.sign({ id: user._id, userType:'ready'}, JWT_SECRET, {
      expiresIn: '7d', // Token expires in 1 week
    });

    // Set token as HTTP-only cookie for 1 week
    res.cookie('token', token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,  // 1 week in milliseconds
      httpOnly: false,                   // Protect against XSS
      secure: true,                     // Ensure cookie is sent over HTTPS only
      sameSite: 'None',                 // Allow cross-site cookies
      domain: '.tapster.shop', 
    });
    

    res.status(200).json(set._id);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
});

router.post('/updatepassword', async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    // Find the user by email
    const user = await User.findOne({ email }); // Use findOne to get a single document
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: 'Password updated successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating password.', error });
  }
});


router.get('/getuserinfo', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  console.log(userId)

  try {
    // Find the user by id and exclude the password field
    const user = await User.findById(userId).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.status(200).json({
      message: 'User fetched successfully.',
      user,
    });
  } catch (err) {
    console.error('Error fetching user:', err.message);
    res.status(500).json({
      error: 'An error occurred while fetching user.',
    });
  }
});

// Update user details except userType
router.put('/', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  console.log(req.body)



  try {
    // Find the user by id and update the fields provided in the request body
    const updatedUser = await User.findByIdAndUpdate(userId, req.body, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.status(200).json({
      message: 'User updated successfully.',
      user: updatedUser,
    });
  } catch (err) {
    console.error('Error updating user:', err.message);
    res.status(500).json({
      error: 'An error occurred while updating user.',
    });
  }
});






module.exports = router;
