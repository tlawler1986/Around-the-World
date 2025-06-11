const express = require('express');
const router = express.Router();
const { Badge, awardBadges } = require('../models/Badge');
const Journey = require('../models/Journey');
const Step = require('../models/Step');
const ensureLoggedIn = require('../middleware/ensureLoggedIn');

router.use(ensureLoggedIn);

router.get('/', async (req, res) => {
  try {
    const userId = req.user._id;

    const journeys = await Journey.find({ user_id: userId });
    const steps = await Step.find({ user_id: userId });

    const totalJourneyMiles = journeys.reduce((sum, j) => sum + (j.distance_mi || 0), 0);
    const totalSteps = steps.reduce((sum, s) => sum + (s.steps || 0), 0);
    const feetPerStep = 2.5;
    const totalStepMiles = (totalSteps * feetPerStep) / 5280;
    const totalMilesTraveled = totalJourneyMiles + totalStepMiles;

    const newBadges = await awardBadges(userId, totalMilesTraveled);
    const allBadges = await Badge.find({ user_id: userId }).sort({ earnedAt: -1 });

    res.json({ badges: allBadges, newBadges });

  } catch (error) {
    console.error('Error fetching or awarding badges:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

