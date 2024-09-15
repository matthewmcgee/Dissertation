import React from 'react';

const NavBar = () => {
    return (
        <nav>
            {/* Left hand side of NavBar - could add an img too */}
            {/* <span class="brand"><Link to="/">ApptSched</Link></span> */}
            <a href="/" class="brand">
                <img class="logo" src='./images/calendar-icon.svg' alt="logo"></img>
                <span>Digital GP</span>
            </a>

            {/* responsive resizing */}
            <input id="bmenub" type="checkbox" class="show"></input>
            {/* #8801 represents the burger icon */}
            <label for="bmenub" class="burger pseudo button">&#8801;</label>

            {/* nav bar items on right hand side */}
            <div class="menu">
                <a href='/'
                    className='nav-bar-item'>
                    Home
                </a>
                <a href='/chatbot'
                    className='nav-bar-item'>
                    Chatbot
                </a>
                <a href='/appointment'
                    className='nav-bar-item'>
                    Appointment
                </a>
                <a href='/account'
                    className='nav-bar-item'>
                    Account
                </a>
            </div>
        </nav>
    )
}

export default NavBar;