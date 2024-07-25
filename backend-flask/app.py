from flask import Flask, jsonify, request, session
from flask_cors import CORS
from flask_session import Session
import mysql.connector
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
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="root",
    database="dissertation",
    port="8889"
)

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

    # Validate data - ensure all fields populated. Return 400 if not
    if not all([firstname, lastname, birthday, phonenumber, email, password, practice_id]):
        print("Missing fields in sign up screen!")
        return jsonify({"message": "All fields are required"}), 400

    # Use bcrypt to hash the password
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

    try:
        cursor = db.cursor()
        
        # Insert into login table
        cursor.execute(
            "INSERT INTO login (email_address, password) VALUES (%s, %s)",
            (email, hashed_password)
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
        db.commit()

        return jsonify({"message": "User registered successfully"}), 201
    except mysql.connector.Error as err:
        db.rollback()  # Rollback in case of error
        return jsonify({"message": "Error: " + str(err)}), 500
    finally:
        cursor.close()

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
        cursor = db.cursor(dictionary=True)
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
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT practice_id, practice_name, city FROM practice")
    data = cursor.fetchall()
    return jsonify(data)


if __name__ == '__main__':
    print(f"\nRunning Flask server on port {str(PORT_NUMBER)} ...\n")
    app.run(port=PORT_NUMBER, debug=True)
    print("\nFlask server finished....")