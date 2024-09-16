<h1>GP Appointment Booking and Chatbot Website</h1>

<p>This project is a web-based system designed to allow users to book GP appointments and receive medical advice via a chatbot. It includes functionality for patients and medical staff, supporting appointment scheduling, management, and access to previous appointments. The backend is built using Flask, which provides a set of APIs, and the frontend is developed using React.js.</p>

<h2>Features</h2>
<h3>Patient functionality:</h3>
<ul>
    <li>Book and manage appointments.</li>
    <li>View upcoming and previous appointments.</li>
    <li>Get medical advice through a chatbot.</li>
</ul>

<h3>Doctor functionality:</h3>
<ul>
    <li>View and manage upcoming and previous appointments.</li>
    <li>Cancel patient appointments.</li>
</ul>

<h2>Project Structure</h2>
<p>
    <strong>Frontend: React.js</strong> (Handles user interface, appointment display, and interaction with the backend)<br/>
    React components include managing appointments, user role validation, and medical advice chatbot.<br/>
    <strong>Backend: Flask API</strong> (Handles requests for appointments, user data, and database interactions)<br/>
    APIs to fetch and manage appointments.<br/>
    User management and role-based access control for patients and staff.<br/>
    <strong>Database: MySQL</strong> (Stores user data, appointments, and medical information)
</p>

<h2>APIs</h2>
<p>
    The backend Flask APIs handle the following:<br/>
    Retrieve upcoming and previous appointments for both patients and medical staff.<br/>
    Cancel appointments.<br/>
    Fetch user details based on login credentials.<br/>
    Get medical advice for patients using a chatbot.
</p>

<h2>Prerequisites</h2>
<p>
    To run the project locally, you'll need the following:<br/>
    <strong>Node.js</strong> (for the React frontend)<br/>
    <strong>Python 3.x</strong> (for the Flask backend)<br/>
    <strong>MySQL</strong> (for the database)<br/>
    Install dependencies for both frontend and backend.
</p>

<h2>Instructions to Run</h2>
<ol>
    <li><strong>Clone the Repository</strong><br/>
    <code>git clone https://github.com/matthewmcgee/Dissertation.git</code><br/>
    <code>cd Dissertation</code>
    </li>
    <li><strong>Frontend Setup (React)</strong><br/>
    Navigate to the frontend directory:<br/>
    <code>cd frontend</code><br/>
    Install dependencies:<br/>
    <code>npm install</code><br/>
    Start the frontend server:<br/>
    <code>npm start</code><br/>
    The frontend will run on <a href="http://localhost:3000">http://localhost:3000</a>.
    </li>
    <li><strong>Backend Setup (Flask)</strong><br/>
    Navigate to the backend directory:<br/>
    <code>cd backend</code><br/>
    Create a virtual environment:<br/>
    <code>python3 -m venv venv</code><br/>
    <code>source venv/bin/activate</code>  # On Windows use <code>venv\Scripts\activate</code><br/>
    Install backend dependencies (stored in <code>requirements.txt</code>):<br/>
    <code>pip install -r requirements.txt</code><br/>
    Set up the MySQL database and make sure the correct credentials are set in your <code>app.py</code>.<br/>
    Run the Flask app:<br/>
    <code>python app.py</code><br/>
    The backend server will run on <a href="http://127.0.0.1:5001">http://127.0.0.1:5001</a>.
    </li>
    <li><strong>Database Setup (MySQL)</strong><br/>
    Create a MySQL database and run the SQL schema provided in the project to set up the required tables.<br/>
    Make sure to configure the MySQL connection details in your <code>app.py</code> file, such as host, user, password, and database.
    </li>
    <li><strong>Testing the Project</strong><br/>
    Open <a href="http://localhost:3000">http://localhost:3000</a> in your browser to view the homepage.<br/>
    Use the login screen to authenticate as a patient or doctor.<br/>
    You can now book, view, and cancel appointments based on your user role.
    </li>
</ol>
