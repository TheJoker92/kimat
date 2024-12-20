from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS, cross_origin

import json
import pysolr
import requests
from werkzeug.routing import BaseConverter

import os
import base64


import utils

import time

flaskstaticFolderPath = ""
basePathAsset = ""

LOGIN_SENDER = ""
PASSWORD_SENDER = ""

with open('.env', 'r') as file:
    # Read all lines from the file and store them in a list
    lines = file.readlines()
    flaskstaticFolderPath = lines[0].replace("\n","")
    basePathAsset = lines[1].replace("\n","")
    LOGIN_SENDER = lines[2].replace("\n","")
    PASSWORD_SENDER = lines[3].replace("\n","")

import users
import catalogues
import dossiers
import documents
import metadata

import emails
import sys

sys.path.append('/home')

AUTHORIZED_TOKEN = {}
SENDED_TOKEN = {}


AUTHORIZED_TOKEN_RECOVER_PASS = {}
SENDED_TOKEN_RECOVER_PASS = {}

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

# @app.route("/")
# def angular():
#     return send_from_directory("browser", "index.html")

@app.route("/assets/<regex('.*\.(js|css|avif|scss|jpeg|json|png)'):path>")
def assets_src(path):
    return send_from_directory("browser/assets", path)

@app.route("/<regex('.*\.(js|css|avif|scss|jpeg|json|png)'):path>")
def angular_src(path):
    return send_from_directory("browser", path)

@app.route("/api/documents/ocr", methods=['POST'])
def get_ocr():
    print("START OCR")
    
    data = request.json   

    return documents.getOcr(data, basePathAsset)

@app.route("/<ext>/<id>", methods=['POST', 'GET'])
def resource_src(ext, id):
    global AUTHORIZED_TOKEN
    global SENDED_TOKEN
    global basePathAsset
    if ext == "pdf":
        try:
            data = request.json

            data["token"] = utils.randomword(6)
            print("SEND EMAIL")
            
            emails.sendTokenEmail(LOGIN_SENDER, PASSWORD_SENDER, data)

            SENDED_TOKEN[data["email"].replace("@", "")] = data["token"]

            print(AUTHORIZED_TOKEN)
            startTime = time.time()
            while(not(data["email"].replace("@", "") in AUTHORIZED_TOKEN.keys()) or 
                  AUTHORIZED_TOKEN[data["email"].replace("@", "")] != data["token"]):
                timer = time.time() - startTime
                if timer > 600:
                    AUTHORIZED_TOKEN[data["email"].replace("@", "")] = utils.randomword(10)
                    return jsonify({"error": "Expired token"}), 500


        except Exception as e:
            print(e)
            return jsonify({"error": True, "msg": e}), 500
        
    AUTHORIZED_TOKEN[data["email"].replace("@", "")] = utils.randomword(10)
    return documents.resource_src(ext, id, basePathAsset)

# Create operation
@app.route('/api/users/create', methods=['POST'])
def create_user():
    print("START CREATE USER")
    data = request.json

    print(data)
    
    return jsonify(users.create_user(data, BASE_URL)), 200

@app.route("/api/users/recoverPass", methods=['POST', 'GET'])
def recoverPass():
    global AUTHORIZED_TOKEN_RECOVER_PASS
    global SENDED_TOKEN_RECOVER_PASS
    global basePathAsset

    try:
        data = request.json

        data["token"] = utils.randomword(6)
        print("SEND EMAIL")
        
        emails.sendTokenEmailChangePsw(LOGIN_SENDER, PASSWORD_SENDER, data)

        SENDED_TOKEN_RECOVER_PASS[data["email"].replace("@", "")] = data["token"]

        print(AUTHORIZED_TOKEN_RECOVER_PASS)
        startTime = time.time()
        # while(not(data["email"].replace("@", "") in AUTHORIZED_TOKEN_RECOVER_PASS.keys()) or 
        #         AUTHORIZED_TOKEN_RECOVER_PASS[data["email"].replace("@", "")] != data["token"]):
        #     timer = time.time() - startTime
        #     if timer > 600:
        #         AUTHORIZED_TOKEN_RECOVER_PASS[data["email"].replace("@", "")] = utils.randomword(10)
        #         return jsonify({"error": "Expired token"}), 500


    except Exception as e:
        return jsonify({"error": True, "msg": e}), 500
    
    # AUTHORIZED_TOKEN_RECOVER_PASS[data["email"].replace("@", "")] = utils.randomword(10)
    return {"statusCode": 200}

