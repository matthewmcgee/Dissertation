import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AddAvailability = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [medicalStaffId, setMedicalStaffId] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // check access of user trying to view page
  useEffect(() => {
    const loginId = localStorage.getItem('login_id');
    const userRoleId = localStorage.getItem('user_role_id');
    // only medical staff (2) can view the page
    if (userRoleId == 2) {
      setIsLoggedIn(true);
      // get their medical_staff_id
      fetchMedicalStaffId(loginId);
    } else {
      // Redirect if not able to view
      navigate('/home');
    }
  }, [navigate]);


  // Fetch medical staff ID based on login ID
  const fetchMedicalStaffId = async (loginId) => {
    // clear any existing errors
    setError('');
    try {
      const response = await fetch(`http://127.0.0.1:5001/medical_staff_id/${loginId}`);
      const data = await response.json();

      if (response.ok) {
        if (data.length > 0) {
          setMedicalStaffId(data[0].medical_staff_id);
        }
      } else {
        console.error('Error fetching medical staff ID:', data.error);
        setError('Error fetching medical staff ID.');
      }
    } catch (error) {
      console.error('Error fetching medical staff ID:', error);
      setError('An error occurred while fetching medical staff ID.');
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    // get login id
    const loginId = localStorage.getItem('login_id');
    // reset the error message
    setError('');

    // Check all values have been entered
    if (!date || !startTime || !endTime) {
      setError('Date, Start Time, and End Time are required.');
      return;
    }

    // Ensure end time is after start time
    if (startTime >= endTime) {
      setError('End time must be after start time.');
      return;
    }

    // Check we have a valid medical_staff_id
    if (!medicalStaffId) {
      setError('Medical staff ID not found. Please try again.');
      return;
    }

    try {
      // Send POST request to add availability
      const response = await fetch(`http://127.0.0.1:5001/add_availability/${loginId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          medical_staff_id: medicalStaffId,
          availability_date: date,
          start_time: startTime,
          end_time: endTime,
        }),
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Availability added successfully:', data);
        alert('Availability added successfully');
      } else {
        console.error('Error adding availability:', data.message);
        setError('An error occurred. Please try again.');
      }
    } catch (error) {
      console.error('Add Availability Error:', error);
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="container">
      <h2>Add Availability</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button
        className="button warning"
        onClick={() => navigate('/account')}
      >
        Go Back
      </button>
      <p>Enter your availability details below:</p>
      <div className="half userinput">
        <form onSubmit={handleSubmit}>
          <label>
            Date:
            <input
              type="date"
              name="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </label>
          <label>
            Start Time:
            <input
              type="time"
              name="startTime"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
            />
          </label>
          <label>
            End Time:
            <input
              type="time"
              name="endTime"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
            />
          </label>
          <br /><br />
          <button type="submit">Add Availability</button>
        </form>
      </div>
    </div>
  );
};

export default AddAvailability;
