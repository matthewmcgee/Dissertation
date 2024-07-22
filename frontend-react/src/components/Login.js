import React, { useState } from "react";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const response = await fetch('http://localhost:5001/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
                password,
            }),
        });

        const data = await response.json();

        if (response.ok) {
            console.log('Login successful:', data);
        } else {
            console.error('Login failed:', data.message);
            setError(data.message);
        }
    };

    return (
        <div className="container">
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
    );
};

export default Login;