@app.route('/api/security/recoverPassSetToken', methods=['POST'])
@cross_origin(supports_credentials=True)
def recoverPassSetToken():
    global AUTHORIZED_TOKEN_RECOVER_PASS
    global SENDED_TOKEN_RECOVER_PASS

    data = request.json

    print(SENDED_TOKEN_RECOVER_PASS[data["email"].replace("@", "")])


    if SENDED_TOKEN_RECOVER_PASS[data["email"].replace("@", "")] == data["token"]:
        AUTHORIZED_TOKEN_RECOVER_PASS = utils.setAuthToken(AUTHORIZED_TOKEN_RECOVER_PASS, data)
        response = jsonify({200: "OK"}), 200

    else:
        response = jsonify({"error": True}), 200
    
    return response

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
@app.route('/api/users/update', methods=['POST'])
def update_user():
    print("START UPDATE USER ")
    data = request.json

    return jsonify(users.update_user(data, BASE_URL)), 200


@app.route('/api/users/updateUserPass', methods=['POST'])
def update_user_pass():
    print("START UPDATE USER ")
    data = request.json

    return jsonify(users.updateUserPass(data, BASE_URL)), 200

# Delete operation
@app.route('/users/delete/<id>', methods=['DELETE'])
def delete_user(id):
    try:
        solr.delete(id=id)
        return jsonify({'success': 'User deleted successfully'})
    except Exception as e:
        return jsonify({'error': str(e)}), 200



#DOSSIERS
# Create operation
@app.route('/api/dossiers/add', methods=['POST'])
@cross_origin(supports_credentials=True)
def create_dossier():
    print("START ADD CATALOGUE")
    data = request.json    
    
    return jsonify(dossiers.create_dossier(data, BASE_URL)), 200

@app.route('/api/dossiers/delete', methods=['POST'])
def deleteDossier():
    print("START DELETE CATALOGUE")
    data = request.json
    
    return dossiers.delete_dossier(data, BASE_URL)

@app.route('/api/dossiers/update', methods=['PUT'])
def update_dossier():
    print("START CATALOGUE UPDATE")
    data = request.json
    
    return jsonify(dossiers.update_dossier(data, BASE_URL)), 200

@app.route('/api/dossiers/getDossiers', methods=['POST'])
def getDossiers():
    print("START GET CATALOGUES")
    data = request.json
    
    return dossiers.getDossiers(data, BASE_URL)

#CATALOGUE
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
    
    return catalogues.delete_catalogue(data, BASE_URL)

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
@cross_origin(supports_credentials=True)
def deleteDocument():
    print("START DELETE DOCUMENT")
    data = request.json
    
    return documents.deleteDocument(data, BASE_URL)


# Read operation
@app.route('/api/documents/getDocumentsByDate', methods=['POST'])
@cross_origin(supports_credentials=True)
def getDocumentsByDate():
    print("START GET DOCUMENTS BY DATE")
    data = request.json
    
    return documents.getDocumentsByDate(data, BASE_URL)

# Read operation
@app.route('/api/documents/getDocumentById', methods=['POST'])
@cross_origin(supports_credentials=True)
def getDocumentsById():
    print("START GET DOCUMENTS BY DATE")
    data = request.json
    
    return jsonify(documents.getDocumentById(data["id"], BASE_URL)), 200

# SECURITY
@app.route('/api/security/setAuthorizedToken', methods=['POST'])
@cross_origin(supports_credentials=True)
def setAuthorizedToken():
    global AUTHORIZED_TOKEN
    global SENDED_TOKEN

    data = request.json


    if SENDED_TOKEN[data["email"].replace("@", "")] == data["token"]:
        AUTHORIZED_TOKEN = utils.setAuthToken(AUTHORIZED_TOKEN, data)
        response = jsonify({200: "OK"}), 200

    else:
        response = jsonify({"error": True}), 200
    
    return response

# SECURITY
@app.route('/api/metadata/getMetadata', methods=['POST'])
@cross_origin(supports_credentials=True)
def getMetadata():
    global AUTHORIZED_TOKEN
    global SENDED_TOKEN

    try:
        data = request.json

        data["token"] = utils.randomword(6)
        print("SEND EMAIL")
        
        emails.sendTokenEmail(LOGIN_SENDER, PASSWORD_SENDER, data)

        SENDED_TOKEN[data["email"].replace("@", "")] = data["token"]

        print(AUTHORIZED_TOKEN)
        startTime = time.time()
        while(not(data["email"].replace("@", "") in AUTHORIZED_TOKEN.keys()) or 
                AUTHORIZED_TOKEN[data["email"].replace("@", "")] != data["token"]):
            timer = time.time() - startTime
            if timer > 600:
                AUTHORIZED_TOKEN[data["email"].replace("@", "")] = utils.randomword(10)
                return jsonify({"error": "Expired token"}), 500

    except Exception as e:
        return jsonify({"error": True, "msg": e}), 500
    
    AUTHORIZED_TOKEN[data["email"].replace("@", "")] = utils.randomword(10)

    return metadata.parseToXml(data.document)




if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, ssl_context=('cert.pem', 'key.pem'))    
    # app.run(host='0.0.0.0', port=8001)