import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as userService from '../../services/userService';
import * as journeyService from '../../services/journeyService';
import * as stepService from '../../services/stepService';

export default function CommunityPage() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchUsersWithMiles() {
      try {
        const usersData = await userService.getRecentUsers();

        const usersWithMiles = await Promise.all(
          usersData.map(async (user) => {
            const journeys = await journeyService.getJourneysByUserId(user._id);
            const steps = await stepService.getSteps(user._id);

            const totalJourneyMiles = journeys.reduce((sum, j) => sum + (j.distance_mi || 0), 0);
            const totalSteps = steps.reduce((sum, s) => sum + (s.steps || 0), 0);
            const stepMiles = (totalSteps * 2.5) / 5280;

            return {
              ...user,
              totalMilesTraveled: totalJourneyMiles + stepMiles,
            };
          })
        );

        setUsers(usersWithMiles);
      } catch (err) {
        console.error('Error fetching users or their data:', err);
      }
    }

    fetchUsersWithMiles();
  }, []);

 return (
  <div style={{ padding: '20px' }}>
    <h1>Community</h1>
    <h2>Discover Global Travelers</h2>
    <section className="communityUsers-section">
      <div className="community-grid">
        {users.map((user) => (
          <div
            key={user._id}
            style={{
              cursor: 'pointer',
              color: 'blue',
              border: '1px solid #ccc',
              padding: '1rem',
              borderRadius: '8px',
              backgroundColor: 'rgba(255, 255, 255, 0.6)',
              backdropFilter: 'blur(5px)',
            }}
            onClick={() => navigate(`/users/${user._id}/journeys`)}
          >
            <strong>{user.name}</strong>
            <br />
            {(user.totalMilesTraveled ?? 0).toFixed(2)} miles traveled
          </div>
        ))}
      </div>
    </section>
  </div>
);}
