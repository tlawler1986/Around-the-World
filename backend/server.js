const path = require('path'); // Built into Node
const express = require('express');
const logger = require('morgan');
const app = express();
const stepRouter = require('./routes/steps'); 
const journeyRouter = require('./routes/journeys');
const cors = require('cors');
const totalTraveledRouter = require('./routes/totalTraveled');

// Process the secrets/config vars in .env
require('dotenv').config();

// Connect to the database
require('./db');

app.use(logger('dev'));
// Serve static assets from the frontend's built code folder (dist)
app.use(express.static(path.join(__dirname, '../frontend/dist')));
// Note that express.urlencoded middleware is not needed
// because forms are not submitted!
app.use(express.json());
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));

// Middleware to check the request's headers for a JWT and
// verify that it's a valid.  If so, it will assign the
// user object in the JWT's payload to req.user
app.use(require('./middleware/checkToken'));

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/posts', require('./routes/posts'));
app.use('/api/journeys', require('./routes/journeys'));
app.use('/api/steps', require('./routes/steps'));
app.use('/api', totalTraveledRouter);
app.use('/api/badges', require('./routes/badges'));


// Use a "catch-all" route to deliver the frontend's production index.html
app.get('/*splat', function (req, res) {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`The express app is listening on ${port}`);
});