import { NavLink, Link, useNavigate } from 'react-router';
import * as authService from '../../services/authService';
import { useState } from 'react';

export default function HomePage({ user, handleLogOut }) {

  return (
    <main style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Around the World</h1>

      <p>
        Are you an avid traveler, or someone that just keeps track of their daily steps?
        Well, this is a fun little app that takes those distances and computes how many times
        you have traveled around the globe.
      </p>
      <p>
        After creating an account, you will be able to see your contribution to the total number
        of distances traveled by all users on this site.
      </p>

      <div style={{ marginTop: '2rem' }}>
        {user ? (
          <span>Welcome <strong>{user.name || user.email}!</strong></span>
      ) : (
        <>
        <Link to="/signup">
          <button>How Far have I traveled?</button>
        </Link>
        <Link to="/login" style={{ marginLeft: '1rem' }}>
          <button>Login</button>
        </Link>
      </>
    )}
      </div>
    </main>
  );}
