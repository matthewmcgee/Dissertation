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
import Chatbot from './components/Chatbot';

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
        
        {/* test to validate flask back-end response */}
        {/* <h1><br/>Test API Message: {message}</h1> */}

        {/* adding routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/chatbot" element={<Chatbot />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;