import React, { useEffect } from 'react';
// Routes used in v6, not Switch
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// css stylesheet
import './App.css';
import NavBar from './components/NavBar';
import Home from './components/Home';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Chatbot from './components/Chatbot';
import Appointment from './components/Appointment';
import Account from './components/Account';
import AddStaff from './components/AddStaff';
import NotFound from './components/NotFound';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <div className="App">
        {/* adding in the nav bar */}
        <NavBar />
        {/* adding routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/chatbot" element={<Chatbot />} />
          <Route path="/appointment" element={<Appointment />} />
          <Route path="/account" element={<Account />} />
          <Route path="/addstaff" element={<AddStaff />} />
          {/* adding a catch all for invalid urls */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        {/* adding footer */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;