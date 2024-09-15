import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Chatbot = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    // check access of user trying to view page
    useEffect(() => {
        const loginId = localStorage.getItem('login_id');
        const userRoleId = localStorage.getItem('user_role_id');
        // only patients (1) can view the chatbot
        if (userRoleId == 1) {
            setIsLoggedIn(true);
        } else {
            // Redirect to the account page if not a patient
            navigate('/account');
        }
    }, [navigate]);

    return (
        <div class="container">
            <h2>Chatbot</h2>
            <p>Speak to our chatbot below to get advice on your medical queries</p>
            <br/>
            {/* Adding chatbot iframe. Added title element due to warnings */}
            <iframe 
                title='Digital GP Chatbot' 
                width="500px" 
                height="600px" 
                allow="microphone;" 
                src="https://console.dialogflow.com/api-client/demo/embedded/93b4def3-0339-440b-b118-eb295b1c74de">
            </iframe>
            <br/><br/><br/>
        </div>
    );
}

export default Chatbot;