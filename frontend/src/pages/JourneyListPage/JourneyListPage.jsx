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
  <div style={{ display: 'flex', justifyContent: 'flex-start', paddingLeft: 0 }}>
    <button
      onClick={() => navigate('/total')}
      style={{
      width: '300px',     
      height: '300px',
      borderRadius: '50%',  
      backgroundColor: '#4CAF50',
      color: 'white',
      fontSize: '25px',
      border: 'none',
      cursor: 'pointer',
      display: 'flex',      
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      padding: 0,
    }}>Compute My Results!</button>
    </div>

      <div style={{ flexGrow: 1, padding: '0 40px', marginTop: '0', marginBottom: '100px' }}>
        <h2>Journeys</h2>
        {journeysError && (
          <div style={{ color: 'red', marginBottom: '10px' }}>
            Error: {journeysError}
          </div>
        )}
       <div style={{ overflowX: 'auto', maxWidth: '100%' }}>
          <table border="1" cellPadding="5" style={{ marginBottom: '20px', borderTop: 'none', minWidth: '600px' }}>
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
                  <td>
                    <Link to={`/journeys/${journey._id}/detail`}>
                      {journey.title || 'N/A'}
                    </Link>
                  </td>
                  <td>{journey.start_location_id || 'N/A'}</td>
                  <td>{journey.end_location_id || 'N/A'}</td>
                  <td>{journey.distance_mi || 'N/A'}</td>
                  <td>{journey.date ? new Date(journey.date).toLocaleDateString() : 'N/A'}</td>
                  <td>{journey['mode of transportation'] || 'N/A'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', fontStyle: 'italic' }}>
                  {journeysError ? 'Unable to load journeys' : 'No journeys found.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
          <button onClick={handleAddJourney}>➕ Add Journey</button>
        </div>

        <h2>Steps</h2>
        {stepsError && (
          <div style={{ color: 'red', marginBottom: '10px', display: 'flex', justifyContent: 'center' }}>
            Error: {stepsError}
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <table border="1" cellPadding="5">
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
                  <td>
                    <Link to={`/steps/${step._id}/detail`}>
                      {step.title || 'N/A'}
                    </Link>
                  </td>
                  <td>{step.location || 'N/A'}</td>
                  <td>{step.steps || 'N/A'}</td>
                  <td>{step.date ? new Date(step.date).toLocaleDateString() : 'N/A'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', fontStyle: 'italic' }}>
                  {stepsError ? 'Unable to load steps' : 'No steps found.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
        </div>
       
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
          <button onClick={handleAddStep}>➕ Add Step</button>
        </div>
      </div>
    </div>
  );}

