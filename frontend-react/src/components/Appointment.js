// TODO: only visible to patients, not staff/admin
// -> might need to add user_role_id into local storage, where user_id is kept
import React, { useState, useEffect } from 'react';

const Appointment = () => {
  const [practice, setPractice] = useState(null);
  const [medicalStaff, setMedicalStaff] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState('');
  const [availability, setAvailability] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    // Get the login id from local storage
    const loginId = localStorage.getItem("login_id");

    // check the login id exists
    if (!loginId) {
      setError("User is not logged in.");
      return;
    }

    // load practice and staff information
    const fetchPracticeAndStaff = async () => {
      try {
        // fetch patient data based on login id
        const patientResponse = await fetch(`http://127.0.0.1:5001/patient/${loginId}`);
        const patientData = await patientResponse.json();

        // show error if no data exists for patient
        if (!patientData.practice_id) {
          setError("Patient practice information is missing");
          return;
        }

        // fetch practice data based on practice_id
        const practiceResponse = await fetch(`http://127.0.0.1:5001/practice/${patientData.practice_id}`);
        const practiceData = await practiceResponse.json();
        setPractice(practiceData);

        // fetch medical staff based on practice_id
        const staffResponse = await fetch(`http://127.0.0.1:5001/medical_staff/${patientData.practice_id}`);
        const staffData = await staffResponse.json();
        setMedicalStaff(staffData);

        // check that data exists, if so set default staff member to first array element
        if (staffData.length > 0) {
          setSelectedStaff(staffData[0].medical_staff_id);
        }

      } catch (error) {
        console.error("Error fetching data:", error);
        setError("An error occurred while fetching data. Please try again.");
      }
    };

    fetchPracticeAndStaff();
  }, []);

  // getting availability for the chosen staff member
  useEffect(() => {
    const fetchAvailability = async () => {
      if (selectedStaff) {
        try {
          const availabilityResponse = await fetch(`http://127.0.0.1:5001/availability/${selectedStaff}`);
          const availabilityData = await availabilityResponse.json();
          setAvailability(availabilityData);
        } catch (error) {
          console.error("Error fetching availability:", error);
          setError("An error occurred while fetching availability. Please try again.");
        }
      }
    };

    fetchAvailability();
  }, [selectedStaff]);

  const getFormattedDate = (date) => {
    return new Date(date).toLocaleDateString('en-GB', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // used to convert mySQL dates for comparison
  const formatDateForComparison = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  // generates a HTML calendar with the next 14 days
  // appointments are shown per day
  const renderCalendar = () => {
    const days = [];
    for (let i = 0; i < 14; i++) {
      const currentDate = new Date();
      currentDate.setDate(currentDate.getDate() + i);
      const formattedDate = currentDate.toISOString().split('T')[0];

      // date comparison - looking for availabilities which match
      const dayAvailability = availability.filter(a => formatDateForComparison(a.availability_date) === formattedDate);

      // create a list of days
      // for each day, add appointments as divs within the day
      // if there are no appointments, add this as message
      days.push(
        <div key={formattedDate} className="day-column">
          <h4>{getFormattedDate(currentDate)}</h4>
          {dayAvailability.length > 0 ? (
            dayAvailability.map((slot, index) => (
              <div key={index} className={`slot ${slot.status.toLowerCase()}`}>
                {slot.start_time} - {slot.end_time} ({slot.status})
              </div>
            ))
          ) : (
            <p>No available appointments</p>
          )}
        </div>
      );
    }
    return days;
  };

  return (
    <div className="container">
      <h2>Make an Appointment</h2>
      <p>Here you can make an appointment with your GP</p>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {practice && (
        <div>
          <h3>Practice Information</h3>
          <p>{practice.practice_name}</p>
          <p>{practice.address}</p>
          <p>{practice.postcode}</p>
          <p>{practice.city}, {practice.country}</p>
          <p>Phone: {practice.telephone_number}</p>
        </div>
      )}
      {medicalStaff.length > 0 && (
        <div>
          <label htmlFor='staffSelect'>
            Select Medical Staff:
          </label>
          <select
            id='staffSelect'
            value={selectedStaff}
            onChange={(e) => setSelectedStaff(e.target.value)}
          >
            {medicalStaff.map((staff) => (
              <option
                key={staff.medical_staff_id}
                value={staff.medical_staff_id}
              >
                {/* display full name and job role */}
                {staff.title} {staff.first_name} {staff.last_name} - {staff.role_name}
              </option>
            ))}
          </select>
        </div>
      )}
      <div className="calendar">
        {renderCalendar()}
      </div>
    </div>
  );
};

export default Appointment;
