import requests # type: ignore
import json
from bson import ObjectId

import time 
def create_user(data, collection):
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

            print(collection.insert_one(data))          

        except Exception as e:
            response = {
                "message": "",
                "error": str(e),
                "code": 500
            }
    
    return response


def read_user(data, collection):
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
            response = collection.find_one({"emailqry": data["emailqry"]})
            response["_id"] = str(response["_id"])
            # Now you can access response_docs as a list containing the documents
            # Do whatever you need to do with response_docs

            if response is None:
                response = {
                    "message": "",
                    "error": "password mismatch",
                    "code": 502
            }
            

        except Exception as e:
            response = {
                "message": "",
                "error": str(e),
                "code": 500
            }
    
    return response


def get_user(data, collection):
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
            users = []

            for document in collection.find():  # Convert cursor to a list
                document["_id"] = str(document["_id"])
                users.append(document)

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


def update_user(data, collection):
    print("START USER UPDATE")
    
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

            r = collection.update_one({"emailqry": data["emailqry"]}, {"$set": data})
            print(f"Status Code: {r.status_code}, Response: {r.json()}")
        except Exception as e:
            response = {
                "message": "",
                "error": str(e),
                "code": 500
            }
    
    return response

def delete_user(data, collection):
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


def updateUserPass(data, collection):
    try:
        userUpdate = collection.update_one({"email": data["email"]}, {"$set": data})
        userUpdate["_id"] = str(userUpdate["_id"])
        return userUpdate
    except Exception as e:
            return {
                "message": "",
                "error": str(e),
                "code": 500
            }
    

# def recoverPass():
#     response = {}
#     if not data:
#         response = {
#             "message": "",
#             "error": 'No data provided',
#             "code": 400
#         }
#     else:
#         try:
#             response = {
#                 "message": "DATA ACCESS",
#                 "error": "",
#                 "code": 200
#             }

#             query = "email%3A%22" + data["email"] + "%22"
#             responseRaw = requests.get(collection + "/users/select?indent=true&q.op=AND&q=" + query + "%20asc&useParams=", verify=False)

#             # Decode the content from bytes to string and then parse as JSON
#             response_json = json.loads(responseRaw.content.decode('utf-8'))
#             usersRaw = response_json.get('response', {}).get('docs', [])

#             users = []

#             if len(usersRaw) > 0:
#                 for userRaw in usersRaw:
#                     print(userRaw)
#                     user = { }

#                     keysRaw = list(userRaw.keys())
#                     for keyRaw in keysRaw:

#                         if keyRaw in ["id", "_version_"]:
#                             user[keyRaw] = userRaw[keyRaw]
#                         else:
#                             user[keyRaw] = userRaw[keyRaw][0]
                    
#                     users.append(user)
        
#             response = {
#                 "users": users
#             }
#             # Now you can access response_docs as a list containing the documents
#             # Do whatever you need to do with response_docs

#         except Exception as e:
#             response = {
#                 "message": "",
#                 "error": str(e),
#                 "code": 500
#             }
    
#     return response
