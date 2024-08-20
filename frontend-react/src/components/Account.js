import React from 'react';
import { useNavigate } from 'react-router-dom';

const Account = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        // fetch logout post request
        try {
            const response = await fetch("http://localhost:5001/logout", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: "include"
            });

            if (response.ok) {
                // clear local storage
                localStorage.removeItem("login_id");
                // Redirect to page if successfully logged out
                navigate("/home");
            } else {
                console.error("Logout failed:", response.statusText)
            }

        // log if any errors
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <div class="container">
            <h2>Manage Account</h2>
            <ul>
                <li>My Details</li>
                <li>My Appointments</li>
                <li>Appointment History</li>
                <li>
                    <button onClick={handleLogout} className="">
                        Logout
                    </button>
                </li>
            </ul>
        </div>
    );
}

export default Account;