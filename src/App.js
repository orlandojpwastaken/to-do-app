import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import SignUp from './pages/SignUp';
import Login from './pages/Login';

function App() {
  return (
    <Router>
      <Routes>
        {/* Route to Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Route to SignUp */}
        <Route path="/signup" element={<SignUp />} />

        {/* Route to Login */}
        <Route path="/login" element={<Login />} />

        {/* Default route to SignUp */}
        <Route path="/" element={<SignUp />} />
      </Routes>
    </Router>
  );
}

export default App;
