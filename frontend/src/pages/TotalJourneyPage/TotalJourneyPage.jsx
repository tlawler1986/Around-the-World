import { useState, useEffect } from 'react';
import * as journeyService from '../../services/journeyService';
import * as stepService from '../../services/stepService';
import * as badgeService from '../../services/badgeService';
import { useNavigate } from 'react-router-dom';

export default function TotalJourneyPage({ userId }) {
  const [journeys, setJourneys] = useState([]);
  const [steps, setSteps] = useState([]);
  const [badges, setBadges] = useState([]);
  const [newBadges, setNewBadges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

useEffect(() => {
  async function fetchData() {
    setLoading(true);
    setError(null);
    try {
      const [journeysData, stepsData, badgesData] = await Promise.all([
        journeyService.index(),
        stepService.getSteps(userId),
        badgeService.getBadges(),
      ]);
      setJourneys(journeysData || []);
      setSteps(stepsData || []);
      setBadges(badgesData.badges || []);
      setNewBadges(badgesData.newBadges || []);
     } catch (err) {
      console.error(err);
      setError('Failed to load data');
    }
    setLoading(false);
  }

  fetchData();
}, [userId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  const totalJourneyMiles = journeys.reduce((sum, journey) => sum + (journey.distance_mi || 0), 0);
  const totalSteps = steps.reduce((sum, step) => sum + (step.steps || 0), 0);
  const feetPerStep = 2.5;
  const totalStepMiles = (totalSteps * feetPerStep) / 5280;
  const totalMilesTraveled = totalJourneyMiles + totalStepMiles;
  const earthCircumference = 24901;
  const timesAroundEarth = totalMilesTraveled / earthCircumference;
  const percentageAroundEarth = (timesAroundEarth * 100).toFixed(2);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Total Journey Stats</h1>

      <p>Total miles from journeys: <strong>{totalJourneyMiles.toFixed(2)}</strong> miles</p>
      <p>Total steps taken: <strong>{totalSteps.toLocaleString()}</strong> steps</p>
      <p>Converted steps to miles: <strong>{totalStepMiles.toFixed(2)}</strong> miles</p>
      <hr />
      <p><strong>Total miles traveled: {totalMilesTraveled.toFixed(2)} miles</strong></p>
      <p>That’s equivalent to traveling around the Earth <strong>{timesAroundEarth.toFixed(2)}</strong> times.</p>
      <p>Or <strong>{percentageAroundEarth}%</strong> of the way around the Earth.</p>

      <hr />

      <h2>Your Badges</h2>
      {Array.isArray (badges) && badges.length === 0 ? (
        <p>No badges earned yet. Keep Traveling!</p>
      ) : (
        <ul>
          {Array.isArray(badges) && badges.map(badge => (
            <li key={badge._id}>
              <strong>{badge.level}</strong> — Earned on {new Date(badge.earnedAt).toLocaleDateString()}
            </li>
          ))}
        </ul>
      )}
      {newBadges.length > 0 && (
        <>
          <hr />
          <h3>🎉 New Badges Earned!</h3>
          <ul style={{ color: 'green', fontWeight: 'bold' }}>
            {newBadges.map(badge => (
              <li key={badge._id}>
                {badge.level} — Earned on {new Date(badge.earnedAt).toLocaleDateString()}
              </li>
            ))}
          </ul>
        </>
      )}

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '30px' }}>
        <button onClick={() => navigate('/journeys')}>
          ➕ Back to Journeys
        </button>
      </div>
    </div>
  );}

