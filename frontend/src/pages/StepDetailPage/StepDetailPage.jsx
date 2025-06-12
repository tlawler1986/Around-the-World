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

  async function handleAddComment(e) {
    e.preventDefault();
    if (!newCommentText.trim()) return;
    setSubmitting(true);

    try {
      const newComment = await stepService.addCommentToStep(id, {
        username: loggedInUsername,
        text: newCommentText.trim(),
      });

      setStep(prev => ({
        ...prev,
        comments: [...(prev.comments || []), newComment],
      }));
      setNewCommentText('');
    } catch {
      alert('Failed to add comment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

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
          <tr>
            <th style={{ textAlign: 'left', verticalAlign: 'top' }}>Comments</th>
            <td>
              {step.comments && step.comments.length > 0 ? (
                <ul style={{ marginTop: 0, paddingLeft: '20px' }}>
                  {step.comments.map(comment => (
                    <li key={comment._id || comment.id}>
                      <strong>{comment.username || 'Anonymous'}:</strong> {comment.text || comment.content || 'No comment text.'}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No comments available.</p>
              )}

              <form onSubmit={handleAddComment} style={{ marginTop: '15px' }}>
                <textarea
                  value={newCommentText}
                  onChange={e => setNewCommentText(e.target.value)}
                  rows={3}
                  cols={50}
                  placeholder="Add a comment..."
                  required
                  disabled={submitting}
                  style={{ resize: 'vertical' }}
                />
                <br />
                <button type="submit" disabled={submitting} style={{ marginTop: '8px' }}>
                  {submitting ? 'Submitting...' : 'Add Comment'}
                </button>
              </form>
            </td>
          </tr>
        </tbody>
      </table>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
        <button onClick={handleEditStep}>✏️ Edit Step</button>
        <button onClick={handleBackToSteps}>⬅️ Back to Steps</button>
      </div>
    </div>
  );}

