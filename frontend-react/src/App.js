import React from 'react';
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
import PatientDetails from './components/PatientDetails';
import StaffDetails from './components/StaffDetails';
import AddAvailability from './components/AddAvailability';
import PatientAccount from './components/PatientAccount';
import StaffAccount from './components/StaffAccount';
import AdminAccount from './components/AdminAccount';
import ManageAppointments from './components/ManageAppointments';

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
          <Route path="/patient_account" element={<PatientAccount />} />
          <Route path="/staff_account" element={<StaffAccount />} />
          <Route path="/admin_account" element={<AdminAccount />} />
          <Route path="/addstaff" element={<AddStaff />} />
          <Route path="/patient_details" element={<PatientDetails />} />
          <Route path="/staff_details" element={<StaffDetails />} />
          <Route path="/add_availability" element={<AddAvailability />} />
          <Route path="/manage_appointments" element={<ManageAppointments />} />
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