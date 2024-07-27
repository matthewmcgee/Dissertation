// TODO: needs to be admin only to access this page - see isLoggedIn in Login/Signup
// - it 
// TODO: admin only able to add staff for their practice
import React, { useState, useEffect } from "react";

const AddStaff = () => {
    const [title, setTitle] = useState('');
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [practice, setPractice] = useState('');
    const [practices, setPractices] = useState([]);
    const [medicalStaffRole, setMedicalStaffRole] = useState('');
    const [medicalStaffRoles, setMedicalStaffRoles] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // fetch practice data and medical staff from backend
    useEffect(() => {
        const fetchPractices = async () => {
            try {
                const response = await fetch("http://127.0.0.1:5001/practices");
                const data = await response.json();
                setPractices(data);
                if (data.length > 0) {
                    setPractice(data[0].practice_id);
                }
            } catch (error) {
                console.error("Error fetching practices:", error);
            }
        };

        const fetchStaffRoles = async () => {
            try {
                const response = await fetch("http://127.0.0.1:5001/medical_staff_roles");
                const data = await response.json();
                setMedicalStaffRoles(data);
                if (data.length > 0) {
                    setMedicalStaffRole(data[0].medical_staff_role_id);
                }
            } catch (error) {
                console.error("Error fetching staff roles:", error);
            }
        };

        fetchPractices();
        fetchStaffRoles();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const response = await fetch('http://localhost:5001/addstaff', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title,
                    firstname,
                    lastname,
                    email,
                    password,
                    practice,
                    medicalStaffRole,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                console.log('Staff added successfully:', data);
                setError('');
                setSuccess(data.message);
            } else {
                console.error('Error adding staff:', data.message);
                setError(data.message);
                setSuccess('');
            }
        } catch (error) {
            console.error('Error adding staff:', error);
            setError("An error occured. Please try again")
        }
    };

    // resets all fields and error/success message
    const handleReset = () => {
        setTitle('');
        setFirstname('');
        setLastname('');
        setEmail('');
        setPassword('');
        setPractice(practices.length > 0 ? practices[0].practice_id : '');
        setMedicalStaffRole(medicalStaffRoles.length > 0 ? medicalStaffRoles[0].medical_staff_role_id : '');
        setError('');
        setSuccess('');
    };

    return (
        <div className="container">
            <h2>Add Medical Staff</h2>
            <p>Please fill in the details to add medical staff:</p>
            <div className="half userinput">
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="title"
                        className="stack"
                        placeholder="Title (Dr, Mr, Ms etc)"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
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
                    <span className="stack">Select Role:</span>

                    <select
                        name="medicalStaffRole"
                        className=""
                        value={medicalStaffRole}
                        onChange={(e) => setMedicalStaffRole(e.target.value)}
                    >
                        {/* dynamicall show medical staff roles */}
                        {medicalStaffRoles.map((role) => (
                            <option 
                                key={role.medical_staff_role_id}
                                value={role.medical_staff_role_id}>
                                {role.role_name}
                            </option>
                        ))}
                    </select>

                    <br /><br />
                    <button type="submit" className="icon-paper-plane">
                        Add Staff
                    </button>
                    <br />
                    <button type="button" className="icon-paper-plane" onClick={handleReset}>
                        Reset
                    </button>
                </form>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {success && <p style={{ color: 'green' }}>{success}</p>}
            </div>
        </div>
    );
};

export default AddStaff;
