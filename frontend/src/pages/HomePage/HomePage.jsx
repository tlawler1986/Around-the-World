import { Link } from 'react-router-dom'; // Use 'react-router-dom' for web apps
import { useState, useEffect } from 'react';

export default function HomePage({ user, handleLogOut }) {
  const [totalJourneyMiles, setTotalJourneyMiles] = useState(0);
  const [totalSteps, setTotalSteps] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userCount, setUserCount] = useState(null);

  useEffect(() => {
    async function fetchTotals() {
      try {
        setLoading(true);
        const res = await fetch('/api/totalTraveled');
        if (!res.ok) throw new Error('Failed to load total traveled data');
        const data = await res.json();
        setTotalJourneyMiles(data.totalJourneyMiles);
        setTotalSteps(data.totalSteps);

        const userRes = await fetch('/api/userCount');
        if (!userRes.ok) throw new Error('Failed to load user count');
        const userData = await userRes.json();
        setUserCount(userData.userCount);

        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchTotals();
  }, []);

  const feetPerStep = 2.5;
  const totalStepMiles = (totalSteps * feetPerStep) / 5280;
  const totalMilesTraveled = totalJourneyMiles + totalStepMiles;
  const earthCircumference = 24901;
  const timesAroundEarth = totalMilesTraveled / earthCircumference;
  const percentageAroundEarth = (timesAroundEarth * 100).toFixed(2);

  return (
    <main style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Around the World</h1>

      {!user && (
        <p>
          Are you an avid traveler, or someone that just keeps track of their daily steps? Well, this
          is a fun little app that takes those distances and computes how many times you have traveled
          around the globe.
        </p>
      )}

      {loading && <p>Loading total traveled stats...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      {!loading && !error && (
        <section
          style={{ marginTop: '2rem', borderTop: '1px solid #ccc', paddingTop: '1rem' }}
        >
          <h2>Total Distance Traveled by {userCount ?? '...'} Users</h2>
          <p>
            <strong>{totalMilesTraveled.toFixed(2)}</strong> miles traveled collectively.
          </p>
          <p>That's about <strong>{timesAroundEarth.toFixed(2)}</strong> times around the Earth!</p>
          <p>Or <strong>{percentageAroundEarth}%</strong> of the way around the globe.</p>
        </section>
      )}

      {!user && (
        <div style={{ marginTop: '2rem' }}>
          <Link to="/signup">
            <button>How Far have I traveled?</button>
          </Link>
          <Link to="/login" style={{ marginLeft: '1rem' }}>
            <button>Login</button>
          </Link>
        </div>
      )}
    </main>
  );}

