import { useState } from 'react';
import { useNavigate } from 'react-router';
import * as stepService from '../../services/stepService';

export default function NewStepPage({ userId }) {
  const [title, setTitle] = useState('');
  const [stepCount, setStepCount] = useState('');
  const [date, setDate] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const navigate = useNavigate();

  async function handleSubmit(evt) {
    evt.preventDefault();
    try {
      const payload = {
        user_id: userId,
        title,
        steps: Number(stepCount),
        date,
      };
      await stepService.create(payload);
      navigate('/journeys');
    } catch (err) {
      setErrorMsg('Adding Steps Failed');
    }
  }

  return (
    <>
      <h2>Add Steps</h2>
      <form onSubmit={handleSubmit}>

        <label>Title</label>
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />

        <label>Number of Steps</label>
        <input
          type="number"
          value={stepCount}
          onChange={e => setStepCount(e.target.value)}
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

        <button type="submit">Add Steps</button>
      </form>
      {errorMsg && <p className="error-message">{errorMsg}</p>}
    </>
  );
}
