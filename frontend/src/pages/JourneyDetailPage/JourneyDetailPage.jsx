import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import * as journeyService from '../../services/journeyService';

export default function JourneyDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [journey, setJourney] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    start_location_id: '',
    end_location_id: '',
    date: '',
    distance_mi: '',
    mode_of_transportation: '',
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    async function fetchJourney() {
      try {
        const data = await journeyService.getJourneyById(id);
        setJourney(data);

        // Initialize form data with journey values
        setFormData({
          title: data.title || '',
          start_location_id: data.start_location_id || '',
          end_location_id: data.end_location_id || '',
          date: data.date ? new Date(data.date).toISOString().slice(0, 10) : '',
          distance_mi: data.distance_mi || '',
          mode_of_transportation: data['mode of transportation'] || '',
        });

        setLoading(false);
      } catch (err) {
        setError('Failed to load journey');
        setLoading(false);
      }
    }
    fetchJourney();
  }, [id]);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      // Prepare data to send
      const updatedJourney = {
        ...formData,
        // convert date string to ISO format if needed
        date: formData.date ? new Date(formData.date).toISOString() : null,
        // Adjust property name for mode_of_transportation
        'mode of transportation': formData.mode_of_transportation,
      };
      delete updatedJourney.mode_of_transportation; // remove camelCase duplicate
      
      await journeyService.update(id, updatedJourney);
      setSuccess('Journey updated successfully!');
      setSaving(false);
      navigate('/journeys'); // redirect back to journey list or keep here based on preference
    } catch {
      setError('Failed to update journey');
      setSaving(false);
    }
  }

  async function handleDelete() {
    try {
      await journeyService.remove(id);
      navigate('/posts');
    } catch {
      setError('Failed to delete journey');
    }
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <>
      <h1>Edit Journey</h1>
      <form onSubmit={handleSubmit} style={{ maxWidth: '400px' }}>
        <label>
          Title:<br />
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          Start Location:<br />
          <input
            type="text"
            name="start_location_id"
            value={formData.start_location_id}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          End Location:<br />
          <input
            type="text"
            name="end_location_id"
            value={formData.end_location_id}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          Date:<br />
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          Distance (mi):<br />
          <input
            type="number"
            name="distance_mi"
            value={formData.distance_mi}
            onChange={handleChange}
            step="0.01"
            min="0"
            required
          />
        </label>
        <br />
        <label>
          Mode of Transportation:<br />
          <input
            type="text"
            name="mode_of_transportation"
            value={formData.mode_of_transportation}
            onChange={handleChange}
            required
          />
        </label>
        <br /><br />
        <button type="submit" disabled={saving}>
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>

      <button
        onClick={handleDelete}
        style={{ color: 'red', marginTop: '20px' }}
        disabled={saving}
      >
        🗑️ Delete Journey
      </button>

      {success && <p style={{ color: 'green' }}>{success}</p>}
    </>
  );
}
