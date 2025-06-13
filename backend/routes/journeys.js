const express = require('express');
const router = express.Router();
const Journey = require('../models/Journey');
const ensureLoggedIn = require('../middleware/ensureLoggedIn');
const Step = require('../models/Step');
const { awardBadges } = require('../models/Badge');
const { default: mongoose } = require('mongoose');

// ----------- PUBLIC ROUTES -----------

// GET /api/journeys/user/:userId - get all journeys by a specific user (public)
router.get('/user/:userId', async (req, res) => {
  try {
    const journeys = await Journey.find({ user_id: req.params.userId });
    res.json(journeys);
  } catch (error) {
    console.error('Error fetching journeys for user:', error);
    res.status(500).json({ error: 'Failed to fetch journeys' });
  }
});

// GET /api/journeys/:id - get one journey by id (public)
router.get('/:id', async (req, res) => {
  try {
    const journey = await Journey.findById(req.params.id).populate('user_id', 'name');
    if (!journey) {
      return res.status(404).json({ error: 'Journey not found' });
    }
    res.json(journey);
  } catch (error) {
    console.error('Error fetching journey:', error);
    res.status(500).json({ error: 'Failed to fetch journey' });
  }
});

// ----------- PROTECTED ROUTES -----------
router.use(ensureLoggedIn);

// GET /api/journeys - get journeys for logged-in user
router.get('/', async (req, res) => {
  try {
    const userId = req.user._id;
    const journeys = await Journey.find({ user_id: userId });
    res.json(journeys);
  } catch (error) {
    console.error('Error fetching journeys:', error);
    res.status(500).json({ error: 'Failed to fetch journeys' });
  }
});

// POST /api/journeys - create journey for logged-in user, award badges based on total miles
router.post('/', async (req, res) => {
  try {
    const journeyData = { ...req.body, user_id: req.user._id };
    const journey = new Journey(journeyData);
    const savedJourney = await journey.save();

    // Calculate total miles for this user
    const journeys = await Journey.find({ user_id: req.user._id });
    const steps = await Step.find({ user_id: req.user._id });

    const journeyMiles = journeys.reduce((sum, j) => sum + (j.distance_mi || 0), 0);
    const totalSteps = steps.reduce((sum, s) => sum + (s.steps || 0), 0);
    const stepMiles = (totalSteps * 2.5) / 5280;
    const totalMilesTraveled = journeyMiles + stepMiles;
    await awardBadges(req.user._id, totalMilesTraveled);

    res.status(201).json(savedJourney);
  } catch (error) {
    console.error('Error creating journey:', error);
    res.status(500).json({ error: 'Failed to create journey' });
  }
});

// PUT /api/journeys/:id - update journey owned by logged-in user
router.put('/:id', async (req, res) => {
  try {
    const journey = await Journey.findOneAndUpdate(
      { _id: req.params.id, user_id: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!journey) {
      return res.status(404).json({ error: 'Journey not found or not owned by user' });
    }
    res.json(journey);
  } catch (error) {
    console.error('Error updating journey:', error);
    res.status(500).json({ error: 'Failed to update journey' });
  }
});

// DELETE /api/journeys/:id - delete journey owned by logged-in user
router.delete('/:id', async (req, res) => {
  try {
    const journey = await Journey.findOneAndDelete({ _id: req.params.id, user_id: req.user._id });
    if (!journey) {
      return res.status(404).json({ error: 'Journey not found or not owned by user' });
    }
    res.json({ message: 'Journey deleted successfully' });
  } catch (error) {
    console.error('Error deleting journey:', error);
    res.status(500).json({ error: 'Failed to delete journey' });
  }
});

// POST /api/journeys/:journeyId/comments - add comment to journey
router.post('/:journeyId/comments', async (req, res) => {
  try {
    const { journeyId } = req.params;
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ message: 'Text is required.' });
    }
    const journey = await Journey.findById(journeyId);
    if (!journey) return res.status(404).json({ message: 'Journey not found.' });

    const newComment = { 
      _id: new mongoose.Types.ObjectId(),
      name: req.user.name,
      text,
      createdAt: new Date() };
    journey.comments.push(newComment);
    await journey.save();

    res.status(201).json(newComment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// DELETE /api/journeys/:journeyId/comments/:commentId - delete comment from journey
router.delete('/:journeyId/comments/:commentId', ensureLoggedIn, async (req, res) => {
  try {
    const { journeyId, commentId } = req.params;
    const userId = req.user._id.toString();
    const journey = await Journey.findById(journeyId);
    if (!journey) return res.status(404).json({ error: 'Journey not found' });
    if (journey.user_id.toString() !== userId) {
      return res.status(403).json({ error: 'Not authorized to delete comments on this journey' });
    }
    const initialLength = journey.comments.length;
    journey.comments = journey.comments.filter(c => c._id?.toString() !== commentId);
    const finalLength = journey.comments.length;
    if (initialLength === finalLength) {
      return res.status(404).json({ error: 'Comment not found' });
    }
    await journey.save();
    res.json({ message: 'Comment deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete comment' });
  }
});


module.exports = router;

