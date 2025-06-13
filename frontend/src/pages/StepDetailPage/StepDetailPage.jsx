import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as stepService from '../../services/stepService';

export default function StepDetailPage({ loggedInUsername }) {
  const { id } = useParams();
  const [step, setStep] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newCommentText, setNewCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    async function fetchStep() {
      try {
        const data = await stepService.getById(id);
        setStep(data);
        setError(null);
      } catch (err) {
        setError('Step not found or API error');
        setStep(null);
      } finally {
        setLoading(false);
      }
    }
    fetchStep();
  }, [id]);

  function handleEditStep() {
    if (!step?._id) return;
    navigate(`/steps/${step._id}`);
  }

  function handleBackToSteps() {
    navigate('/journeys');
  }

  if (loading) return <p>Loading step details...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!step) return null;

  return (
    <div style={{ padding: '20px', maxWidth: '700px', margin: 'auto' }}>
      <h1>{step.title || 'N/A'}</h1>
      <section className='stepDetail-section'>
        <table border="1" cellPadding="8" style={{ width: '100%', marginBottom: '20px' }}>
          <tbody>
            <tr>
              <th style={{ textAlign: 'left' }}>Steps</th>
              <td>{step.steps || 'N/A'}</td>
            </tr>
            <tr>
              <th style={{ textAlign: 'left' }}>Date</th>
              <td>{step.date ? new Date(step.date).toLocaleDateString() : 'N/A'}</td>
            </tr>
            <tr>
              <th style={{ textAlign: 'left' }}>Location</th>
              <td>{step.location || 'N/A'}</td>
            </tr>
          </tbody>
        </table>
      </section>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '15px' }}>
        <button onClick={handleEditStep}>✏️ Edit Step</button>
        <button onClick={handleBackToSteps}>⬅️ Back to Steps</button>
      </div>
    </div>
  );}

