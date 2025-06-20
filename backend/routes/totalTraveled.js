const express = require('express');
const router = express.Router();
const { getTotalTraveled, getUserCount } = require('../controllers/totalTraveledController');

router.get('/totalTraveled', getTotalTraveled);
router.get('/userCount', getUserCount);

module.exports = router;

