import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import * as journeyService from '../../services/journeyService';
import * as stepService from '../../services/stepService';

export default function JourneyListPage({ userId }) {
  const [journeys, setJourneys] = useState([]);
  const [steps, setSteps] = useState([]);
  const navigate = useNavigate();
  const [journeysError, setJourneysError] = useState(null);
  const [stepsError, setStepsError] = useState(null);
  const [loading, setLoading] = useState(false);

  function handleAddJourney() {
    navigate('/journeys/new');
  }

  function handleAddStep() {
    navigate('/steps/new');
  }

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const journeysData = await journeyService.getJourneysByUserId(userId);
        setJourneys(journeysData || []);
        setJourneysError(null);
      } catch (error) {
        setJourneysError('API endpoint not found - using mock data');
        setJourneys([]);
      }
      try {
        const stepsData = await stepService.getSteps(userId);
        setSteps(stepsData || []);
        setStepsError(null);
      } catch (error) {
        setStepsError('API endpoint not found - using mock data');
        setSteps([]);
      }
      setLoading(false);
    }
    fetchData();
  }, [userId]);

  if (loading) {
    return 
  }

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        alignItems: 'center',
        justifyContent: 'flex-start'
      }}
    >
  <section className="compute-button-section">
    <div className="compute-button-wrapper">
      <button className="compute-button-icon" onClick={() => navigate('/total')}>
        <span className="globe">🌍</span>
      </button>
        <span className="compute-button-label">Compute My Results</span>
    </div>
  </section>

      <div style={{ flexGrow: 1, padding: '0 40px', marginTop: '0', marginBottom: '100px' }}>
        <h2>Journeys</h2>
        {journeysError && (
          <div style={{ color: 'red', marginBottom: '10px' }}>
            Error: {journeysError}
          </div>
        )}
  <section className="journeyList-section">
    <div className="table-wrapper">
      <table className="journey-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Start Location</th>
            <th>End Location</th>
            <th>Distance (mi)</th>
            <th>Date</th>
            <th>Mode of Transportation</th>
          </tr>
        </thead>
        <tbody>
          {journeys.length > 0 ? (
            journeys.map(journey => (
              <tr key={journey._id}>
                <td><Link to={`/journeys/${journey._id}/detail`}>{journey.title || 'N/A'}</Link></td>
                <td>{journey.start_location_id || 'N/A'}</td>
                <td>{journey.end_location_id || 'N/A'}</td>
                <td>{journey.distance_mi || 'N/A'}</td>
                <td>{journey.date ? new Date(journey.date).toLocaleDateString() : 'N/A'}</td>
                <td>{journey['mode of transportation'] || 'N/A'}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="table-empty">
                {journeysError ? 'Unable to load journeys' : 'No journeys found.'}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
 </section>

<div className="button-center">
  <button onClick={handleAddJourney}>➕ Add Journey</button>
</div>

<h2>Steps</h2>
{stepsError && (
  <div className="error-message">Error: {stepsError}</div>
)}

<section className="journeyList-section">
  <div className="table-center">
    <table className="journey-table">
      <thead>
        <tr>
          <th>Title</th>
          <th>Location</th>
          <th>Steps</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        {steps.length > 0 ? (
          steps.map(step => (
            <tr key={step._id}>
              <td><Link to={`/steps/${step._id}/detail`}>{step.title || 'N/A'}</Link></td>
              <td>{step.location || 'N/A'}</td>
              <td>{step.steps || 'N/A'}</td>
              <td>{step.date ? new Date(step.date).toLocaleDateString() : 'N/A'}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="4" className="table-empty">
              {stepsError ? 'Unable to load steps' : 'No steps found.'}
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
</section>
        
         <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
          <button onClick={handleAddStep}>➕ Add Step</button>
        </div>
      </div>
    </div>
  );}