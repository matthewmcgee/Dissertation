import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PatientDetails = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [gpPractice, setGpPractice] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [practices, setPractices] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // check access of user trying to view page
    useEffect(() => {
        const loginId = localStorage.getItem('login_id');
        const userRoleId = localStorage.getItem('user_role_id');
        // only patients (1) can view the page
        if (userRoleId == 1) {
            setIsLoggedIn(true);
        } else {
            // Redirect if not able to view
            navigate('/home');
        }
    }, [navigate]);

    // load user info
    useEffect(() => {
        const fetchPatientInfo = async () => {
            // get login id from local storage
            const loginId = localStorage.getItem("login_id");

            try {
                // load patient data based on login id
                const response = await fetch(`http://127.0.0.1:5001/patient/${loginId}`);
                const data = await response.json();

                // set variables
                setFirstName(data.first_name || '');
                setLastName(data.last_name || '');
                setDateOfBirth(data.date_of_birth || '');
                setPhoneNumber(data.phone_number || '');
                setGpPractice(data.practice_id || '');
                setEmail(data.email_address || '');
                // leave password as blank for safety
                setPassword('');
            } catch (error) {
                console.error('Error fetching patient info:', error);
                setError('An error occurred while fetching patient details.');
              }
            };

        fetchPatientInfo();
    }, []);


    // loading practice data for drop down
    useEffect(() => {
        // Only fetching if the user is logged in
        if (isLoggedIn) {
            const fetchPractices = async () => {
                try {
                    const response = await fetch("http://127.0.0.1:5001/practices");
                    const data = await response.json();
                    setPractices(data);
                } catch (error) {
                    console.error("Error fetching practices:", error)
                }
            };

            fetchPractices();
        }
    }, [isLoggedIn]);

    // calls the POST request to submit the form details
    const handleSubmit = async (e) => {
        e.preventDefault();
        const loginId = localStorage.getItem('login_id');
        // reset error message to blank
        setError('');

        try {
            const response = await fetch(`http://127.0.0.1:5001/update_patient/${loginId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    first_name: firstName,
                    last_name: lastName,
                    date_of_birth: dateOfBirth,
                    phone_number: phoneNumber,
                    practice_id: gpPractice,
                    email: email,
                    password: password,
                }),
                credentials: 'include'
            });

            const data = await response.json();

            if (response.ok) {
                console.log('Patient details updated successfully:', data);
                alert("Details updated successfully");
            } else {
                console.error('Error updating patient details:', data.message);
                setError('An error occurred. Please try again.');
            }
        } catch (error) {
            console.error('Update Patient Details Error:', error);
            setError('An error occurred. Please try again.');
        }
    };

    return (
        <div className="container">
            <h2>Update Details</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <button 
                className="button warning"
                onClick={() => navigate('/account')}>
                    Go Back
            </button>
            <p>Update your account details below:</p>
            <div className="half userinput">
                <form onSubmit={handleSubmit}>
                    <label>
                        First Name:
                        <input
                            type="text"
                            name="firstName"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                        />
                    </label>
                    <label>
                        Last Name:
                        <input
                            type="text"
                            name="lastName"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                        />
                    </label>
                    <label>
                        Date of Birth:
                        <input
                            type="date"
                            name="dateOfBirth"
                            value={dateOfBirth}
                            onChange={(e) => setDateOfBirth(e.target.value)}
                            required
                        />
                    </label>
                    <label>
                        Phone Number:
                        <input
                            type="tel"
                            name="phoneNumber"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            required
                        />
                    </label>
                    <label>
                        GP Practice:
                        <select
                            name="gpPractice"
                            value={gpPractice}
                            onChange={(e) => setGpPractice(e.target.value)}
                            required
                        >
                            <option value="">Select a Practice</option>
                            {practices.map((practice) => (
                            <option key={practice.practice_id} value={practice.practice_id}>
                                {practice.practice_name}
                            </option>
                            ))}
                        </select>
                        </label>
                    <label>
                        Email:
                        <input
                            type="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </label>
                    <label>
                        Password:
                        <input
                            type="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </label>
                    <br/><br/>
                    <button type="submit">Update Details</button>
                </form>
             
            </div>
        </div>
    );
};

export default PatientDetails;
