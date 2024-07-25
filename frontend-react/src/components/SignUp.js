import React, { useState, useEffect } from "react";

const SignUp = () => {
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [birthday, setBirthday] = useState('');
    const [phonenumber, setPhonenumber] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [practice, setPractice] = useState('');
    const [practices, setPractices] = useState([]);

    // fetch practice data from backend
    useEffect(() => {
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
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

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
        });

        const data = await response.json();

        if (response.ok) {
            console.log('Signup successful:', data);
        } else {
            console.error('Signup failed:', data.message);
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
            </div>
        </div>
    );
};

export default SignUp;
