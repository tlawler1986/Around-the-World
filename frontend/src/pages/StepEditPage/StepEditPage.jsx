import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import * as stepService from '../../services/stepService';

export default function StepDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [step, setStep] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    steps: '',
    date: '',
    location: '',
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(null);

   useEffect(() => {
    async function fetchStep() {
      try {
        const data = await stepService.getById(id);
        setStep(data);
        setFormData({
          title: data.title || '',
          location: data.location || '',
          steps: data.steps || '',
          date: data.date ? new Date(data.date).toISOString().slice(0, 10) : '',
        });
        setLoading(false);
      } catch {
        setError('Failed to load step');
        setLoading(false);
      }
    }
    fetchStep();
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
      const updatedStep = {
        ...formData,
        date: formData.date ? new Date(formData.date).toISOString() : null,
      };
      await stepService.update(id, updatedStep);
      setSuccess('Step updated successfully!');
      setSaving(false);
      navigate('/journeys');
    } catch {
      setError('Failed to update step');
      setSaving(false);
    }
  }

  async function handleDelete() {
    try {
      await stepService.remove(id);
      navigate('/journeys');
    } catch {
      setError('Failed to delete step');
    }
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <>
      <h1>Edit Step</h1>
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
          Location:<br />
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
          />
        </label>
      <br />
        <label>
          Steps:<br />
          <textarea
            name="steps"
            value={formData.steps}
            onChange={handleChange}
            required
            rows={4}
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
        🗑️ Delete Step
      </button>

      {success && <p style={{ color: 'green' }}>{success}</p>}
    </>
  );}


