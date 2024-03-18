from flask import Flask, request, jsonify, send_from_directory

import pysolr
import requests
from werkzeug.routing import BaseConverter

app = Flask(__name__, static_folder="/Users/ADMIN/Desktop/projects/dgta/browser")

SOLR_URL = "127.0.0.1"
SOLR_PORT = "8984"
# Initialize Solr connection
# solr = pysolr.Solr('https://' + SOLR_URL + ':' + SOLR_PORT + '/solr', always_commit=True, verify=False)
BASE_URL = 'https://' + SOLR_URL + ':' + SOLR_PORT + '/solr'

class RegexConverter(BaseConverter):
    def __init__(self, url_map, *items):
        super(RegexConverter, self).__init__(url_map)
        self.regex = items[0]


app.url_map.converters['regex'] = RegexConverter

@app.route("/")
def angular():
    return send_from_directory("browser", "index.html")

@app.route("/<regex('.*\.(js|css|avif|scss|jpeg|gif)'):path>")
def angular_src(path):
    print(path)
    return send_from_directory("browser", path)

# Create operation
@app.route('/users/create', methods=['POST'])
def create_user():
    print("START USER CREATE")
    data = request.json

    print(data)
    
    response = {}
    if not data:
        response = {
            "message": "",
            "error": 'No data provided',
            "code": 400
        }
    else:
        try:
            response = {
                "message": "DATA ADDED",
                "error": "",
                "code": 200
            }

            # solr.add([data])

            r = requests.post(BASE_URL + "/users/update?_=1710697938875&commitWithin=1000&overwrite=true&wt=json", json=[data], verify=False)
            print(f"Status Code: {r.status_code}, Response: {r.json()}")
        except Exception as e:
            response = {
                "message": "",
                "error": str(e),
                "code": 500
            }
    
    return jsonify(response), 500


# Read operation
@app.route('/users/read/<id>', methods=['GET'])
def read_user(id):
    try:
        result = solr.search(f'id:{id}')
        if len(result) == 0:
            return jsonify({'error': 'User not found'}), 404
        return jsonify(result.docs[0])
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# Update operation
@app.route('/users/update/<id>', methods=['PUT'])
def update_user(id):
    data = request.json
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    
    try:
        solr.delete(id=id)
        solr.add([data])
        return jsonify({'success': 'User updated successfully'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# Delete operation
@app.route('/users/delete/<id>', methods=['DELETE'])
def delete_user(id):
    try:
        solr.delete(id=id)
        return jsonify({'success': 'User deleted successfully'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, ssl_context=('cert.pem', 'key.pem'))
