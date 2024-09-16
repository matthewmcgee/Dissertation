GP Appointment Booking and Chatbot Website
This project is a web-based system designed to allow users to book GP appointments and receive medical advice via a chatbot. It includes functionality for patients and medical staff, supporting appointment scheduling, management, and access to previous appointments. The backend is built using Flask, which provides a set of APIs, and the frontend is developed using React.js.

Features
Patient functionality:
Book and manage appointments.
View upcoming and previous appointments.
Get medical advice through a chatbot.

Doctor functionality:
View and manage upcoming and previous appointments.
Cancel patient appointments.

Project Structure
Frontend: React.js (Handles user interface, appointment display, and interaction with the backend)
React components include managing appointments, user role validation, and medical advice chatbot.
Backend: Flask API (Handles requests for appointments, user data, and database interactions)
APIs to fetch and manage appointments.
User management and role-based access control for patients and staff.
Database: MySQL (Stores user data, appointments, and medical information)

APIs
The backend Flask APIs handle the following:
Retrieve upcoming and previous appointments for both patients and medical staff.
Cancel appointments.
Fetch user details based on login credentials.
Get medical advice for patients using a chatbot.

Prerequisites
To run the project locally, you'll need the following:
Node.js (for the React frontend)
Python 3.x (for the Flask backend)
MySQL (for the database)
Install dependencies for both frontend and backend.

Instructions to Run
1. Clone the Repository
git clone https://github.com/matthewmcgee/Dissertation.git
cd Dissertation
2. Frontend Setup (React)
Navigate to the frontend directory:
cd frontend

Install dependencies:
npm install
Start the frontend server:
npm start

The frontend will run on http://localhost:3000.

3. Backend Setup (Flask)
Navigate to the backend directory:
cd backend

Create a virtual environment:
python3 -m venv venv
source venv/bin/activate  # On Windows use venv\Scripts\activate

Install backend dependencies (stored in requirements.txt):
pip install -r requirements.txt

Set up the MySQL database and make sure the correct credentials are set in your app.py.

Run the Flask app:
python app.py

The backend server will run on http://127.0.0.1:5001.

4. Database Setup (MySQL)
Create a MySQL database and run the SQL schema provided in the project to set up the required tables.
Make sure to configure the MySQL connection details in your app.py file, such as host, user, password, and database.

5. Testing the Project
Open http://localhost:3000 in your browser to view the homepage.
Use the login screen to authenticate as a patient or doctor.
You can now book, view, and cancel appointments based on your user role.
