import { useParams, useNavigate, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import * as journeyService from '../../services/journeyService';
import * as userService from '../../services/userService';

export default function UserJourneysPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [journeys, setJourneys] = useState([]);
  const [owner, setOwner] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const userData = await userService.getUserById(id);
        setOwner(userData);

        const journeyData = await journeyService.getJourneysByUserId(id);
        setJourneys(journeyData);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    }
    fetchData();
  }, [id]);

  return (
    <div>
      <h2>{owner ? `${owner.name}'s Journeys` : 'User Journeys'}</h2>

      {journeys.length === 0 ? (
        <p>No journeys found</p>
      ) : (
        <>
          <section className="userjourney-section">
            <div style={{ overflowX: 'auto', maxWidth: '100%' }}>
              <table
                border="1"
                cellPadding="5"
                style={{ marginBottom: '20px', borderTop: 'none', minWidth: '600px' }}
              >
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Start Location</th>
                    <th>End Location</th>
                    <th>Date</th>
                    <th>Distance (mi)</th>
                    <th>Mode</th>
                  </tr>
                </thead>
                <tbody>
                  {journeys.map(j => (
                    <tr key={j._id}>
                      <td>
                        <Link to={`/journeys/${j._id}/detail`}
                        state={{ readOnly: true}}
                        >
                          {j.title}
                        </Link>
                      </td>
                      <td>{j.start_location_id || 'N/A'}</td>
                      <td>{j.end_location_id || 'N/A'}</td>
                      <td>{j.date ? new Date(j.date).toLocaleDateString() : 'N/A'}</td>
                      <td>{j.distance_mi ?? 'N/A'}</td>
                      <td>{j.modeOfTransportation || j['mode of transportation'] || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <div style={{ textAlign: 'center', marginTop: '10px' }}>
            <button onClick={() => navigate('/community')}>
              Back to Community
            </button>
          </div>
        </>
      )}
    </div>
  );}

