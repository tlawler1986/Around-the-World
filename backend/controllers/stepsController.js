const Step = require('../models/Step');
const Journey = require('../models/Journey');
const { awardBadges } = require('../models/Badge');

exports.getSteps = async (req, res) => {
  try {
    const userId = req.user._id;
    const steps = await Step.find({ user_id: userId });
    res.json(steps);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createStep = async (req, res) => {
  try {
    const userId = req.user._id;
    const newStep = new Step({ ...req.body, user_id: userId });
    const savedStep = await newStep.save();

    const [allSteps, allJourneys] = await Promise.all([
      Step.find({ user_id: userId }),
      Journey.find({ user_id: userId }),
    ]);

    const totalSteps = allSteps.reduce((sum, s) => sum + (s.steps || 0), 0);
    const stepMiles = (totalSteps * 2.5) / 5280;
    const journeyMiles = allJourneys.reduce((sum, j) => sum + (j.distance_mi || 0), 0);
    await awardBadges(userId, stepMiles + journeyMiles);

    res.status(201).json(savedStep);
  } catch (error) {
    console.error('Error creating step:', error);
    res.status(500).json({ error: 'Failed to create step' });
  }
};

exports.getStepById = async (req, res) => {
  try {
    const step = await Step.findOne({ _id: req.params.id, user_id: req.user._id });
    if (!step) return res.status(404).json({ error: 'Step not found' });
    res.json(step);
  } catch (error) {
    console.error('Error fetching step:', error);
    res.status(500).json({ error: 'Failed to fetch step' });
  }
};

exports.updateStep = async (req, res) => {
  try {
    const updatedStep = await Step.findOneAndUpdate(
      { _id: req.params.id, user_id: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedStep) return res.status(404).json({ error: 'Step not found' });
    res.json(updatedStep);
  } catch (error) {
    console.error('Error updating step:', error);
    res.status(500).json({ error: 'Failed to update step' });
  }
};

exports.deleteStep = async (req, res) => {
  try {
    const deletedStep = await Step.findOneAndDelete({ _id: req.params.id, user_id: req.user._id });
    if (!deletedStep) return res.status(404).json({ error: 'Step not found' });
    res.json({ message: 'Step deleted successfully' });
  } catch (error) {
    console.error('Error deleting step:', error);
    res.status(500).json({ error: 'Failed to delete step' });
  }
};
