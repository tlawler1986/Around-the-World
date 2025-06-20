const Journey = require('../models/Journey');
const Step = require('../models/Step');
const { awardBadges } = require('../models/Badge');
const mongoose = require('mongoose');

// PUBLIC
exports.getJourneysByUser = async (req, res) => {
  try {
    const journeys = await Journey.find({ user_id: req.params.userId });
    res.json(journeys);
  } catch (error) {
    console.error('Error fetching journeys for user:', error);
    res.status(500).json({ error: 'Failed to fetch journeys' });
  }
};

exports.getJourneyById = async (req, res) => {
  try {
    const journey = await Journey.findById(req.params.id).populate('user_id', 'name');
    if (!journey) return res.status(404).json({ error: 'Journey not found' });
    res.json(journey);
  } catch (error) {
    console.error('Error fetching journey:', error);
    res.status(500).json({ error: 'Failed to fetch journey' });
  }
};

// PROTECTED
exports.getLoggedInUserJourneys = async (req, res) => {
  try {
    const journeys = await Journey.find({ user_id: req.user._id });
    res.json(journeys);
  } catch (error) {
    console.error('Error fetching journeys:', error);
    res.status(500).json({ error: 'Failed to fetch journeys' });
  }
};

exports.createJourney = async (req, res) => {
  try {
    const journeyData = { ...req.body, user_id: req.user._id };
    const journey = new Journey(journeyData);
    const savedJourney = await journey.save();

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
};

exports.updateJourney = async (req, res) => {
  try {
    const journey = await Journey.findOneAndUpdate(
      { _id: req.params.id, user_id: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!journey) return res.status(404).json({ error: 'Journey not found or not owned by user' });
    res.json(journey);
  } catch (error) {
    console.error('Error updating journey:', error);
    res.status(500).json({ error: 'Failed to update journey' });
  }
};

exports.deleteJourney = async (req, res) => {
  try {
    const journey = await Journey.findOneAndDelete({ _id: req.params.id, user_id: req.user._id });
    if (!journey) return res.status(404).json({ error: 'Journey not found or not owned by user' });
    res.json({ message: 'Journey deleted successfully' });
  } catch (error) {
    console.error('Error deleting journey:', error);
    res.status(500).json({ error: 'Failed to delete journey' });
  }
};

exports.addComment = async (req, res) => {
  try {
    const { journeyId } = req.params;
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: 'Text is required.' });

    const journey = await Journey.findById(journeyId);
    if (!journey) return res.status(404).json({ message: 'Journey not found.' });

    const newComment = {
      _id: new mongoose.Types.ObjectId(),
      name: req.user.name,
      text,
      createdAt: new Date()
    };
    journey.comments.push(newComment);
    await journey.save();
    res.status(201).json(newComment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const { journeyId, commentId } = req.params;
    const userId = req.user._id.toString();

    const journey = await Journey.findById(journeyId);
    if (!journey) return res.status(404).json({ error: 'Journey not found' });
    if (journey.user_id.toString() !== userId) return res.status(403).json({ error: 'Not authorized to delete comments on this journey' });

    const initialLength = journey.comments.length;
    journey.comments = journey.comments.filter(c => c._id?.toString() !== commentId);
    if (journey.comments.length === initialLength) return res.status(404).json({ error: 'Comment not found' });

    await journey.save();
    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete comment' });
  }
};
