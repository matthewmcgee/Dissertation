import React from 'react';
import { Link } from 'react-router-dom';

const NavBar = () => {
    return (
        <nav>
            {/* Left hand side of NavBar - could add an img too */}
            {/* <span class="brand"><Link to="/">ApptSched</Link></span> */}
            <a href="/" class="brand">
                <img class="logo" src='./images/calendar-icon.svg' alt="logo"></img>
                <span>GP Online</span>
            </a>

            {/* responsive resizing */}
            <input id="bmenub" type="checkbox" class="show"></input>
            {/* #8801 represents the burger icon */}
            <label for="bmenub" class="burger pseudo button">&#8801;</label>

            {/* nav bar items on right hand side */}
            <div class="menu">
                <span class="pseudo button"><Link to="/">Home</Link></span>
                <span class="pseudo button"><Link to="/login">Login</Link></span>
                <span class="pseudo button"><Link to="/signup">Sign Up</Link></span>
                <span class="pseudo button"><Link to="/chatbot">Chatbot</Link></span>
                <span class="pseudo button"><Link to="/appointment">Appointment</Link></span>              
                {/* a tags could also be used, altho not as efficient */}
                {/* <a class="button" href="/page3">Page 3</a> */}
            </div>
        </nav>
    )
}

export default NavBar;