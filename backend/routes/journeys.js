const express = require('express');
const router = express.Router();
const ensureLoggedIn = require('../middleware/ensureLoggedIn');
const journeysController = require('../controllers/journeysController');

// ----------- PUBLIC ROUTES -----------
router.get('/user/:userId', journeysController.getJourneysByUser);
router.get('/:id', journeysController.getJourneyById);

// ----------- PROTECTED ROUTES -----------
router.use(ensureLoggedIn);

router.get('/', journeysController.getLoggedInUserJourneys);
router.post('/', journeysController.createJourney);
router.put('/:id', journeysController.updateJourney);
router.delete('/:id', journeysController.deleteJourney);

router.post('/:journeyId/comments', journeysController.addComment);
router.delete('/:journeyId/comments/:commentId', journeysController.deleteComment);

module.exports = router;

