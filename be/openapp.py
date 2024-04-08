from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS, cross_origin

import subprocess


app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 50 * 1000 * 1000
cors = CORS(app, origins = ["*"])

LOCALHOST_URL = "127.0.0.1"

@app.route("/api/scanmax", methods=['POST'])
@cross_origin(supports_credentials=True)
def openScanMax():
    # Path to Skype application
    scanmax_path = "/Applications/Skype.app"  # Modify this path if Skype is installed elsewhere

    subprocess.Popen(["open", "-a", scanmax_path])

    return "OK"

if __name__ == '__main__':
    app.run(host=LOCALHOST_URL, port=7999, debug=True)    
    # app.run(host='0.0.0.0', port=8001)