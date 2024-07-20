from flask import Flask, jsonify, request
from flask_cors import CORS
import mysql.connector
import bcrypt

app = Flask(__name__)
# enables Cross-Origin Resource Sharing - allowing the Flask application
# to handle requests from different origins
CORS(app)

# Configure MySQL details
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="root",
    database="dissertation",
    port="8889"
)

@app.route('/api/data', methods=['GET'])
def get_data():
    # return jsonify({'message': 'Hello from Flask!'})
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM patient")
    data = cursor.fetchall()
    return jsonify(data)

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

    # Validate data - ensure all fields populated. Return 400 if not
    if not all([firstname, lastname, birthday, phonenumber, email, password]):
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
            "INSERT INTO patient (first_name, last_name, date_of_birth, phone_number, login_id) "
            "VALUES (%s, %s, %s, %s, %s)",
            (firstname, lastname, birthday, phonenumber, login_id)
        )

        # commit the changes now both records have been successfully inserted
        db.commit()
        return jsonify({"message": "User registered successfully"}), 201
    except mysql.connector.Error as err:
        db.rollback()  # Rollback in case of error
        return jsonify({"message": "Error: " + str(err)}), 500
    finally:
        cursor.close()

if __name__ == '__main__':
    print("\nRunning Flask server...\n")
    # have to use 5001, for Mac 5000 is used for an AirPlay server
    # fine to deactivate Airplay Server under Settings - Sharing - uncheck Airplay Server
    # can use lsof -i :5000 to see processes using port 5000
    app.run(port=5001, debug=True)
    print("\nFlask server finished....")