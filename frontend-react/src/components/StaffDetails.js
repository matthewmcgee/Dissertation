import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const StaffDetails = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [title, setTitle] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // check access of user trying to view page
    useEffect(() => {
        const loginId = localStorage.getItem('login_id');
        const userRoleId = localStorage.getItem('user_role_id');
        // only medical staff (2) can view the page
        if (userRoleId == 2) {
            setIsLoggedIn(true);
        } else {
            // Redirect if not able to view
            navigate('/home');
        }
    }, [navigate]);

    // Load staff details based on login id
    useEffect(() => {
        const fetchStaffInfo = async () => {
            // get login id from local storage
            const loginId = localStorage.getItem("login_id");

            try {
                const response = await fetch(`http://127.0.0.1:5001/staff_details/${loginId}`);
                const data = await response.json();

                // set variables
                setTitle(data.title || '');
                setFirstName(data.first_name || '');
                setLastName(data.last_name || '');
                setEmail(data.email_address || '');
                // The password is not loaded from the API call for security
                setPassword('');
            } catch (error) {
                console.error('Error fetching staff info:', error);
                setError('An error occurred while fetching staff details.');
            }
        };

        fetchStaffInfo();
    }, []);

    // Handle form submission, calls the POST request to update details
    const handleSubmit = async (e) => {
        e.preventDefault();
        const loginId = localStorage.getItem('login_id');
        setError('');

        try {
            const response = await fetch(`http://127.0.0.1:5001/update_staff/${loginId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title,
                    first_name: firstName,
                    last_name: lastName,
                    email: email,
                    password: password,
                }),
                credentials: 'include'
            });

            const data = await response.json();

            if (response.ok) {
                console.log('Staff details updated successfully:', data);
                alert("Details updated successfully");
            } else {
                console.error('Error updating staff details:', data.message);
                setError('An error occurred. Please try again.');
            }
        } catch (error) {
            console.error('Update Staff Details Error:', error);
            setError('An error occurred. Please try again.');
        }
    };

    return (
        <div className="container">
            <h2>Update Staff Details</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <button 
                className="button warning"
                onClick={() => navigate('/account')}>
                Go Back
            </button>
            <p>Update your staff account details below:</p>
            <div className="half userinput">
                <form onSubmit={handleSubmit}>
                    <label>
                        Title:
                        <input
                            type="text"
                            name="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </label>
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

export default StaffDetails;
