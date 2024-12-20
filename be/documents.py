import json
from bson import ObjectId

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




def create_document(data, collection):
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

            print(collection.insert_one(data))


        except Exception as e:

            print(e)
            response = {
                "message": "",
                "error": str(e),
                "code": 500
            }
    
    return response

def getDocuments(data, collection):
    response = {}
    
    try:
        response = {
            "message": "DATA ACCESS",
            "error": "",
            "code": 200
        }

        # solr.add([data])

        query = {}
        if "_id" in data.keys():
            query["_id"] = data["_id"]
            del data["_id"]
        if "parentId" in data.keys():
            query["parentId"] = data["parentId"]
        if "name" in data.keys():
            query["name"] = { "$regex": data["name"], "$options": "i" }

        
        if "topics" in data.keys():
            query["topics"] = {"$in": [data["topics"]]}
        

        
        # solr.add([data])
        documents = []
        
        for document in collection.find(query):  # Convert cursor to a list
            document["_id"] = str(document["_id"])
            documents.append(document)
        print(documents)
        
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
            response = {
                "message": "DATA ADDED",
                "error": "",
                "code": 200
            }


            if (data["attachments"] and len(data["attachments"])):
                attachmentsObj = data["attachments"]
                for attachment in attachmentsObj:
                    if len(attachment.keys()):
                        base_folders = "folders"
                        full_folder_path = base_folders + "/" + data["_id"]
                        full_filename_path = full_folder_path + "/" + data["_id"] + "." + attachment["ext"]
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
        id = data["_id"]

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
            "_id": id
        }
        getOcr(data, basePathAsset)
    else:
        result = {
            "error": True
        }
    return result

def deleteDocument(data, collection):
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

            collection.delete_one({"_id": data["_id"]})


        except Exception as e:
            response = {
                "message": "",
                "error": str(e),
                "code": 500
            }
    
    return response

def getDocumentsByDate(data, collection):    
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
            query = {"parentId": data["parentId"], "deliberationDate": date}                    
        
            for document in collection.find(query):  # Convert cursor to a list
                document["_id"] = str(document["_id"])
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

def massiveUploadFromPapers(data, collection):

    response = {}

    try:

        if (data["attachments"] and len(json.loads(data["attachments"]))):
            attachmentsObj = json.loads(data["attachments"])
            base_folders = "folders"
            full_folder_path = base_folders + "/tmp/" + data["parentId"]

            index = 0          
            for attachment in attachmentsObj:
                if len(attachment.keys()):
                    
                    full_filename_path = full_folder_path + "/" + data["parentId"] + "/" + data["_id"] + "_" + index + "_" + "." + attachment["ext"]
                    if not(os.path.exists(full_folder_path)):
                        os.mkdir(full_folder_path) 

                    if (os.path.exists(full_filename_path)):
                        os.rename(full_filename_path, full_folder_path + "/" + data["parentId"] + "_" + str(datetime.today().timestamp()))

                    with open(full_filename_path, 'wb') as theFile:
                        theFile.write(base64.b64decode(attachment["base64"]))

                    
                    data["attachments"] = full_filename_path

            file_path_noext = full_folder_path + "/" + data["parentId"]
            text = extract_massive_text_from_pdf(file_path_noext + ".pdf", collection)  

            print("AAAA")
            with open(file_path_noext  + ".txt", 'w') as theFile:
                theFile.write(text)
                theFile.close()

            print("BBB")
    except Exception as e:
        response = {
            "message": "",
            "error": str(e),
            "code": 500
        }
    
    return response

def extract_massive_text_from_pdf(pdf_path, collection):
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
                full_folder_path = base_folders + "/" + document["_id"]
                full_filename_path = full_folder_path + "/" + document["_id"] + ".pdf"
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
            document = getDocumentById(idDocument, collection)
        
        # else:


        # text_data += text + '\n'
     
    # Return the text data
    return text_data
    

def getDocumentById(idDocument, collection):
    response = {}
    
    try:
        response = {
            "message": "DATA ACCESS",
            "error": "",
            "code": 200
        }

        # solr.add([data])

        query = {}
        query["_id"] = ObjectId(idDocument)
        
        # solr.add([data])
        documents = []
        
        for document in collection.find(query):  # Convert cursor to a list
            document["_id"] = str(document["_id"])
            documents.append(document)
        
        print(documents)
        
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


def update_document(data, collection):
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

            query = {"_id": data["_id"]}

            del data["_id"]

            collection.update_one(query, {"$set": data})
            # print(f"Status Code: {r.status_code}, Response: {r.json()}")
        except Exception as e:
            response = {
                "message": "",
                "error": str(e),
                "code": 500
            }
        
        return response