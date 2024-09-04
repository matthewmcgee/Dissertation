import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {

  const navigate = useNavigate();

  return (
    <div className="container">
      <div className='flex one'>
        
        {/* homepage section one */}
        <div className='flex one two-700 homepage-container'>
          <div className='homepage-text'>
            <h3>Manage Your Appointments</h3>
            <p>
              With our user-friendly platform, you can quickly book your GP appointments at your convenience, 24/7.
              <br/><br/>No more waiting on hold - simply log in to your account, view available time slots, and choose the one that best fits your schedule.
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

        {/* homepage section two */}
        <div className='flex one two-700 homepage-container'>
          <img 
            src='./images/doctor_with_background.svg'
            alt='Doctor with file'
            className='homepage-image'>  
          </img>
          <div className='homepage-text'>
              <h3>Online Chatbot</h3>
              <p>
                Our intelligent online chatbot is here to assist you with personalized medical advice anytime, day or night.
                <br/><br/>Whether you need guidance on managing symptoms, information about our services, or answers to general health questions, our chatbot provides reliable advice tailored to your needs.
              </p>
              <button onClick={() => navigate('/chatbot')}>
              Chat Now
              </button>
          </div>
        </div>

        {/* homepage section three */}
        <div className='flex one two-700 homepage-container'>
          <div className='homepage-text'>
              <h3>Log In or Sign Up Today</h3>
              <p>
                Join the community who trust Digital GP for managing their healthcare needs. If you already have an account, log in to access your appointments and stay connected with your healthcare provider.
              </p>
              <button onClick={() => navigate('/login')}>
                Log In
              </button>
              <p>
                New to Digital GP? Signing up is quick, easy, and secure. Create an account to gain instant access to appointment scheduling, medical advice, and more - right at your fingertips. Take the first step towards a more convenient healthcare experience today.
              </p>
              <button onClick={() => navigate('/signup')}>
                Sign Up
              </button>
          </div>
          <img 
            src='./images/woman_blue_background.svg'
            alt='Doctor with file'
            className='homepage-image'>  
          </img>
        </div>

      </div>      
    </div>
  );
}

export default Home;
