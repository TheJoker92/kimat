import json
from bson import ObjectId
import uuid


def create_catalogue(data, collection):    
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
            
            print(collection.insert_one(data))

        except Exception as e:
            response = {
                "message": "",
                "error": str(e),
                "code": 500
            }
    
    return response

def getCatalogues(data, collection):
    response = {}
    
    try:
        response = {
            "message": "DATA ACCESS",
            "error": "",
            "code": 200
        }

        print(data)

        query = {}
        if "_id" in data.keys():
            query["_id"] = data["_id"]
            del data["_id"]
        if "title" in data.keys():
            query["title"] =  { "$regex": data["title"], "$options": "i" }

        
        if "topics" in data.keys():
            query["topics"] = {"$in": [data["topics"]]}
        

        print(str(collection.find(query)) )

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


def delete_catalogue(data, collection):
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

            # Now you can access response_docs as a list containing the documents
            # Do whatever you need to do with response_docs

        except Exception as e:
            response = {
                "message": "",
                "error": str(e),
                "code": 500
            }
    
    return response

def update_catalogue(data, collection):
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