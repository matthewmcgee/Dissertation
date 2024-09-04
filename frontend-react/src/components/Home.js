import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {

  const navigate = useNavigate();

  return (
    <div className="container">
      <div className='flex one'>
        {/* <div className='flex one three-500 homepage-container'> */}
            {/* <h2>GP Online</h2> */}

            
            {/* <button 
              className='homepage-button'
              onClick={() => navigate('/login')}>
              Log In
            </button>
            <button
              className='homepage-button'
              onClick={() => navigate('/signup')}>
              Sign Up
            </button> */}
        {/* </div> */}
        
        <div className='flex one two-700 homepage-container'>
          <div className='homepage-text'>
            <h3>Manage Your Appointments</h3>
            <p>
              Welcome to GP Online! Here you can book and manage your GP appointments!
            </p>
            <button onClick={() => navigate('/appointment')}>
              Book Now
            </button>
          </div>
          <img
            src='./images/woman_on_laptop.png' 
            alt='Woman on laptop'
            className='homepage-image'>
          </img>
        </div>

        <div className='flex one two-700 homepage-container'>
          <img 
            src='./images/doctor_with_background.svg'
            alt='Doctor image'
            className='homepage-image'>  
          </img>
          <div className='homepage-text'>
              <h3>Online Chatbot</h3>
              <p>
                Get advice from our chatbot
              </p>
              <button onClick={() => navigate('/chatbot')}>
              Chat Now
              </button>
          </div>
        </div>

        {/* 3rd section - possibly a 'How it Works' */}
        <div>

        </div>

      </div>
      
    </div>
  );
}

export default Home;
