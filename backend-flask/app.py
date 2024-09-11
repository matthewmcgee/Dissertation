from flask import Flask, jsonify, request, session
from flask_cors import CORS
from flask_session import Session
import mysql.connector # type: ignore
from mysql.connector import pooling # type: ignore
import bcrypt

app = Flask(__name__)
# enables Cross-Origin Resource Sharing - allowing the Flask application
# to handle requests from different origins
CORS(app, supports_credentials=True)

# set the port number to run the server on
# have to use 5001, for Mac 5000 is used for an AirPlay server
# fine to deactivate Airplay Server under Settings - Sharing - uncheck Airplay Server
# can use lsof -i :5000 to see processes using port 5000
PORT_NUMBER = 5001

# Configure MySQL details
dbconfig = {
    "host": "localhost",
    "user": "root",
    "password": "root",
    "database": "dissertation",
    "port": "8889",
}

# Create new mySQL connection pool
try:
    db_pool = mysql.connector.pooling.MySQLConnectionPool(
    pool_name="mypool",
    pool_size=10,
    **dbconfig
    )
    print("Database connection established...")
except mysql.connector.Error as err:
    print(f"Error in database connection: {err}")

# Using a secret key for session management
app.secret_key = r"b'm[\r\x14\xe3\x05\x9b\xcc\xea\x8e\xcd\xdaa\xbb\xbe4\xe7\xafLF\xc6/5\xc3'"
app.config['SESSION_TYPE'] = 'filesystem'
Session(app)

# POST request for signing up
@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    firstname = data.get('firstname')
    lastname = data.get('lastname')
    birthday = data.get('birthday')
    phonenumber = data.get('phonenumber')
    email = data.get('email')
    password = data.get('password')
    practice_id = data.get('practice')
    # user role id will always be 1 for patients
    user_role_id = 1

    # Validate data - ensure all fields populated. Return 400 if not
    if not all([firstname, lastname, birthday, phonenumber, email, password, practice_id]):
        print("Missing fields in sign up screen!")
        return jsonify({"message": "All fields are required"}), 400

    # Use bcrypt to hash the password
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

    try:
        conn = db_pool.get_connection()
        cursor = conn.cursor()
        
        # Insert into login table
        cursor.execute(
            "INSERT INTO login (email_address, password, user_role_id) VALUES (%s, %s, %s)",
            (email, hashed_password, user_role_id)
        )
        # Get the ID of the newly inserted login record
        login_id = cursor.lastrowid

        # Insert into patient table
        cursor.execute(
            "INSERT INTO patient (first_name, last_name, date_of_birth, phone_number, login_id, practice_id) "
            "VALUES (%s, %s, %s, %s, %s, %s)",
            (firstname, lastname, birthday, phonenumber, login_id, practice_id)
        )

        # commit the changes now both records have been successfully inserted
        conn.commit()

        return jsonify({"message": "User registered successfully"}), 201
    except mysql.connector.Error as err:
        conn.rollback()  # Rollback in case of error
        print("Signup Error:", err)
        return jsonify({"message": "Error: " + str(err)}), 500
    finally:
        cursor.close()
        conn.close()

# POST request for adding staff
@app.route('/addstaff', methods=['POST'])
def add_staff():
    data = request.get_json()
    title = data.get('title')
    firstname  = data.get('firstname')
    lastname  = data.get('lastname')
    email  = data.get('email')
    password  = data.get('password')
    practice  = data.get('practice')
    medical_staff_role_id  = data.get('medicalStaffRole')

    # user role id will be 3 for admins and 2 for all other medical staff
    if medical_staff_role_id == "5":
        user_role_id = 3
    else:
        user_role_id = 2

    # Validate data - ensure all fields populated. Return 400 if not
    if not all([title, firstname, lastname, email, password, practice, medical_staff_role_id]):
        return jsonify({"message": "All fields are required"}), 400

    # Use bcrypt to hash the password
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

    try:
        conn = db_pool.get_connection()
        cursor = conn.cursor()
        
        # Insert into login table
        cursor.execute(
            "INSERT INTO login (email_address, password, user_role_id) VALUES (%s, %s, %s)",
            (email, hashed_password, user_role_id)
        )
        # Get the ID of the newly inserted login record
        login_id = cursor.lastrowid

        # Insert into medical staff table
        cursor.execute(
            "INSERT INTO medical_staff (title, first_name, last_name, practice_id, medical_staff_role_id, login_id) "
            "VALUES (%s, %s, %s, %s, %s, %s)",
            (title, firstname, lastname, practice, medical_staff_role_id, login_id)
        )

        # commit the changes now both records have been successfully inserted
        conn.commit()

        return jsonify({"message": f"Staff member {lastname} added successfully"}), 201
    except mysql.connector.Error as err:
        conn.rollback()  # Rollback in case of error
        print("Add Staff Error:", err)
        return jsonify({"message": "Error: " + str(err)}), 500
    finally:
        cursor.close()
        conn.close()

