import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router';
import { getUser } from '../../services/authService';
import * as badgeService from '../../services/badgeService';
import HomePage from '../HomePage/HomePage';
import JourneyListPage from '../JourneyListPage/JourneyListPage';
import NewJourneyPage from '../NewJourneyPage/NewJourneyPage';
import NewStepPage from '../NewStepPage/NewStepPage';
import JourneyDetailPage from '../JourneyDetailPage/JourneyDetailPage';
import StepDetailPage from '../StepDetailPage/StepDetailPage';
import TotalJourneyPage from '../TotalJourneyPage/TotalJourneyPage';
import SignUpPage from '../SignUpPage/SignUpPage';
import LogInPage from '../LogInPage/LogInPage';
import NavBar from '../../components/NavBar/NavBar';
import './App.css';

export default function App() {
  const [user, setUser] = useState(getUser());
  const [latestBadge, setLatestBadge] = useState(null);


  useEffect(() => {
    async function fetchLatestBadge() {
      if (!user) {
        setLatestBadge(null);
        return;
      }
      try {
        const badgeData = await badgeService.getBadges();
        const badges = badgeData.badges || [];
        if (badges.length > 0) {
          const latest = badges.reduce((latest, badge) =>
            new Date(badge.earnedAt) > new Date(latest.earnedAt) ? badge : latest,
            badges[0]
          );
          setLatestBadge(latest);
        } else {
          setLatestBadge(null);
        }
      } catch (err) {
        console.error('Failed to fetch badges:', err);
        setLatestBadge(null);
      }
    }
    fetchLatestBadge();
  }, [user]);

function handleLogOut() {
  authService.logOut(); 
  setUser(null); 
  }

  return (
    <main className="App">
      <NavBar user={user} setUser={setUser} latestBadge={latestBadge} />
      <section id="main-section">
        {user ? (
          <Routes>
            <Route path="/" element={<HomePage user={user} handleLogOut={handleLogOut} />} />
            <Route path="/journeys" element={<JourneyListPage userId={user?._id} />} />
            <Route path="/journeys/new" element={<NewJourneyPage userId={user?.id}/>} />
            <Route path="/steps/new" element={<NewStepPage userId={user?.id} />} />
            <Route path="/journeys/:id" element={<JourneyDetailPage />} />
            <Route path="/steps/:id" element={<StepDetailPage />} />
            <Route path="/total" element={<TotalJourneyPage userId={user?.id} />} />
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

