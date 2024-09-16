import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/home">Home</a></li>
            <li><a href="/appointment">Book Appointment</a></li>
            <li><a href="/account">My Account</a></li>
            <li><a href="/chatbot">Chatbot</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>Follow Us</h4>
          {/* can use target="_blank" to open in new tab */}
          <ul className="social-icons">
            <li><a href="#" target="" rel="noreferrer"><i className="fab fa-facebook-f"></i></a></li>
            <li><a href="#" target="" rel="noreferrer"><i className="fab fa-twitter"></i></a></li>
            <li><a href="#" target="" rel="noreferrer"><i className="fab fa-instagram"></i></a></li>
            <li><a href="#" target="" rel="noreferrer"><i className="fab fa-linkedin-in"></i></a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>Contact Us</h4>
          <p>Email: info@digitalGP</p>
          <p>Phone: +1 234 567 890</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2024 Digital GP. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
