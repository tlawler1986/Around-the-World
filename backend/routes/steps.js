const express = require('express');
const router = express.Router();
const Step = require('../models/Step');
const ensureLoggedIn = require('../middleware/ensureLoggedIn');
const Journey = require('../models/Journey');
const User = require('../models/user');
const { awardBadges } = require('../models/Badge');

// Protect all routes
router.use(ensureLoggedIn);

// GET /api/steps
router.get('/', async (req, res) => {
  try {
    const userId = req.user._id;
    const steps = await Step.find({ user_id: userId });
    res.json(steps);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/steps - create a new step for the logged-in user/ Award badges based on total miles
router.post('/', async (req, res) => {
  try {
    const userId = req.user._id;

    const stepData = { ...req.body, user_id: userId };
    const newStep = new Step(stepData);
    const savedStep = await newStep.save();

    const [allSteps, allJourneys] = await Promise.all([
      Step.find({ user_id: userId }),
      Journey.find({ user_id: userId }),
    ]);
    const totalSteps = allSteps.reduce((sum, s) => sum + (s.steps || 0), 0);
    const stepMiles = (totalSteps * 2.5) / 5280;
    const journeyMiles = allJourneys.reduce((sum, j) => sum + (j.distance_mi || 0), 0);
    const totalMilesTraveled = stepMiles + journeyMiles;

    await awardBadges(userId, totalMilesTraveled);

    res.status(201).json(savedStep);
  } catch (error) {
    console.error('Error creating step or awarding badge:', error);
    res.status(500).json({ error: 'Failed to create step or award badge' });
  }
});

// GET /api/steps/:id - get a single step belonging to the user
router.get('/:id', async (req, res) => {
  try {
    const step = await Step.findOne({ _id: req.params.id, user_id: req.user._id });
    if (!step) {
      return res.status(404).json({ error: 'Step not found' });
    }
    res.json(step);
  } catch (error) {
    console.error('Error fetching step:', error);
    res.status(500).json({ error: 'Failed to fetch step' });
  }
});

// PUT /api/steps/:id - update a step owned by the user
router.put('/:id', async (req, res) => {
  try {
    const updatedStep = await Step.findOneAndUpdate(
      { _id: req.params.id, user_id: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedStep) {
      return res.status(404).json({ error: 'Step not found' });
    }
    res.json(updatedStep);
  } catch (error) {
    console.error('Error updating step:', error);
    res.status(500).json({ error: 'Failed to update step' });
  }
});

// DELETE /api/steps/:id - delete a step owned by the user
router.delete('/:id', async (req, res) => {
  try {
    const deletedStep = await Step.findOneAndDelete({ _id: req.params.id, user_id: req.user._id });
    if (!deletedStep) {
      return res.status(404).json({ error: 'Step not found' });
    }
    res.json({ message: 'Step deleted successfully' });
  } catch (error) {
    console.error('Error deleting step:', error);
    res.status(500).json({ error: 'Failed to delete step' });
  }
});

module.exports = router;
