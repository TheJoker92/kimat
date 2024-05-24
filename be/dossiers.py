import requests # type: ignore
import json

def create_dossier(data, BASE_URL):    
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
    
    return response

def getDossiers(data, BASE_URL):
    response = {}
    
    try:
        response = {
            "message": "DATA ACCESS",
            "error": "",
            "code": 200
        }

        print(data)

        query = ""
        if "id" in data.keys():
            query += "id%3A" + data["id"] + "%0A"
        if "title" in data.keys():
            if " " in data["title"]:
                data["title"] = "(" + data["title"] + ")"
            query += "title%3A" + data["title"].replace(" ","%20") + "%0A"
        else:
            query += "*%3A*%0A"
        
        if "topics" in data.keys():
            query += "topics%3A%22" + data["topics"] + "%22"
        else:
            query += "*%3A*"

        # https://127.0.0.1:8984/solr/dossiers/select?indent=true&q.op=AND&q=title%3A*di%20*%0A*%3A*&useParams=
        # https://127.0.0.1:8984/solr/dossiers/select?indent=true&q.op=AND&q=title%3A%22*%22di*%22%0A*%3A*&useParams=
        print(BASE_URL + "/dossiers/select?indent=true&q.op=AND&q=" + query + "&sort=title_str%20asc&useParams=")

        # solr.add([data])
        responseRaw = requests.get(BASE_URL + "/dossiers/select?indent=true&q.op=AND&q=" + query + "&sort=title_str%20asc&useParams=", verify=False)
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


def delete_dossier(data, BASE_URL):
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

def update_dossier(data, BASE_URL):
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
        
        return response