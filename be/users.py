import requests # type: ignore
import json
import time 
def create_user(data, BASE_URL):
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
    
    return response


def read_user(data, BASE_URL):
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


def get_user(data, BASE_URL):
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


def update_user(data, BASE_URL):
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

            r = requests.post(BASE_URL + "/users/update?_=1710697938875&commitWithin=1000&overwrite=true&wt=json", json=[data], verify=False)
            print(f"Status Code: {r.status_code}, Response: {r.json()}")
        except Exception as e:
            response = {
                "message": "",
                "error": str(e),
                "code": 500
            }
    
    return response

def delete_user(data, BASE_URL):
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
            responseRaw = requests.post(BASE_URL + "/users/update?_=1710934023202&commitWithin=1000&overwrite=true&wt=json", headers=headers, data=payload, verify=False)

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


def updateUserPass(data, BASE_URL):
    try:
        responseRaw = requests.get(BASE_URL + "/users/select?indent=true&q.op=OR&q=email%3A\"" + data["email"] + "\"&useParams=", verify=False)
        print("HHEELL")

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
        
        user = users[0]
        user["password"] = data["password"]

        print(responseRaw)

        r = requests.post(BASE_URL + "/users/update?_=1710697938875&commitWithin=1000&overwrite=true&wt=json", json=[user], verify=False)
        return r.json()
    except Exception as e:
            return {
                "message": "",
                "error": str(e),
                "code": 500
            }
    

def recoverPass():
    esponse = {}
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

            query = "email%3A%22" + data["email"] + "%22"
            responseRaw = requests.get(BASE_URL + "/users/select?indent=true&q.op=AND&q=" + query + "%20asc&useParams=", verify=False)

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
