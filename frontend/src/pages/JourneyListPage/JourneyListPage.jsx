import { useState, useEffect } from 'react';
import * as journeyService from '../../services/journeyService';
import * as stepService from '../../services/stepService';
import { useNavigate } from 'react-router-dom';


export default function JourneyListPage({ userId }) {
  const navigate = useNavigate();
  const [journeys, setJourneys] = useState([]);
  const [steps, setSteps] = useState([]);
  const [journeysError, setJourneysError] = useState(null);
  const [stepsError, setStepsError] = useState(null);
  const [loading, setLoading] = useState(false);

  function handleAddJourney() {
    navigate('/journeys/new');}

  function handleAddStep() {
    navigate('/steps/new');}

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const journeysData = await journeyService.index();
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
    return <div>Loading...</div>;
  }
  
  return (
    <>
      <h1>Journey List</h1>
      <h2>Journeys</h2>
      {journeysError && (
        <div style={{ color: 'red', marginBottom: '10px' }}>
          Error: {journeysError}
        </div>
      )}
      <table border="1" cellPadding="5" style={{ marginBottom: '20px' }}>
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
          <td>{journey.title || 'N/A'}</td>
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
    <button onClick={handleAddJourney} style={{ marginTop: '10px' }}>
        ➕ Add Journey
    </button>

<h2>Steps</h2>
{stepsError && (
  <div style={{ color: 'red', marginBottom: '10px' }}>
    Error: {stepsError}
  </div>
)}
<table border="1" cellPadding="5">
  <thead>
    <tr>
      <th>Title</th>
      <th>Steps</th>
      <th>Date</th>
    </tr>
  </thead>
  <tbody>
    {steps.length > 0 ? (
      steps.map(step => (
        <tr key={step._id}>
          <td>{step.title || 'N/A'}</td>
          <td>{step.steps || 'N/A'}</td>
          <td>{step.date ? new Date(step.date).toLocaleDateString() : 'N/A'}</td>
        </tr>
      ))
    ) : (
      <tr>
        <td colSpan="3" style={{ textAlign: 'center', fontStyle: 'italic' }}>
          {stepsError ? 'Unable to load steps' : 'No steps found.'}
        </td>
      </tr>
    )}
  </tbody>
</table>
    <button onClick={handleAddStep} style={{ marginTop: '10px' }}>
        ➕ Add Step
    </button>
   </>
  );}
