const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const journeySchema = new Schema({
  title: {
    type: String,
    required: true
  },
  start_location_id: {
    type: String,
    required: true
  },
  end_location_id: {
    type: String,
    required: true
  },
  distance_mi: {
    type: Number,
    required: false
  },
  date: {
    type: Date,
    default: Date.now
  },
  'mode of transportation': {
    type: String,
    required: false
  },
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Journey', journeySchema);