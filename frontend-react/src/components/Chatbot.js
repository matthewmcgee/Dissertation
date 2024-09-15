import React from 'react';

const Chatbot = () => {
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