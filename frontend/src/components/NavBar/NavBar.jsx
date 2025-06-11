import { NavLink, Link, useNavigate } from 'react-router';
import { logOut } from '../../services/authService';
import './NavBar.css';

export default function NavBar({ user, setUser }) {
  const navigate = useNavigate();

  function handleLogOut() {
    logOut();
    setUser(null);
    // The <Link> that was clicked will navigate to "/"
  }

   return (
    <nav className="NavBar">
      <NavLink to="/">Home</NavLink>
      &nbsp; | &nbsp;
      {user ? (
        <>
          <NavLink to="/journeys" end>
            Journeys
          </NavLink>
          &nbsp; | &nbsp;
          <NavLink to="/journeys/new">New Journey</NavLink>
          &nbsp; | &nbsp;
          <NavLink to="/steps/new">Add Steps</NavLink>
          &nbsp; | &nbsp;
          <Link to="/" onClick={handleLogOut}>Log Out</Link>
          &nbsp; | &nbsp;
          <span>
            Welcome,{' '}
            <Link to="/total" style={{ textDecoration: 'underline', color: 'blue' }}>
              {user.name}
            </Link>
          </span>
        </>
      ) : (
        <>
          <NavLink to="/login">Log In</NavLink>
          &nbsp; | &nbsp;
          <NavLink to="/signup">Sign Up</NavLink>
        </>
      )}
    </nav>
  );}
