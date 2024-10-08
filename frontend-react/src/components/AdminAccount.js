import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminAccount = () => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // check access of user trying to view page
    useEffect(() => {
        const loginId = localStorage.getItem('login_id');
        const userRoleId = localStorage.getItem('user_role_id');
        // only admins (3) can view this page
        if (userRoleId == 3) {
            setIsLoggedIn(true);
        } else {
            // Redirect to the home page if not an admin
            navigate('/home');
        }
    }, [navigate]);

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
                // clear login_id and user_role_id from local storage
                localStorage.removeItem("login_id");
                localStorage.removeItem("user_role_id");
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
                <li>
                    <a href="/addstaff">
                        Add Staff
                    </a>
                </li>
            </ul>
            <button onClick={handleLogout} className="">
                    Logout
            </button>
        </div>
    );
}

export default AdminAccount;