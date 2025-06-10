import { useState, useEffect } from 'react';
import * as journeyService from '../../services/journeyService';
import * as stepService from '../../services/stepService';
import { useNavigate } from 'react-router-dom';

export default function TotalJourneyPage({ userId }) {
  const [journeys, setJourneys] = useState([]);
  const [steps, setSteps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const journeysData = await journeyService.index();
        const stepsData = await stepService.getSteps(userId);
        setJourneys(journeysData || []);
        setSteps(stepsData || []);
      } catch (err) {
        setError('Failed to load data');
      }
      setLoading(false);
    }
    fetchData();
  }, [userId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  // Calculate total miles from journeys
  const totalJourneyMiles = journeys.reduce((sum, journey) => sum + (journey.distance_mi || 0), 0);

  // Calculate total steps
  const totalSteps = steps.reduce((sum, step) => sum + (step.steps || 0), 0);

  // Convert steps to miles
  const feetPerStep = 2.5;
  const totalStepMiles = (totalSteps * feetPerStep) / 5280;

  // Total miles traveled (journeys + steps)
  const totalMilesTraveled = totalJourneyMiles + totalStepMiles;

  const earthCircumference = 24901;

  // Times traveled around the Earth
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

    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '30px' }}>
        <button
          onClick={() => navigate('/journeys')}
        >
          ➕ Back to Journeys
        </button>
      </div>
    </div>
  );
}