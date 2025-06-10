import { useState } from 'react';
import { useNavigate } from 'react-router';
import * as journeyService from '../../services/journeyService';

export default function NewJourneyPage({ userId }) {
  const [title, setTitle] = useState('');
  const [startLocation, setStartLocation] = useState('');
  const [endLocation, setEndLocation] = useState('');
  const [distance, setDistance] = useState('');
  const [date, setDate] = useState('');
  const [mode, setMode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const navigate = useNavigate();

  async function handleSubmit(evt) {
    evt.preventDefault();
    try {
      const payload = {
        title,
        user_id: userId,
        start_location_id: startLocation,
        end_location_id: endLocation,
        distance_mi: Number(distance),
        date,
        "mode of transportation": mode,
      };
      await journeyService.create(payload);
      navigate('/posts'); 
    } catch (err) {
      setErrorMsg('Adding Journey Failed');
    }
  }

  return (
    <>
      <h2>Add Journey</h2>
      <form onSubmit={handleSubmit}>

        <label>Title</label>
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />

        <label>Start Location ID</label>
        <input
          type="text"
          value={startLocation}
          onChange={e => setStartLocation(e.target.value)}
          placeholder="Enter start location ObjectId"
          required
        />

        <label>End Location ID</label>
        <input
          type="text"
          value={endLocation}
          onChange={e => setEndLocation(e.target.value)}
          placeholder="Enter end location ObjectId"
          required
        />

        <label>Distance (miles)</label>
        <input
          type="number"
          value={distance}
          onChange={e => setDistance(e.target.value)}
          step="0.01"
          min="0"
          required
        />

        <label>Date</label>
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          required
        />

        <label>Mode of Transportation</label>
        <select
          value={mode}
          onChange={e => setMode(e.target.value)}
          required
        >
          <option value="">-- Select Mode --</option>
          <option value="automobile">Automobile</option>
          <option value="bike">Bike</option>
          <option value="walk">Walk</option>
          <option value="train">Train</option>
          <option value="plane">Plane</option>
          <option value="boat">Boat</option>
        </select>

        <button type="submit">Add Journey</button>
      </form>
      {errorMsg && <p className="error-message">{errorMsg}</p>}
    </>
  );
}
