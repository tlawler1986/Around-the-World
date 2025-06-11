const express = require('express');
const router = express.Router();
const Journey = require('../models/Journey');
const Step = require('../models/Step'); 
const User = require('../models/user'); 

router.get('/totalTraveled', async (req, res) => {
  try {
    const allJourneys = await Journey.find({});
    const allSteps = await Step.find({});
    const totalJourneyMiles = allJourneys.reduce((sum, j) => sum + (j.distance_mi || 0), 0);
    const totalSteps = allSteps.reduce((sum, s) => sum + (s.steps || 0), 0);
    res.json({ totalJourneyMiles, totalSteps });
  } catch (error) {
    console.error('Error fetching total traveled:', error);
    res.status(500).json({ error: 'Failed to aggregate data' });
  }
});

router.get('/userCount', async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    res.json({ userCount });
  } catch (error) {
    console.error('Error fetching user count:', error);
    res.status(500).json({ error: 'Failed to fetch user count' });
  }
});

module.exports = router;
