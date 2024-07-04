import React, { useState, useEffect } from 'react';
import axios from 'axios'; // for making HTTP requests
// Routes used in v6, not Switch
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// css stylesheet
import './App.css';
import NavBar from './components/NavBar';
import Home from './components/Home';
import Login from './components/Login';
import SignUp from './components/SignUp';

function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    // make HTTP request to our Flask api
    axios.get('http://127.0.0.1:5001/api/data')
      .then(response => {
        setMessage(response.data.message);
      })
      .catch(error => {
        console.error('There was an error fetching the data!', error);
        setMessage("Error fetching data...")
      });
  }, []);

  return (
    <Router>
      <div className="App">
        {/* adding in the nav bar */}
        <NavBar />
        {/* adding routes */}
        <h1><br></br>Test API Message: {message}</h1>
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