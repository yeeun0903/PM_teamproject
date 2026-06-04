import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import ReactGA from 'react-ga4';
import MainHome from './pages/MainHome';
import SpangHome from './pages/SpangHome';
import Detail from './pages/Detail';
// import Player from './pages/Player';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import PassDetail from './pages/PassDetail';
import './App.css';

function PageViewTracker() {
  const location = useLocation();
  useEffect(() => {
    ReactGA.send({ hitType: 'pageview', page: location.pathname + location.search });
  }, [location]);
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <PageViewTracker />
      <Routes>
        <Route path="/" element={<MainHome />} />
        <Route path="/spang" element={<SpangHome />} />
        <Route path="/detail/:id" element={<Detail />} />
        {/* <Route path="/player/:id" element={<Player />} /> */}
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/pass-detail" element={<PassDetail />} />
      </Routes>
    </BrowserRouter>
  );
}
