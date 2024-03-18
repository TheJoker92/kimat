from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS, cross_origin

import json
import pysolr
import requests
from werkzeug.routing import BaseConverter

app = Flask(__name__, static_folder="/Users/ADMIN/Desktop/projects/dgta/browser")
cors = CORS(app, origins = ["*"])

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

@app.route("/<regex('.*\.(js|css|avif|scss|jpeg|json)'):path>")
def angular_src(path):
    print(path)
    return send_from_directory("browser", path)

# Create operation
@app.route('/api/users/create', methods=['POST'])
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
            return r.json()
        except Exception as e:
            response = {
                "message": "",
                "error": str(e),
                "code": 500
            }
    
    return jsonify(response), 500


# Read operation
@app.route('/api/users/login', methods=['POST'])
def read_user():
    print("START USER LOGIN")
    data = request.json
    
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
                "message": "DATA ACCESS",
                "error": "",
                "code": 200
            }

            # solr.add([data])
            responseRaw = requests.get(BASE_URL + "/users/select?indent=true&q.op=OR&q=emailqry%3A%22" + data["emailqry"] + "%22&useParams=", verify=False)

            # Decode the content from bytes to string and then parse as JSON
            response_json = json.loads(responseRaw.content.decode('utf-8'))
            responseRaw = response_json.get('response', {}).get('docs', [])
            # Now you can access response_docs as a list containing the documents
            # Do whatever you need to do with response_docs


            if len(responseRaw) > 0:
                if responseRaw[0]["password"][0] == data["password"]:
                    response = {
                        "email": responseRaw[0]["email"][0],
                        "password": responseRaw[0]["password"][0],
                        "firstName": responseRaw[0]["firstName"][0],
                        "lastName": responseRaw[0]["lastName"][0],
                        "role": responseRaw[0]["role"][0]
                    }
                else:
                    response = {
                    "message": "",
                    "error": "password mismatch",
                    "code": 502
                }
            else:

                response = {
                    "message": "",
                    "error": "NO USER",
                    "code": 501
                }

        except Exception as e:
            response = {
                "message": "",
                "error": str(e),
                "code": 500
            }
    
    return response


# Update operation
@app.route('/api/users/update', methods=['PUT'])
def update_user():
    print("START USER UPDATE")
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
                "message": "DATA UPDATED",
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