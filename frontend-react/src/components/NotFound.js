import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {

    const navigate = useNavigate();

    // function to navigate to home page
    const goHome = () => {
        navigate("/home");
    }

    return (
        <div className='container'>
            <h2>404 - Page Not Found</h2>
            <p>Sorry, the page you are looking for does not exist</p>
            <button onClick={goHome}>
                Go to Home Page
            </button>
        </div>
    );
};

export default NotFound;