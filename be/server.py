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
                        "id": responseRaw[0]["id"],
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

@app.route('/api/users/getUser', methods=['POST'])
def get_user():
    print("START GET USER")
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
            responseRaw = requests.get(BASE_URL + "/users/select?indent=true&q.op=OR&q=*%3A*&useParams=", verify=False)

            # Decode the content from bytes to string and then parse as JSON
            response_json = json.loads(responseRaw.content.decode('utf-8'))
            usersRaw = response_json.get('response', {}).get('docs', [])

            users = []

            if len(usersRaw) > 0:
                for userRaw in usersRaw:
                    print(userRaw)
                    user = { }

                    keysRaw = list(userRaw.keys())
                    for keyRaw in keysRaw:

                        if keyRaw in ["id", "_version_"]:
                            user[keyRaw] = userRaw[keyRaw]
                        else:
                            user[keyRaw] = userRaw[keyRaw][0]
                    
                    users.append(user)
        
            response = {
                "users": users
            }
            # Now you can access response_docs as a list containing the documents
            # Do whatever you need to do with response_docs

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


# Create operation
@app.route('/api/catalogues/add', methods=['POST'])
@cross_origin(supports_credentials=True)
def create_catalogue():
    print("START CATALOGUE ADD")
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

            r = requests.post(BASE_URL + "/catalogues/update?_=1710697938875&commitWithin=1000&overwrite=true&wt=json", json=[data], verify=False)
            print(data)
            return response
        except Exception as e:
            response = {
                "message": "",
                "error": str(e),
                "code": 500
            }
    
    return jsonify(response), 500


# Read operation
@app.route('/api/catalogues/getCatalogues', methods=['GET'])
def getCatalogues():
    print("START USER LOGIN")
    data = request.json
    
    response = {}
    
    try:
        response = {
            "message": "DATA ACCESS",
            "error": "",
            "code": 200
        }

        # solr.add([data])
        responseRaw = requests.get(BASE_URL + "/catalogues/select?indent=true&q.op=OR&q=*%3A*&useParams=", verify=False)
        print(responseRaw)
        # Decode the content from bytes to string and then parse as JSON
        response_json = json.loads(responseRaw.content.decode('utf-8'))
        responseRaw = response_json.get('response', {}).get('docs', [])
        # Now you can access response_docs as a list containing the documents
        # Do whatever you need to do with response_docs


        
        documents = []
        if len(responseRaw) > 0:
            for documentRaw in responseRaw:
                document = { }

                keysRaw = list(documentRaw.keys())
                for keyRaw in keysRaw:

                    if keyRaw in ["id", "_version_"]:
                        document[keyRaw] = documentRaw[keyRaw]
                    else:
                        document[keyRaw] = documentRaw[keyRaw][0].replace("\\", "")
                
                documents.append(document)
        
        response = {
            "documents": documents
        }
    except Exception as e:
        response = {
            "message": "",
            "error": str(e),
            "code": 500
        }
    
    return response

@app.route('/api/catalogues/update', methods=['PUT'])
def update_catalogue():
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

            r = requests.post(BASE_URL + "/catalogues/update?_=1710697938875&commitWithin=1000&overwrite=true&wt=json", json=[data], verify=False)
            print(f"Status Code: {r.status_code}, Response: {r.json()}")
        except Exception as e:
            response = {
                "message": "",
                "error": str(e),
                "code": 500
            }
    
    return jsonify(response), 500

@app.route('/api/catalogues/delete', methods=['POST'])
def deleteCatalogue():
    print("START GET USER")
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
                "message": "DATA REMOVED",
                "error": "",
                "code": 200
            }

            payload = "<delete><query>id:\"" + data["id"]+ "\"</query></delete>"

            # solr.add([data])
            headers = {'Content-type': 'application/xml'}
            responseRaw = requests.post(BASE_URL + "/catalogues/update?_=1710934023202&commitWithin=1000&overwrite=true&wt=json", headers=headers, data=payload, verify=False)

            print(responseRaw.content)
            # Now you can access response_docs as a list containing the documents
            # Do whatever you need to do with response_docs

        except Exception as e:
            response = {
                "message": "",
                "error": str(e),
                "code": 500
            }
    
    return response



if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, ssl_context=('cert.pem', 'key.pem'))