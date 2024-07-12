import React from 'react';

const Chatbot = () => {
    return (
        <div class="container">
            <p>Speak to our chatbot below to get advice and make appointments:</p>

            {/* Got this code from launching bot in chrome. added title element due to warnings */}
            <iframe title='test title' width="400" height="450" allow="microphone;" src="https://console.dialogflow.com/api-client/demo/embedded/93b4def3-0339-440b-b118-eb295b1c74de"></iframe>
        </div>
    );
}

export default Chatbot;