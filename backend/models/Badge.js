const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const badgeSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  level: { type: String, required: true },
  icon: { type: String },
  earnedAt: { type: Date, default: Date.now },
}, {
  timestamps: true
});

const Badge = mongoose.model('Badge', badgeSchema);

const earthMiles = 24901;

const badgeLevels = [
  { threshold: 0.25 * earthMiles, level: '1/4 Way Around', icon: '🌍' },
  { threshold: 0.5 * earthMiles, level: 'Halfway There', icon: '🛤️' },
  { threshold: 0.75 * earthMiles, level: 'Almost There', icon: '🚀' },
  { threshold: 1 * earthMiles, level: '1x Around Earth', icon: '🌎' },
  { threshold: 2 * earthMiles, level: '2x Around Earth', icon: '🌏' },
  { threshold: 3 * earthMiles, level: '3x Around Earth', icon: '✈️' },
  { threshold: 4 * earthMiles, level: '4x Around Earth', icon: '🚢' },
  { threshold: 5 * earthMiles, level: '5x Around Earth', icon: '🚴‍♂️' },
  { threshold: 6 * earthMiles, level: '6x Around Earth', icon: '🏆' },
  { threshold: 7 * earthMiles, level: '7x Around Earth', icon: '🥇' },
  { threshold: 8 * earthMiles, level: '8x Around Earth', icon: '🥈' },
  { threshold: 9 * earthMiles, level: '9x Around Earth', icon: '🥉' },
  { threshold: 10 * earthMiles, level: '10x Around Earth', icon: '🌟' }
];

async function awardBadges(userId, totalMilesTraveled) {
  const earnedBadges = await Badge.find({ user_id: userId });
  const earnedLevels = new Set(earnedBadges.map(b => b.level));
  const newBadges = [];


  for (const badge of badgeLevels) {
    if (totalMilesTraveled >= badge.threshold && !earnedLevels.has(badge.level)) {
      const newBadge = await Badge.create({
        user_id: userId,
        level: badge.level,
        icon: badge.icon,
      });
      newBadges.push(newBadge);
    }
  }
  return newBadges; 
}

module.exports = {
  Badge,
  awardBadges,
};
