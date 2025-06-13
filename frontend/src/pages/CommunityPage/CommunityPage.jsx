import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as userService from '../../services/userService';

export default function CommunityPage() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchUsers() {
      try {
        const data = await userService.getRecentUsers();
        setUsers(data);
      } catch (err) {
        console.error('Error fetching users:', err);
      }
    }
    fetchUsers();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Community</h1>
      <h2>Where have other Users Journeyed to??</h2>
      <section className="communityUsers-section">
        <ul>
          {users.map(user => (
            <li
              key={user._id}
              style={{ cursor: 'pointer', color: 'blue' }}
              onClick={() => navigate(`/users/${user._id}/journeys`)}
            >
              {user.name}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
