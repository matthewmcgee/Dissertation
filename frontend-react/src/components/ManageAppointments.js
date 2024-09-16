import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ManageAppointments = () => {
    const [upcomingAppointments, setUpcomingAppointments] = useState([]);
    const [historicAppointments, setHistoricAppointments] = useState([]);
    const [error, setError] = useState('');
    const userRoleId = localStorage.getItem("user_role_id");
    const loginId = localStorage.getItem("login_id");
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Check access of user trying to view the page
    useEffect(() => {
        // Only patients (1) or doctors (2) can view this page
        if (userRoleId == 1 || userRoleId == 2) {
            setIsLoggedIn(true);
        } else {
            // Redirect to the account page if not a patient/doctor
            navigate('/account');
        }
    }, [navigate]);

    useEffect(() => {
        // Fetch the patient_id or medical_staff_id based on the role
        // This is so we can load the appointments dynamically based on user type
        const fetchUserId = async () => {
            try {
                let userId;
                let userIdUrl;

                // choose the correct API URL based on the user role
                if (userRoleId === '1') {
                    // for patient get patient_id using login_id
                    userIdUrl = `http://127.0.0.1:5001/patient/${loginId}`;
                } else if (userRoleId === '2') {
                    // for doctor get medical_staff_id using login_id
                    userIdUrl = `http://127.0.0.1:5001/medical_staff_id/${loginId}`;
                } else {
                    setError("Invalid user role.");
                    return;
                }

                // get the userId (patient_id or medical_staff_id)
                const userIdResponse = await fetch(userIdUrl);
                const userIdData = await userIdResponse.json();

                if (userIdResponse.ok) {
                    if (userRoleId === '1') {
                        userId = userIdData.patient_id;
                    } else if (userRoleId === '2') {
                        userId = userIdData[0].medical_staff_id;
                    }

                    // load apppointments based on this ID
                    fetchAppointments(userId);
                } else {
                    setError("Error fetching user information.");
                }
            } catch (error) {
                console.error("Error fetching user ID:", error);
                setError("An error occurred while fetching user information. Please try again.");
            }
        };

        // Fetch upcoming and historic appointments using patient_id or medical_staff_id
        const fetchAppointments = async (userId) => {
            try {
                let upcomingUrl, historicUrl;

                // Set the correct URLs based on the user's role
                if (userRoleId === '1') {
                    // Patient
                    upcomingUrl = `http://127.0.0.1:5001/upcoming_patient_appointments/${userId}`;
                    historicUrl = `http://127.0.0.1:5001/previous_patient_appointments/${userId}`;
                } else if (userRoleId === '2') {
                    // Doctor
                    upcomingUrl = `http://127.0.0.1:5001/upcoming_staff_appointments/${userId}`;
                    historicUrl = `http://127.0.0.1:5001/previous_staff_appointments/${userId}`;
                } else {
                    setError("Invalid user role.");
                    return;
                }

                // get upcoming appointments
                const upcomingResponse = await fetch(upcomingUrl);
                const upcomingData = await upcomingResponse.json();
                setUpcomingAppointments(upcomingData);

                // get historic appointments
                const historicResponse = await fetch(historicUrl);
                const historicData = await historicResponse.json();
                setHistoricAppointments(historicData);

            } catch (error) {
                console.error("Error fetching appointments:", error);
                setError("An error occurred while fetching appointments. Please try again.");
            }
        };

        if (loginId) {
            fetchUserId(); 
        } else {
            setError("User is not logged in.");
            navigate("/login");
        }
    }, [userRoleId, loginId, navigate]);

    // function to handle users cancelling appointment
    const cancelAppointment = async (appointmentId) => {
        // prompts users to manually confirm any deletions
        const confirmDelete = window.confirm("Are you sure you want to cancel this appointment?");
        
        if (confirmDelete) {
            try {
                const response = await fetch(`http://127.0.0.1:5001/delete_appointment/${appointmentId}`, {
                    method: 'POST',
                });
                const data = await response.json();

                if (response.ok) {
                    // Remove the canceled appointment from the list
                    setUpcomingAppointments((prevAppointments) =>
                        prevAppointments.filter((appointment) => appointment.appointment_id !== appointmentId)
                    );
                } else {
                    setError("Error canceling appointment.");
                }
            } catch (error) {
                console.error("Error canceling appointment:", error);
                setError("An error occurred while canceling the appointment. Please try again.");
            }
        } else {
            // user did not confirm cancellation, do nothing
            console.log("Appointment cancellation was not confirmed.");
        }
    };

    // format dates from mySQL into strings
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = date.toLocaleString('default', { month: 'short' });
        const year = String(date.getFullYear()).slice(-2);
        return `${day}-${month}-${year}`;
    };

    // Function to render appointment rows, with cancel button
    const renderUpcomingAppointmentRow = (appointment) => (
        <tr key={appointment.appointment_id}>
            <td>{formatDate(appointment.appointment_date)}</td>
            <td>{appointment.start_time} - {appointment.end_time}</td>
            <td>{appointment.staff_member}</td>
            <td>{appointment.practice_name}</td>
            <td>{appointment.practice_address}</td>
            <td>
                <button
                    onClick={() => cancelAppointment(appointment.appointment_id)}
                    className="warning"
                >
                    Cancel
                </button>
            </td>
        </tr>
    );

    // Function to render historic appointment rows
    const renderHistoricAppointmentRow = (appointment) => (
        <tr key={appointment.appointment_id}>
            <td>{formatDate(appointment.appointment_date)}</td>
            <td>{appointment.start_time} - {appointment.end_time}</td>
            <td>{appointment.staff_member}</td>
            <td>{appointment.practice_name}</td>
            <td>{appointment.practice_address}</td>
        </tr>
    );

    return (
        <div className="container">
            <h2>Appointments</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <div>
                <h3>Upcoming Appointments</h3>
                {upcomingAppointments.length > 0 ? (
                    <table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Time</th>
                                <th>Staff Member</th>
                                <th>Practice</th>
                                <th>Address</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {upcomingAppointments.map(renderUpcomingAppointmentRow)}
                        </tbody>
                    </table>
                ) : (
                    <p>No upcoming appointments.</p>
                )}
            </div>

            <div>
                <h3>Historic Appointments</h3>
                {historicAppointments.length > 0 ? (
                    <table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Time</th>
                                <th>Staff Member</th>
                                <th>Practice</th>
                                <th>Address</th>
                            </tr>
                        </thead>
                        <tbody>
                            {historicAppointments.map(renderHistoricAppointmentRow)}
                        </tbody>
                    </table>
                ) : (
                    <p>No historic appointments.</p>
                )}
            </div>
        </div>
    );
};

export default ManageAppointments;
