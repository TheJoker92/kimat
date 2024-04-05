from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS, cross_origin

import json
import pysolr
import requests
from werkzeug.routing import BaseConverter

import os
import base64


flaskstaticFolderPath = ""
basePathAsset = ""

with open('.env', 'r') as file:
    # Read all lines from the file and store them in a list
    lines = file.readlines()
    flaskstaticFolderPath = lines[0]
    basePathAsset = lines[1]

import users
import catalogues
import documents


app = Flask(__name__, static_folder=flaskstaticFolderPath)
app.config['MAX_CONTENT_LENGTH'] = 50 * 1000 * 1000
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
    return send_from_directory("browser", path)

@app.route("/api/documents/ocr", methods=['POST'])
def get_ocr():
    print("START OCR")
    
    data = request.json   

    return documents.getOcr(data, basePathAsset)

@app.route("/<ext>/<id>")
def resource_src(ext, id):
    return documents.resource_src(ext, id, basePathAsset)

# Create operation
@app.route('/api/users/create', methods=['POST'])
def create_user():
    print("START CREATE USER")
    data = request.json

    print(data)
    
    return jsonify(users.create_user(data, BASE_URL)), 200

# Read operation
@app.route('/api/users/login', methods=['POST'])
def read_user():
    print("START USER LOGIN")
    data = request.json
    
    return users.read_user(data, BASE_URL)

@app.route('/api/users/getUser', methods=['POST'])
def get_user():
    print("START GET USER")
    data = request.json
    
    return users.get_user(data, BASE_URL)


# Update operation
@app.route('/api/users/update', methods=['PUT'])
def update_user():
    print("START UPDATE USER ")
    data = request.json

    return jsonify(users.get_user(data, BASE_URL)), 200


# Delete operation
@app.route('/users/delete/<id>', methods=['DELETE'])
def delete_user(id):
    try:
        solr.delete(id=id)
        return jsonify({'success': 'User deleted successfully'})
    except Exception as e:
        return jsonify({'error': str(e)}), 200

#CATALOGUES
# Create operation
@app.route('/api/catalogues/add', methods=['POST'])
@cross_origin(supports_credentials=True)
def create_catalogue():
    print("START ADD CATALOGUE")
    data = request.json    
    
    return jsonify(catalogues.create_catalogue(data, BASE_URL)), 200

@app.route('/api/catalogues/delete', methods=['POST'])
def deleteCatalogue():
    print("START DELETE CATALOGUE")
    data = request.json
    
    return catalogues.deleteCatalogue(data, BASE_URL)

@app.route('/api/catalogues/update', methods=['PUT'])
def update_catalogue():
    print("START CATALOGUE UPDATE")
    data = request.json
    
    return jsonify(catalogues.update_catalogue(data, BASE_URL)), 200

@app.route('/api/catalogues/getCatalogues', methods=['POST'])
def getCatalogues():
    print("START GET CATALOGUES")
    data = request.json
    
    return catalogues.getCatalogues(data, BASE_URL)

# Documents operation
# Read operation
@app.route('/api/documents/getDocuments', methods=['POST'])
def getDocuments():
    print("START GET DOCUMENTS")
    data = request.json
    
    return documents.getDocuments(data, BASE_URL)


@app.route('/api/documents/add', methods=['POST'])
@cross_origin(supports_credentials=True)
def create_document():
    print("START ADD DOCUMENT")
    data = request.json
    
    return jsonify(documents.create_document(data, BASE_URL)), 200

@app.route('/api/documents/base64', methods=['POST'])
@cross_origin(supports_credentials=True)
def upload_document():
    print("START UPLOAD DOCUMENT DOCUMENT")
    data = request.json
    
    return jsonify(documents.upload_document(data)), 200

@app.route('/api/documents/base64', methods=['POST'])
@cross_origin(supports_credentials=True)
def massiveUploadFromPapers():
    print("START UPLOAD DOCUMENT DOCUMENT")
    data = request.json
    
    return jsonify(documents.massiveUploadFromPapers(data, BASE_URL)), 200


@app.route('/api/documents/delete', methods=['POST'])
def deleteDocument():
    print("START DELETE DOCUMENT")
    data = request.json
    
    
    return documents.deleteDocument(data, BASE_URL)


# Read operation
@app.route('/api/documents/getDocumentsByDate', methods=['POST'])
def getDocumentsByDate():
    print("START GET DOCUMENTS BY DATE")
    data = request.json
    
    return documents.getDocumentsByDate(data, BASE_URL)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, ssl_context=('cert.pem', 'key.pem'), debug=True)    
    # app.run(host='0.0.0.0', port=8001)