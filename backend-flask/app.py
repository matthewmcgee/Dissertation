from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
# enables Cross-Origin Resource Sharing - allowing the Flask application
# to handle requests from different origins
CORS(app)

@app.route('/api/data', methods=['GET'])
def get_data():
    return jsonify({'message': 'Hello from Flask!'})

if __name__ == '__main__':
    print("\nRunning Flask server...\n")
    # have to use 5001, for Mac 5000 is used for an AirPlay server
    # fine to deactivate Airplay Server under Settings - Sharing - uncheck Airplay Server
    # can use lsof -i :5000 to see processes using port 5000
    app.run(port=5001, debug=True)
    print("\nFlask server finished....")