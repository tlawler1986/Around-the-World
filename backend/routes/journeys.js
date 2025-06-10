const express = require('express');
const router = express.Router();
const Journey = require('../models/Journey'); 
const ensureLoggedIn = require('../middleware/ensureLoggedIn');

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

// POST /api/journeys - create journey for logged-in user
router.post('/', async (req, res) => {
  try {
    const journeyData = { ...req.body, user_id: req.user._id };
    const journey = new Journey(journeyData);
    const savedJourney = await journey.save();
    res.status(201).json(savedJourney);
  } catch (error) {
    console.error('Error creating journey:', error);
    res.status(500).json({ error: 'Failed to create journey' });
  }
});

// GET /api/journeys/:id - get one journey owned by logged-in user
router.get('/:id', async (req, res) => {
  try {
    const journey = await Journey.findOne({ _id: req.params.id, user_id: req.user._id });
    if (!journey) {
      return res.status(404).json({ error: 'Journey not found' });
    }
    res.json(journey);
  } catch (error) {
    console.error('Error fetching journey:', error);
    res.status(500).json({ error: 'Failed to fetch journey' });
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
      return res.status(404).json({ error: 'Journey not found' });
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
      return res.status(404).json({ error: 'Journey not found' });
    }
    res.json({ message: 'Journey deleted successfully' });
  } catch (error) {
    console.error('Error deleting journey:', error);
    res.status(500).json({ error: 'Failed to delete journey' });
  }
});

module.exports = router;
