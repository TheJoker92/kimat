import requests # type: ignore
import json

import os

import base64
from datetime import datetime

import PyPDF2 # type: ignore

import pytesseract # type: ignore
from pdf2image import convert_from_path # type: ignore
import nltk # type: ignore
nltk.download('punkt')
nltk.download('averaged_perceptron_tagger')
nltk.download('maxent_ne_chunker')
nltk.download('words')
nltk.download('universal_tagset')

import re




def create_document(data, BASE_URL):
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
    
    return response

def getDocuments(data, BASE_URL):
    response = {}
    
    try:
        response = {
            "message": "DATA ACCESS",
            "error": "",
            "code": 200
        }

        # solr.add([data])

        query = "parentId%3A" + data["parentId"] + "%0A"
        if "name" in data.keys():
            if " " in data["name"]:
                data["name"] = "(" + data["name"] + ")"
            query += "name%3A(" + data["name"].replace(" ","%20") + ")"
            print("A")
        
        if "topics" in data.keys():
            query += "topics%3A(" + data["topics"] + ")"
        

        print(BASE_URL + "/documents/select?indent=true&q.op=AND&q=" + query + "&sort=name_str%20asc&useParams=")
        

        # select?fq=id%3A3*&fq=name%3ADelibera0*&indent=true&q.op=AND&q=parentId%3A74c3ff78-ee81-4786-ad88-96feb022c926&useParams=
        
        responseRaw = requests.get(BASE_URL + "/documents/select?indent=true&q.op=AND&q=" + query + "&sort=name_str%20asc&useParams=", verify=False)
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

                    if keyRaw in ["id", "_version_", "deliberationDate"]:
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

def upload_document(data):
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
                            theFile.close()

                        
                        data["attachments"] = full_filename_path
            

            
            return response
        except Exception as e:

            print(e)
            response = {
                "message": "",
                "error": str(e),
                "code": 500
            }
    
    return response


def getOcr(data, basePathAsset):
    try:

        print(data)
        id = data["id"]

        file_path_noext = basePathAsset + id + "/" + id  
        if (os.path.exists(file_path_noext + ".txt")):
            with open(file_path_noext + ".txt", 'r') as theFile:
                text = theFile.read()
                theFile.close()
        else:
            text = extract_text_from_pdf(file_path_noext + ".pdf")
            with open(file_path_noext  + ".txt", 'w') as theFile:
                theFile.write(text)
                theFile.close()

    except Exception:
        print(Exception)
    
        
    # # Tokenize the text into sentences
    # sentences = nltk.sent_tokenize(text)

    # # Iterate through each sentence
    # for sentence in sentences:
    #     # Tokenize words in the sentence
    #     words = nltk.word_tokenize(sentence)
        
    #     # Perform POS tagging on the words
    #     tagged_words = nltk.pos_tag(words)
        
    #     # Perform Named Entity Recognition (NER)
    #     named_entities = nltk.ne_chunk(tagged_words)
        
    #     # Print named entities
    #     for entity in named_entities:
    #         if hasattr(entity, 'label'):
    #             print("Entity:", " ".join(c[0] for c in entity.leaves()), "Type:", entity.label())

    return {
        "text": text,
        # "ocr": {
        #         # "tokens": tokens,
        #         # "tagged": tagged,
        #         "namedEntities": named_entities
        #     }
    }

def extract_text_from_pdf(pdf_path):
    # Convert PDF to image
    pages = convert_from_path(pdf_path,400)
     
    # Extract text from each page using Tesseract OCR
    text_data = ''
    for page in pages:
        text = pytesseract.image_to_string(page)
        text_data += text + '\n'
     
    # Return the text data
    return text_data


def resource_src(ext, id, basePathAsset):
    file_path = basePathAsset + "/" + id + "/" + id + "." + ext
    tmp_folder_path = basePathAsset + id + "/tmp"
    
    
    result = {}
    numOfPages = 0
    print("FILE PATH")
    print(file_path)
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

    elif (os.path.exists(tmp_folder_path)):
        merger = PyPDF2.PdfMerger()
        
        for path in sort_alphanumeric_list(os.listdir(tmp_folder_path)):
            merger.append(tmp_folder_path + "/" + path)
        merger.write(file_path)
        merger.close()

        data = {
            "id": id
        }
        getOcr(data, basePathAsset)
    else:
        result = {
            "error": True
        }
    return result

def deleteDocument(data, BASE_URL):
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

