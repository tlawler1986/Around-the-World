const express = require('express');
const router = express.Router();
const ensureLoggedIn = require('../middleware/ensureLoggedIn');
const { getBadges } = require('../controllers/badgesController');

router.use(ensureLoggedIn);

router.get('/', getBadges);

module.exports = router;