# POST request for logging in
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    # ensure email and password have been filled out
    if not email or not password:
        return jsonify({"message": "Email and password are required"}), 400

    try:
        conn = db_pool.get_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM login WHERE email_address = %s", (email,))
        user = cursor.fetchone()

        # use bcrypt to ensure their password matches hashed password in database
        # user['password'] is stored as varbinary (bytes) already, so no need to encode it
        if user and bcrypt.checkpw(password.encode('utf-8'), user['password']):
            # login successful, store the login ID in the session
            session["login_id"] = user["login_id"]
            return jsonify({"message": "Login successful", "login_id": user['login_id']}), 200
        else:
            return jsonify({"message": "Invalid email or password"}), 401
    except mysql.connector.Error as err:
        return jsonify({"message": "Error: " + str(err)}), 500
    finally:
        cursor.close()
        conn.close()

# POST route for logout. 
@app.route('/logout', methods=['POST'])
def logout():
    # clear session information
    session.clear()
    return jsonify({"message": "Logged out successfully"}), 200

# endpoint to check if user is logged in, will be used by frontend
@app.route('/check_session', methods=['GET'])
def check_session():
    login_id = session.get('login_id')
    if login_id:
        return jsonify({"login_id": login_id, "logged_in": True}), 200
    else:
        return jsonify({"logged_in": False}), 200

# GET practice information
@app.route('/practices', methods=["GET"])
def get_practices():
    try:
        conn = db_pool.get_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT practice_id, practice_name, city FROM practice")
        data = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify(data)
    except mysql.connector.Error as err:
        return jsonify({"error": str(err)}), 500

# GET medical staff roles information
@app.route('/medical_staff_roles', methods=["GET"])
def get_medical_staff_roles():
    try:
        conn = db_pool.get_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT medical_staff_role_id, role_name FROM medical_staff_role")
        data = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify(data)
    except mysql.connector.Error as err:
        return jsonify({"error": str(err)}), 500

# loads patient info based on a given login id
@app.route("/patient/<login_id>", methods=["GET"])
def get_patient_info(login_id):
    try:
        conn = db_pool.get_connection()
        cursor = conn.cursor(dictionary=True)
        sql_query = """SELECT patient_id, first_name, last_name, date_of_birth,
                           phone_number, patient.login_id, practice_id, email_address
                       FROM patient
                       LEFT JOIN login
                       ON patient.login_id = login.login_id
                       WHERE patient.login_id = %s
                    """
        cursor.execute(sql_query, (login_id, ))
        data = cursor.fetchone()
        cursor.close()
        conn.close()

        if not data:
            return jsonify({"error" : "Patient not found"}), 404

        return jsonify(data)
    except mysql.connector.Error as err:
        return jsonify({"error": str(err)}), 500

# loads practice info for a given practice id
@app.route('/practice/<practice_id>', methods=['GET'])
def get_practice_by_id(practice_id):
    try:
        conn = db_pool.get_connection()
        cursor = conn.cursor(dictionary=True)
        sql_query = f"SELECT * FROM practice WHERE practice_id = {practice_id}"
        cursor.execute(sql_query)
        data = cursor.fetchone()
        cursor.close()
        conn.close()

        if not data:
            return jsonify({'error': 'Practice not found'}), 404

        return jsonify(data)
    except mysql.connector.Error as err:
        return jsonify({"error": str(err)}), 500

# loads medical staff for a given practice
@app.route('/medical_staff/<practice_id>', methods=['GET'])
def get_medical_staff_by_practice_id(practice_id):
    try:
        conn = db_pool.get_connection()
        cursor = conn.cursor(dictionary=True)
        query = f"""
            SELECT m.medical_staff_id, m.title, m.first_name, m.last_name,
                m.practice_id, m.medical_staff_role_id, r.role_name
            FROM medical_staff m 
            LEFT JOIN medical_staff_role r 
            ON m.medical_staff_role_id = r.medical_staff_role_id
            WHERE m.practice_id = {practice_id}
            AND r.medical_staff_role_id != 5 -- exclude admin
            """
        cursor.execute(query)
        data = cursor.fetchall()
        cursor.close()
        conn.close()

        if not data:
            return jsonify({'error': 'No medical staff found for this practice'}), 404

        return jsonify(data)
    except mysql.connector.Error as err:
        return jsonify({"error": str(err)}), 500