def getDocumentsByDate(data, BASE_URL):    
    response = {}
    
    try:
        response = {
            "message": "DATA ACCESS",
            "error": "",
            "code": 200
        }

        # solr.add([data])

        
        documents = []
        for date in data["dates"]:
            query = "parentId%3A" + data["parentId"] + "%0A"
            query += "deliberationDate%3Aa" + date
        

            print(BASE_URL + "/documents/select?indent=true&q.op=AND&q=" + query + "&sort=name_str%20asc&useParams=")
            

            # select?fq=id%3A3*&fq=name%3ADelibera0*&indent=true&q.op=AND&q=parentId%3A74c3ff78-ee81-4786-ad88-96feb022c926&useParams=
            
            responseRaw = requests.get(BASE_URL + "/documents/select?indent=true&q.op=AND&q=" + query + "&sort=name_str%20asc&useParams=", verify=False)
            print(responseRaw)
            # Decode the content from bytes to string and then parse as JSON
            response_json = json.loads(responseRaw.content.decode('utf-8'))
            responseRaw = response_json.get('response', {}).get('docs', [])
            # Now you can access response_docs as a list containing the documents
            # Do whatever you need to do with response_docs


            
            if len(responseRaw) > 0:
                for documentRaw in responseRaw:
                    document = { }

                    keysRaw = list(documentRaw.keys())
                    for keyRaw in keysRaw:

                        if keyRaw in ["id", "_version_", "deliberationDate"]:
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

def massiveUploadFromPapers(data, BASE_URL):

    response = {}

    try:

        if (data["attachments"] and len(json.loads(data["attachments"]))):
            attachmentsObj = json.loads(data["attachments"])
            base_folders = "folders"
            full_folder_path = base_folders + "/tmp/" + data["parentId"]

            index = 0          
            for attachment in attachmentsObj:
                if len(attachment.keys()):
                    
                    full_filename_path = full_folder_path + "/" + data["parentId"] + "/" + data["id"] + "_" + index + "_" + "." + attachment["ext"]
                    if not(os.path.exists(full_folder_path)):
                        os.mkdir(full_folder_path) 

                    if (os.path.exists(full_filename_path)):
                        os.rename(full_filename_path, full_folder_path + "/" + data["parentId"] + "_" + str(datetime.today().timestamp()))

                    with open(full_filename_path, 'wb') as theFile:
                        theFile.write(base64.b64decode(attachment["base64"]))

                    
                    data["attachments"] = full_filename_path

            file_path_noext = full_folder_path + "/" + data["parentId"]
            text = extract_massive_text_from_pdf(file_path_noext + ".pdf", BASE_URL)
            with open(file_path_noext  + ".txt", 'w') as theFile:
                theFile.write(text)
                theFile.close()
    except Exception as e:
        response = {
            "message": "",
            "error": str(e),
            "code": 500
        }
    
    return response

def extract_massive_text_from_pdf(pdf_path, BASE_URL):
    # Convert PDF to image
    pages = convert_from_path(pdf_path,400)
     
    # Extract text from each page using Tesseract OCR
    text_data = ''

    index = 0

    idDocument = ""
    document = {}

    attachmentBase64 = ""
    for page in pages:
        text = pytesseract.image_to_string(page)

        if ('idDocument' in text):
            if index > 0:
            
                base_folders = "folders"
                full_folder_path = base_folders + "/" + document["id"]
                full_filename_path = full_folder_path + "/" + document["id"] + ".pdf"
                if not(os.path.exists(full_folder_path)):
                    os.mkdir(full_folder_path) 

                if (os.path.exists(full_filename_path)):
                    os.rename(full_filename_path, full_folder_path + "/" + document["name"] + "_" + str(datetime.today().timestamp()))

                with open(full_filename_path, 'wb') as theFile:
                    theFile.write(base64.b64decode(attachmentBase64))
                    theFile.close()

                document = None

                attachmentBase64 = "data:application/pdf;base64,"

            idDocument = text.split("idDocument ")[1]
            document = getDocumentById(idDocument, BASE_URL)
        
        # else:


        # text_data += text + '\n'
     
    # Return the text data
    return text_data
    

def getDocumentById(idDocument, BASE_URL):
    response = {}
    
    try:
        response = {
            "message": "DATA ACCESS",
            "error": "",
            "code": 200
        }

        # solr.add([data])

        query = "id%3A" + idDocument + "%0A"

        print(BASE_URL + "/documents/select?indent=true&q.op=AND&q=" + query + "&sort=name_str%20asc&useParams=")
        # select?fq=id%3A3*&fq=name%3ADelibera0*&indent=true&q.op=AND&q=parentId%3A74c3ff78-ee81-4786-ad88-96feb022c926&useParams=
        
        responseRaw = requests.get(BASE_URL + "/documents/select?indent=true&q.op=AND&q=" + query + "&sort=name_str%20asc&useParams=", verify=False)
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

                    if keyRaw in ["id", "_version_", "deliberationDate"]:
                        document[keyRaw] = documentRaw[keyRaw]
                    else:
                        document[keyRaw] = documentRaw[keyRaw][0].replace("\\", "")
                
                documents.append(document)
        
        response = documents[0]
        
    except Exception as e:
        print(e)
        response = None
    
    return response 



def sort_alphanumeric_list(lst):
    sortedList = []

    last_dash_index = lst[0].rfind('-')
    if last_dash_index != -1:
        filename = lst[0][:last_dash_index]

    for num in range (1,len(lst) +1):
        sortedList.append(filename + "-" + str(num) + ".pdf")

    # Sort the list using a custom key function
    return sortedList