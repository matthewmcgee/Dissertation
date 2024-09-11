import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [birthday, setBirthday] = useState('');
    const [phonenumber, setPhonenumber] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [practice, setPractice] = useState('');
    const [practices, setPractices] = useState([]);
    const [error, setError] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    // if user is already signed in, they can't view page
    useEffect(() => {
        // Check if the user is already logged in
        const loginId = localStorage.getItem('login_id');
        if (loginId) {
            setIsLoggedIn(true);
            // Redirect to the calendar page if already logged in
            navigate('/account'); 
        }
    }, [navigate]);

    // loading practice data for drop down
    useEffect(() => {
        // Only fetching if the user is not logged in
        if (!isLoggedIn) {
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch('http://localhost:5001/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    firstname,
                    lastname,
                    birthday,
                    phonenumber,
                    email,
                    password,
                    practice,
                }),
                credentials: 'include'
            });

            const data = await response.json();

            if (response.ok) {
                console.log('Signup successful:', data);
                // Store login_id in localStorage
                localStorage.setItem('login_id', data.login_id);
                setIsLoggedIn(true);
                // Redirect to the account page
                navigate('/account');
            } else {
                console.error('Signup failed:', data.message);
                setError('An error occured. Please try again.');
            }
        } catch (error) {
            console.error('Sign Up Error:', error);
            setError('An error occurred. Please try again.');
        }
    };

    return (
        <div className="container">
            <h2>Sign Up</h2>
            <p>Please fill in the details below to create your account:</p>
            <div className="half userinput">
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="firstname"
                        className="stack"
                        placeholder="First Name"
                        value={firstname}
                        onChange={(e) => setFirstname(e.target.value)}
                    />
                    <input
                        type="text"
                        name="lastname"
                        className=""
                        placeholder="Last Name"
                        value={lastname}
                        onChange={(e) => setLastname(e.target.value)}
                    />
                    <br /><br />
                    <span className="stack">Date of Birth:</span>
                    <input
                        type="date"
                        name="birthday"
                        className=""
                        value={birthday}
                        onChange={(e) => setBirthday(e.target.value)}
                    />
                    <br /><br />
                    <input
                        type="text"
                        name="phonenumber"
                        className="stack"
                        placeholder="Phone Number"
                        value={phonenumber}
                        onChange={(e) => setPhonenumber(e.target.value)}
                    />
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
                    <span className="stack">Select GP Practice:</span>
                    <select
                        name="practice"
                        className=""
                        value={practice}
                        onChange={(e) => setPractice(e.target.value)}
                    >
                        {/* dynamically showing practices */}
                        {practices.map((practice) => (
                            <option 
                                key={practice.practice_id}
                                value={practice.practice_id}>
                            {/* display practice name and town/city  */}
                            {practice.practice_name}, {practice.city}
                            </option>
                        ))}
                    </select>

                    <br /><br />
                    <button type="submit" className="icon-paper-plane">
                        Sign Up
                    </button>
                </form>
                {/* add conditional error message */}
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </div>
        </div>
    );
};

export default SignUp;