# loads availability for a given medical staff member
@app.route("/availability/<medical_staff_id>", methods=["GET"])
def get_availability_per_staff_member(medical_staff_id):
    try:
        conn = db_pool.get_connection()
        cursor = conn.cursor(dictionary=True)
        query = f"""SELECT av.availability_date,
            TIME_FORMAT(av.start_time, '%H:%i') AS start_time,
            TIME_FORMAT(av.end_time, '%H:%i') AS end_time,
            CASE
                WHEN ap.appointment_id IS NULL
                THEN "Available"
                ELSE "Booked"
            END AS status
            FROM availability av 
            LEFT JOIN appointment ap 
            ON av.medical_staff_id = ap.medical_staff_id
            AND av.availability_date = ap.appointment_date
            AND av.start_time = ap.start_time
            AND av.end_time = av.end_time
            WHERE av.medical_staff_id = {medical_staff_id}
            AND av.availability_date BETWEEN CURDATE() AND CURDATE() + INTERVAL 14 DAY
            ORDER BY av.availability_date ASC, av.start_time ASC
            """
        cursor.execute(query)
        data = cursor.fetchall()
        cursor.close()
        conn.close()

        # return jsonified data
        if data:
            return jsonify(data)
        # important if no data exists, return an empty array (not an error)
        # some staff may have no availability
        else:
            return jsonify([])
        
    except mysql.connector.Error as err:
        return jsonify({"error": str(err)}), 500

# POST request to book an appointment
@app.route("/book_appointment", methods=["POST"])
def book_appointment():
    try:
        data = request.json
        appointment_date = data.get("appointment_date")
        start_time = data.get("start_time")
        end_time = data.get("end_time")
        patient_id = data.get("patient_id")
        medical_staff_id = data.get("medical_staff_id")
        appointment_status_id = data.get("appointment_status_id")

        conn = db_pool.get_connection()
        cursor = conn.cursor()

        query = """
            INSERT INTO appointment (appointment_date, start_time,
            end_time, patient_id, medical_staff_id, appointment_status_id)
            VALUES (%s, %s, %s, %s, %s, %s)
        """
        cursor.execute(query, (appointment_date, start_time,
            end_time, patient_id, medical_staff_id, appointment_status_id))
        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({"message":"Appointment booked successfully"}), 201
    except mysql.connector.Error as err:
        return jsonify({"error": str(err)}), 500

# POST request for updating patient details
@app.route('/update_patient/<login_id>', methods=['POST'])
def update_patient(login_id):
    data = request.get_json()
    first_name = data.get('first_name')
    last_name = data.get('last_name')
    date_of_birth = data.get('date_of_birth')
    phone_number = data.get('phone_number')
    practice_id = data.get('practice_id')
    email = data.get('email')
    password = data.get('password')

    # Ensure all values provided by user
    if not all([first_name, last_name, date_of_birth, phone_number, practice_id, email]):
        return jsonify({"message": "All fields are required"}), 400

    try:
        conn = db_pool.get_connection()
        cursor = conn.cursor()

        # Update patient details in the patient detail
        cursor.execute(
            """
            UPDATE patient 
            SET first_name = %s, last_name = %s, date_of_birth = %s, 
                phone_number = %s, practice_id = %s
            WHERE login_id = %s
            """,
            (first_name, last_name, date_of_birth, phone_number, practice_id, login_id)
        )

        # Check if user wants to update their password (i.e. they provided one)
        if password:
            # Hash the password if provided
            hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
            cursor.execute(
                """
                UPDATE login 
                SET email_address = %s, password = %s
                WHERE login_id = %s
                """,
                (email, hashed_password, login_id)
            )
        else:
            # Update only the email if no new password is provided
            cursor.execute(
                """
                UPDATE login 
                SET email_address = %s
                WHERE login_id = %s
                """,
                (email, login_id)
            )

        # Commit changes
        conn.commit()

        return jsonify({"message": "Patient details updated successfully"}), 200
    except mysql.connector.Error as err:
        conn.rollback()
        print("Update Patient Error:", err)
        return jsonify({"message": "Error: " + str(err)}), 500
    finally:
        cursor.close()
        conn.close()


if __name__ == '__main__':
    print(f"\nRunning Flask server on port {str(PORT_NUMBER)} ...\n")
    app.run(port=PORT_NUMBER, debug=True)
    print("\nFlask server finished....")