import { useState } from 'react';
import { Routes, Route } from 'react-router';
import { getUser } from '../../services/authService';
import HomePage from '../HomePage/HomePage';
import JourneyListPage from '../JourneyListPage/JourneyListPage';
import NewJourneyPage from '../NewJourneyPage/NewJourneyPage';
import NewStepPage from '../NewStepPage/NewStepPage';
import JourneyDetailPage from '../JourneyDetailPage/JourneyDetailPage';
import StepDetailPage from '../StepDetailPage/StepDetailPage';
import SignUpPage from '../SignUpPage/SignUpPage';
import LogInPage from '../LogInPage/LogInPage';
import NavBar from '../../components/NavBar/NavBar';
import './App.css';

export default function App() {
  const [user, setUser] = useState(getUser());

function handleLogOut() {
  authService.logOut(); 
  setUser(null); 
  }

  return (
    <main className="App">
      <NavBar user={user} setUser={setUser} />
      <section id="main-section">
        {user ? (
          <Routes>
            <Route path="/" element={<HomePage user={user} handleLogOut={handleLogOut} />} />
            <Route path="/journeys" element={<JourneyListPage userId={user?._id} />} />
            <Route path="/journeys/new" element={<NewJourneyPage userId={user?.id}/>} />
            <Route path="/steps/new" element={<NewStepPage userId={user?.id} />} />
            <Route path="/journeys/:id" element={<JourneyDetailPage />} />
            <Route path="/steps/:id" element={<StepDetailPage />} />
            <Route path="*" element={null} />
          </Routes>
        ) : (
          <Routes>
            <Route path="/" element={<HomePage user={user} handleLogOut={handleLogOut} />} />
            <Route path="/signup" element={<SignUpPage setUser={setUser} />} />
            <Route path="/login" element={<LogInPage setUser={setUser} />} />
            <Route path="*" element={null} />
          </Routes>
        )}
      </section>
    </main>
  );
}

