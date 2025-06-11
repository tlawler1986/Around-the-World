const express = require('express');
const router = express.Router();
const User = require('../models/user');

// GET /api/users/recent
router.get('/recent', async (req, res) => {
  try {
    const users = await User.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select('name _id createdAt'); 
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch recent users' });
  }
});

// GET /api/users/:id
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('name _id');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching user' });
  }
});

module.exports = router;
