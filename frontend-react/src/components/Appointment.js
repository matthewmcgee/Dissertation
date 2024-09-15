import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

const Appointment = () => {
  const [practice, setPractice] = useState(null);
  const [medicalStaff, setMedicalStaff] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState('');
  const [availability, setAvailability] = useState([]);
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

   // check access of user trying to view page
   useEffect(() => {
    const loginId = localStorage.getItem('login_id');
    const userRoleId = localStorage.getItem('user_role_id');
    // only patients (1) can view the page
    if (userRoleId == 1) {
        setIsLoggedIn(true);
    } else {
        // Redirect to the account page if not a patient
        navigate('/account');
    }
}, [navigate]);

  useEffect(() => {
    // reset the error message
    setError('');

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
          fetchAvailability(staffData[0].medical_staff_id);
        }

      } catch (error) {
        console.error("Error fetching data:", error);
        setError("An error occurred while fetching data. Please try again.");
      }
    };

    fetchPracticeAndStaff();
  }, []);

  // getting availability for the chosen staff member
  const fetchAvailability = async (staffId) => {
    try {
      const response = await fetch(`http://127.0.0.1:5001/availability/${staffId}`);
      const availabilityData = await response.json();
      setAvailability(availabilityData);
    } catch (error) {
      console.error("Error fetching availability:", error);
      setError("An error occurred while fetching availability. Please try again.");
    }
  };

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

  // appointment booking functionality
  const bookAppointment = async (appointmentDate, startTime, endTime) => {
    try {
      // get local login id
      const loginId = localStorage.getItem("login_id");

      // fetch patient data based on login id
      const patientResponse = await fetch(`http://127.0.0.1:5001/patient/${loginId}`);
      const patientData = await patientResponse.json();

      // send post request to make the booking
      const response = await fetch("http://127.0.0.1:5001/book_appointment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          appointment_date: appointmentDate,
          start_time: startTime,
          end_time: endTime,
          patient_id: patientData.patient_id,
          medical_staff_id: selectedStaff,
          // 1 represents "Pending"
          appointment_status_id: 1
        }),
      });

      if (response.ok) {
        // displays a modal alert to the user
        alert("Appointment booked successfully!");
        // refresh availability so the appointments update
        fetchAvailability(selectedStaff);
      } else {
        const errorData = await response.json();
        console.error("Error booking appointment:", errorData);
        setError("An error occured while booking the appointment. Please try again.");
      }

    } catch (error) {
      console.error("Error booking appointment:", error);
      setError("An error occured while booking the appointment. Please try again.");
    }
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
                  {slot.start_time} - {slot.end_time}
                  {slot.status === "Booked" && (
                    <span> (Booked)</span>
                  )}
                  {/* removed this from after slot.end_time ({slot.status}) */}
                  {/* Add button beside each available appointment to book it */}
                  {slot.status === "Available" && (
                    <button className='booking_button' onClick={() => bookAppointment(formattedDate, slot.start_time, slot.end_time)}>Book</button>
                  )}
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
      <p>Here you can make an appointment with your practice</p>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <h3>Your Practice Information:</h3>
      {practice && (
        <div className='flex one two-600'>
          <div className='full third-600'>
            <p>{practice.practice_name}</p>
            <p>{practice.address}</p>
            <p>{practice.postcode}</p>
            <p>{practice.city}, {practice.country}</p>
            <p>Phone: {practice.telephone_number}</p>
          </div>
          {/* Google maps iframe */}
          <div className='full two-third-600'>
            {practice.google_maps_id ? (
              <iframe 
                src={practice.google_maps_id}
                allowFullScreen="" 
                loading="lazy"
                width="100%"
                height="220px"
                referrerPolicy="no-referrer-when-downgrade">
              </iframe>
            ) : (
              // leave blank if no google maps id
              <p/>
            )}
          </div>
        </div>
      )}
      <div className='appointment-body'>
        <hr/>
      </div>
      {medicalStaff.length > 0 && (
        <div className='flex one'>
          <label htmlFor='staffSelect'>
            Select Medical Staff:
          </label>
          <select
            id='staffSelect'
            className=''
            value={selectedStaff}
            onChange={(e) => {
              setSelectedStaff(e.target.value);
              fetchAvailability(e.target.value);
            }}>
            {/* add each medical staff member to the dropdown */}
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
      <br />
      <div className="flex one three-350 four-700 five-1050 six-1400 seven-1750 eight-2100 calendar">
        {renderCalendar()}
      </div>
    </div>
  );
};

export default Appointment;
