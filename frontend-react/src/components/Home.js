import React from 'react';

const Home = () => {
  return (
    <div class="container">
      <h2>Appointment Scheduler</h2>
      <p>Welcome to the Appointment Scheduler, where you can view and manage your GP appointments</p>

      {/* <iframe height="430" width="350" src="https://bot.dialogflow.com/93b4def3-0339-440b-b118-eb295b1c74de"></iframe> */}

      {/* Got this code from launching bot in chrome. added title element due to warnings */}
      <iframe title='test title' width="400" height="450" allow="microphone;" src="https://console.dialogflow.com/api-client/demo/embedded/93b4def3-0339-440b-b118-eb295b1c74de"></iframe>


    </div>
  );
}

export default Home;
