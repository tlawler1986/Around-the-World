import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import * as journeyService from '../../services/journeyService';
import * as userService from '../../services/userService';
import { getUser } from '../../services/authService';

export default function JourneyDetailPage() {
  const { id } = useParams();
  const location = useLocation();
  const readOnly = location.state?.readOnly || false; 
  const [journey, setJourney] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const currentUser = getUser();

  const [newCommentText, setNewCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    async function loadUser() {
      try {
        const me = await userService.getCurrentUser();
        setCurrentUser(me);
      } catch {
      }
    }
    loadUser();
  }, []);

  useEffect(() => {
    async function fetchJourney() {
      try {
        const data = await journeyService.getJourneyById(id);
        setJourney(data);
        setError(null);
      } catch (err) {
        setError('Journey not found or API error');
        setJourney(null);
      } finally {
        setLoading(false);
      }
    }
    fetchJourney();
  }, [id]);

  function handleEditJourney() {
    if (!journey?._id) return;
    navigate(`/journeys/${journey._id}`);
  }

  function handleBackToJourneys() {
    navigate('/journeys');
  }

async function handleAddComment(e) {
  e.preventDefault();
  if (!newCommentText.trim()) return;
  setSubmitting(true);
  try {
    const newComment = await journeyService.addComment(journey._id, {
      text: newCommentText.trim()
    });
    setJourney(prev => ({
      ...prev,
      comments: [...(prev.comments || []), newComment],
    }));
    setNewCommentText('');
  } catch (err) {
    alert('Failed to add comment. Please try again.');
  } finally {
    setSubmitting(false);
  }
}

function handleDeleteComment(commentId) {
  if (!window.confirm('Are you sure you want to delete this comment?')) return;
  journeyService.deleteComment(journey._id, commentId)
    .then(() => {
      setJourney(prev => ({
        ...prev,
        comments: prev.comments.filter(c => c._id !== commentId && c.id !== commentId),
      }));
    })
    .catch(() => {
      alert('Failed to delete comment. Please try again.');
    });
}

  if (loading) return <p>Loading journey details...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!journey) return null;

  return (
    <div style={{ padding: '20px', maxWidth: '700px', margin: 'auto' }}>
      <h1>{journey.title || 'N/A'}</h1>
      <section className="journeyDetail-section">
        <table border="1" cellPadding="8" style={{ width: '100%', marginBottom: '20px' }}>
          <tbody>
            <tr>
              <th style={{ textAlign: 'left' }}>Start Location</th>
              <td>{journey.startLocation || journey.start_location_id || 'N/A'}</td>
            </tr>
            <tr>
              <th style={{ textAlign: 'left' }}>End Location</th>
              <td>{journey.endLocation || journey.end_location_id || 'N/A'}</td>
            </tr>
            <tr>
              <th style={{ textAlign: 'left' }}>Distance (mi)</th>
              <td>{journey.distanceMi || journey.distance_mi || 'N/A'}</td>
            </tr>
            <tr>
              <th style={{ textAlign: 'left' }}>Date</th>
              <td>{journey.date ? new Date(journey.date).toLocaleDateString() : 'N/A'}</td>
            </tr>
            <tr>
              <th style={{ textAlign: 'left' }}>Mode of Transportation</th>
              <td>{journey.modeOfTransportation || journey['mode of transportation'] || 'N/A'}</td>
            </tr>
          
          <tr>
          <th style={{ textAlign: 'left', verticalAlign: 'top' }}>Comments</th>
          <td>
            {journey.comments && journey.comments.length > 0 ? (
              <ul style={{ marginTop: 0, paddingLeft: '20px' }}>
                {journey.comments.map((comment, idx) => (
                  <li key={comment._id || idx}>
                    <strong>{comment.name || 'Anonymous'}:</strong> {comment.text || comment.content || 'No comment text.'}
                    {journey.user_id?._id?.toString() === currentUser?._id && (
                      <button
                        style={{ marginLeft: '10px', color: 'red' }}
                        onClick={() => handleDeleteComment(comment._id || comment.id)}
                      > Delete </button>)}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No comments available.</p>
                )}

              <form id='comment-form' onSubmit={handleAddComment} style={{ marginTop: '15px' }}>
                <div style={{ marginBottom: '8px' }}>
                  <label>
                    Add Comment:{' '}
                    <textarea
                      value={newCommentText}
                      onChange={e => setNewCommentText(e.target.value)}
                      rows={3}
                      cols={40}
                      required
                      disabled={submitting}
                    />
                  </label>
                </div>
              </form>
              <div style={{ textAlign: 'center', marginTop: '8px' }}>
                <button type="submit" form="comment-form" disabled={submitting}>
                  {submitting ? 'Submitting...' : 'Add Comment'}
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </section>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '15px' }}>
        {!readOnly && (
          <>
          <button onClick={handleEditJourney}>✏️ Edit Journey</button>
          <button onClick={handleBackToJourneys}>⬅️ Back to Journeys</button>
          </>
        )}
      </div>
    </div>
  );}

