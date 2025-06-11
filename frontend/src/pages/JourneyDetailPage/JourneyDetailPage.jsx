import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as journeyService from '../../services/journeyService';

export default function JourneyDetailPage() {
  const { id } = useParams();
  const [journey, setJourney] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const [newCommentText, setNewCommentText] = useState('');
  const [newCommentUsername, setNewCommentUsername] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();

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

  // Mock API call to add a comment, replace with your real service method
  async function addComment(journeyId, username, text) {
    // This simulates backend adding a comment and returning the updated journey or new comment
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          _id: Date.now().toString(), // mock comment id
          username,
          text,
        });
      }, 500);
    });
  }

  async function handleAddComment(e) {
    e.preventDefault();
    if (!newCommentText.trim() || !newCommentUsername.trim()) return;

    setSubmitting(true);
    try {
      const newComment = await addComment(journey._id, newCommentUsername.trim(), newCommentText.trim());

      // Add new comment to local state journey.comments
      setJourney(prev => ({
        ...prev,
        comments: [...(prev.comments || []), newComment],
      }));

      setNewCommentText('');
      // Optionally clear username or keep it
    } catch (err) {
      alert('Failed to add comment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <p>Loading journey details...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!journey) return null;

  return (
    <div style={{ padding: '20px', maxWidth: '700px', margin: 'auto' }}>
      <h1>{journey.title || 'N/A'}</h1>
      
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
          {journey.description && (
            <tr>
              <th style={{ textAlign: 'left' }}>Description</th>
              <td>{journey.description}</td>
            </tr>
          )}
          <tr>
            <th style={{ textAlign: 'left', verticalAlign: 'top' }}>Comments</th>
            <td>
              {journey.comments && journey.comments.length > 0 ? (
                <ul style={{ marginTop: 0, paddingLeft: '20px' }}>
                  {journey.comments.map(comment => (
                    <li key={comment._id || comment.id}>
                      <strong>{comment.username || 'Anonymous'}:</strong> {comment.text || comment.content || 'No comment text.'}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No comments available.</p>
              )}

              <form onSubmit={handleAddComment} style={{ marginTop: '15px' }}>
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
                <button type="submit" disabled={submitting}>
                  {submitting ? 'Submitting...' : 'Add Comment'}
                </button>
              </form>
            </td>
          </tr>
        </tbody>
      </table>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
        <button onClick={handleEditJourney}>✏️ Edit Journey</button>
        <button onClick={handleBackToJourneys}>⬅️ Back to Journeys</button>
      </div>
    </div>
  );
}
