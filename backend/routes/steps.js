// backend/routes/steps.js
const express = require('express');
const router = express.Router();
const ensureLoggedIn = require('../middleware/ensureLoggedIn');

// Import controller functions
const {
  getSteps,
  createStep,
  getStepById,
  updateStep,
  deleteStep,
} = require('../controllers/stepsController');

// Protect all routes
router.use(ensureLoggedIn);

// Steps routes
router.get('/', getSteps);
router.post('/', createStep);
router.get('/:id', getStepById);
router.put('/:id', updateStep);
router.delete('/:id', deleteStep);

module.exports = router;
