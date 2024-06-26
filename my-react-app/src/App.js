import React from 'react';
// Routes used in v6, not Switch
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// css stylesheet
import './App.css';
import NavBar from './components/NavBar';
import Home from './components/Home';
import Login from './components/Login';
import SignUp from './components/SignUp';

function App() {
  return (
    <Router>
      <div className="App">
        {/* adding in the nav bar */}
        <NavBar />
        {/* adding routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;