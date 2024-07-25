import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    // using useEffect React hook to check if user is already logged in
    useEffect(() => {
        const loginId = localStorage.getItem('login_id');
        if (loginId) {
            setIsLoggedIn(true);
            // Redirect to the calendar page if already logged in
            navigate('/account'); 
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch('http://localhost:5001/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
                credentials: 'include' // Important for including cookies
            });

            const data = await response.json();

            if (response.ok) {
                console.log('Login successful:', data);
                // Store login_id in localStorage
                localStorage.setItem('login_id', data.login_id);
                setIsLoggedIn(true);
                // Redirect to the account page
                navigate('/account');
            } else {
                console.error('Login failed:', data.message);
                setError(data.message);
            }
        } catch (error) {
            console.error('Login Error:', error);
            setError('An error occurred. Please try again.' + error);
        }
    };

    return (
        <div className="container">
            {/* webpage will be dynamic based on whether user is logged in or not */}
            {isLoggedIn ? (
                <div>
                    <h2>You are already logged in!</h2>
                    <p>Redirecting to your calendar...</p>
                </div>
            ) : (
                <div>
                    <h2>Login</h2>
                    <p>Please login to access your account:</p>

                    <div className="half userinput">
                        <form onSubmit={handleSubmit}>
                            <input
                                type="email"
                                name="email"
                                className="stack"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <input
                                type="password"
                                name="password"
                                className=""
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <br /><br />
                            <button 
                                type="submit"
                                className="icon-paper-plane">
                                Login
                            </button>
                        </form>
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Login;
