from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS, cross_origin

import json
import pysolr
import requests
from werkzeug.routing import BaseConverter

import os
from datetime import datetime
import base64
import PyPDF2

import pytesseract
from pdf2image import convert_from_path
import nltk
nltk.download('punkt')
nltk.download('averaged_perceptron_tagger')
nltk.download('maxent_ne_chunker')
nltk.download('words')
nltk.download('universal_tagset')
app = Flask(__name__, static_folder="/home/alessandro/kimat/be/browser")
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

    print(data)
    id = data["id"]

    file_path_noext = "/home/alessandro/kimat/be/folders/" + id + "/" + id  
    if (os.path.exists(file_path_noext + ".txt")):
        with open(file_path_noext + ".txt", 'r') as theFile:
            text = theFile.read()
            theFile.close()
    else:
        text = extract_text_from_pdf(file_path_noext + ".pdf")
        with open(file_path_noext  + ".txt", 'w') as theFile:
            theFile.write(text)
            theFile.close()
    
        
    # Tokenize the text into sentences
    sentences = nltk.sent_tokenize(text)

    # Iterate through each sentence
    for sentence in sentences:
        # Tokenize words in the sentence
        words = nltk.word_tokenize(sentence)
        
        # Perform POS tagging on the words
        tagged_words = nltk.pos_tag(words)
        
        # Perform Named Entity Recognition (NER)
        named_entities = nltk.ne_chunk(tagged_words)
        
        # Print named entities
        for entity in named_entities:
            if hasattr(entity, 'label'):
                print("Entity:", " ".join(c[0] for c in entity.leaves()), "Type:", entity.label())

    return {
        "text": text,
        "ocr": {
                # "tokens": tokens,
                # "tagged": tagged,
                "namedEntities": named_entities
            }
    }

@app.route("/<ext>/<id>")
def resource_src(ext, id):
    file_path = "/home/alessandro/kimat/be/folders/" + id + "/" + id + "." + ext

    result = {}
    numOfPages = 0
    if (os.path.exists(file_path)):
        with open(file_path, "rb") as file:
            encoded_string = base64.b64encode(file.read())
            pdfReader = PyPDF2.PdfReader(file)
            numOfPages = len(pdfReader.pages)
            file.close()

        prefix = "data:[<mediatype>];base64,"

        if ext == "pdf":
            prefix = prefix.replace("[<mediatype>]", "application/pdf")


        result = {
            "base64": prefix + encoded_string.decode('utf-8'),
            "numOfPages": numOfPages
        }
    else:
        result = {
            "error": True
        }
    return result

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
@app.route('/api/dossiers/add', methods=['POST'])
@cross_origin(supports_credentials=True)
def create_dossier():
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

            r = requests.post(BASE_URL + "/dossiers/update?_=1710697938875&commitWithin=1000&overwrite=true&wt=json", json=[data], verify=False)
            print(data)
            return response
        except Exception as e:
            response = {
                "message": "",
                "error": str(e),
                "code": 500
            }
    
    return jsonify(response), 500


# Documents operation

@app.route('/api/documents/add', methods=['POST'])
@cross_origin(supports_credentials=True)
def create_document():
    print("START DOCUMENT ADD")
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

            print(data)
            response = {
                "message": "DATA ADDED",
                "error": "",
                "code": 200
            }

            r = requests.post(BASE_URL + "/documents/update?_=1710697938875&commitWithin=1000&overwrite=true&wt=json", json=[data], verify=False)

            print(r.json())

            return response
        except Exception as e:

            print(e)
            response = {
                "message": "",
                "error": str(e),
                "code": 500
            }
    
    return jsonify(response), 500

@app.route('/api/documents/base64', methods=['POST'])
@cross_origin(supports_credentials=True)
def upload_document():
    print("START DOCUMENT ADD")
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

            print(data)
            response = {
                "message": "DATA ADDED",
                "error": "",
                "code": 200
            }


            if (data["attachments"] and len(json.loads(data["attachments"]))):
                attachmentsObj = json.loads(data["attachments"])
                                            
                for attachment in attachmentsObj:
                    if len(attachment.keys()):
                        base_folders = "folders"
                        full_folder_path = base_folders + "/" + data["id"]
                        full_filename_path = full_folder_path + "/" + data["id"] + "." + attachment["ext"]
                        if not(os.path.exists(full_folder_path)):
                            os.mkdir(full_folder_path) 

                        if (os.path.exists(full_filename_path)):
                            os.rename(full_filename_path, full_folder_path + "/" + data["name"] + "_" + str(datetime.today().timestamp()))

                        with open(full_filename_path, 'wb') as theFile:
                            theFile.write(base64.b64decode(attachment["base64"]))

                        
                        data["attachments"] = full_filename_path
            

            
            return response
        except Exception as e:

            print(e)
            response = {
                "message": "",
                "error": str(e),
                "code": 500
            }
    
    return jsonify(response), 500



# Read operation
@app.route('/api/dossiers/getDossiers', methods=['POST'])
def getDossiers():
    print("START GET CATALOGUES")
    data = request.json
    
    response = {}
    
    try:
        response = {
            "message": "DATA ACCESS",
            "error": "",
            "code": 200
        }

        print(data)

        query = ""
        if "title" in data.keys():
            if " " in data["title"]:
                data["title"] = "(" + data["title"] + ")"
            query += "title%3A" + data["title"].replace(" ","%20") + "%0A"
            print("A")
        else:
            query += "*%3A*%0A"
        
        if "topics" in data.keys():
            query += "topics%3A%22" + data["topics"] + "%22"
        else:
            query += "*%3A*"

        # https://127.0.0.1:8984/solr/dossiers/select?indent=true&q.op=AND&q=title%3A*di%20*%0A*%3A*&useParams=
        # https://127.0.0.1:8984/solr/dossiers/select?indent=true&q.op=AND&q=title%3A%22*%22di*%22%0A*%3A*&useParams=
        print(BASE_URL + "/dossiers/select?indent=true&q.op=AND&q=" + query + "&sort=id+asc&useParams=")

        # solr.add([data])
        responseRaw = requests.get(BASE_URL + "/dossiers/select?indent=true&q.op=AND&q=" + query + "&useParams=", verify=False)
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

@app.route('/api/dossiers/update', methods=['PUT'])
def update_dossier():
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

            r = requests.post(BASE_URL + "/dossiers/update?_=1710697938875&commitWithin=1000&overwrite=true&wt=json", json=[data], verify=False)
            print(f"Status Code: {r.status_code}, Response: {r.json()}")
        except Exception as e:
            response = {
                "message": "",
                "error": str(e),
                "code": 500
            }
    
    return jsonify(response), 500

@app.route('/api/dossiers/delete', methods=['POST'])
def deleteDossier():
    print("START DELETE DOCUMENT")
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
            responseRaw = requests.post(BASE_URL + "/dossiers/update?_=1710934023202&commitWithin=1000&overwrite=true&wt=json", headers=headers, data=payload, verify=False)

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

# Read operation
@app.route('/api/documents/getDocuments', methods=['POST'])
def getDocuments():
    print("START GET DOCUMENTS")
    data = request.json
    
    response = {}
    
    try:
        response = {
            "message": "DATA ACCESS",
            "error": "",
            "code": 200
        }

        # solr.add([data])

        query = "parentId%3A" + data["parentId"]
        if "name" in data.keys():
            if " " in data["name"]:
                data["name"] = "(" + data["name"] + ")"
            query += "%2C%0Aname%3A" + data["name"].replace(" ","%20") + "%0A"

        if "topics" in data.keys():
            query += "topics%3A%22" + data["topics"] + "%22"

        print(BASE_URL + "/documents/select?indent=true&q.op=AND&q=" + query + "&useParams=")
        

        # https://127.0.0.1:8984/solr/dossiers/select?indent=true&q.op=AND&q=title%3A*di%20*%0A*%3A*&useParams=
        # https://127.0.0.1:8984/solr/dossiers/select?indent=true&q.op=AND&q=title%3A%22*%22di*%22%0A*%3A*&useParams=
        
        responseRaw = requests.get(BASE_URL + "/documents/select?indent=true&q.op=AND&q=" + query + "&sort=id+asc&useParams=", verify=False)
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


@app.route('/api/documents/delete', methods=['POST'])
def deleteDocument():
    print("START DELETE DOCUMENT")
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
            responseRaw = requests.post(BASE_URL + "/documents/update?_=1710934023202&commitWithin=1000&overwrite=true&wt=json", headers=headers, data=payload, verify=False)

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


def extract_text_from_pdf(pdf_path):
    # Convert PDF to image
    pages = convert_from_path(pdf_path, 500)
     
    # Extract text from each page using Tesseract OCR
    text_data = ''
    for page in pages:
        text = pytesseract.image_to_string(page)
        text_data += text + '\n'
     
    # Return the text data
    return text_data

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, ssl_context=('cert.pem', 'key.pem'))    
    # app.run(host='0.0.0.0', port=8001)