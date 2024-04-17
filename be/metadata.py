from hashlib import sha256

DIGITAL_MODE = "analogico;  memorizzazione su supporto informatico in formato digitale delle informazioni risultanti da transazioni o processi informatici o dalla presentazione telematica di dati attraverso moduli o formulari resi disponibili all’utente",
DOCUMENT_TYPE = "documento"
FLOW_TYPE = "interno"
REGISTER_TYPE = "Protocollo Ordinario/Protocollo Emergenza"

import xmltodict 


def buildMetadataXML(data):
    global DIGITAL_MODE
    global DOCUMENT_TYPE
    global FLOW_TYPE
    global REGISTER_TYPE
    global REGISTRATION_DATE

    subjects = []

    for subject in data["owners"]:
        subjectObj: any = {}

        subjectObj["Ruolo"] = subject["role"]
        subjectObj["TipoSoggetto"] = "PF"
        subjectObj["Nominativo"] = subject["firstName"] + " " + subject["lastName"]
        
        subjects.append({"Soggetto": subjectObj})
    

    metadata = {
        "DocumentoInformatico": {
            "IdDoc": {
                "Impronta": sha256(data["id"].encode("utf-8")),
                "Algoritmo": "SHA-256",
                "Identificativo": data["id"]
            },
            "ModalitaDiFormazione": DIGITAL_MODE,
            "TipologiaDocumentale": DOCUMENT_TYPE,
            "DatiDiRegistrazione": {
                "TipologiaDiFlusso": FLOW_TYPE,
                "TipoRegistro": REGISTER_TYPE,
                "DataRegisgtrazione": data["history"][0]["date"],
            },
            "Soggetti": subjects,
            "Riservato": True,
            "IdentificativoDelFormato": "PDF",
            "Allegati": {
                "NumeroAllegati": 0
            },
            "Verifica": {
                "FirmatoDigitalmente": False,
                "SigillatoDigitalmente": False,
                "MarcaturaTemporale": False,
                "ConformitaCopieImmagineSuSupportoInformatico": False    
            },
            "VersioneDelDocumento": "1",
            "TracciatureModificheDocumento": 1
        }
    }  
  
    return metadata


data = {
    "_version_": 1796507452213035000,
    "attachments": {
        "name": "Delibera01-04012006",
        "ext": "pdf"
    },
    "deliberationDate": [
        "a04012006"
    ],
    "deviceIds": [],
    "history": [
        {
            "id": "0",
            "date": "2024-04-05T21:38:25.590Z",
            "actionLog": "crea documento",
            "user": {
                "email": "demicco.alessandro92@gmail.com",
                "firstName": "Alessandro",
                "id": "160653e4-8462-4798-90a3-15cbe2f69411",
                "lastName": "De Micco",
                "password": "test",
                "role": "support"
            }
        },
        {
            "id": "1",
            "date": "2024-04-07T20:49:02.101Z",
            "user": {
                "email": "demicco.alessandro92@gmail.com",
                "firstName": "Alessandro",
                "id": "160653e4-8462-4798-90a3-15cbe2f69411",
                "lastName": "De Micco",
                "password": "test",
                "role": "support"
            },
            "resourceId": "fa0931b9-333a-498b-a6a4-c04add1b44e0",
            "actionLog": "ultima visualizzazione"
        },
        {
            "id": "2",
            "date": "2024-04-08T09:42:28.950Z",
            "user": {
                "email": "demicco.alessandro92@gmail.com",
                "firstName": "Alessandro",
                "id": "160653e4-8462-4798-90a3-15cbe2f69411",
                "lastName": "De Micco",
                "password": "test",
                "role": "support"
            },
            "resourceId": "fa0931b9-333a-498b-a6a4-c04add1b44e0",
            "actionLog": "ultima visualizzazione"
        },
        {
            "id": "3",
            "date": "2024-04-08T14:44:47.938Z",
            "user": {
                "email": "massimiliano.vender@gmail.com",
                "firstName": "Massimiliano",
                "id": "e9b06132-6b25-4824-a0ed-aaa661f6c264",
                "lastName": "Vender",
                "password": "test",
                "role": "admin"
            },
            "resourceId": "fa0931b9-333a-498b-a6a4-c04add1b44e0",
            "actionLog": "ultima visualizzazione"
        },
        {
            "id": "4",
            "date": "2024-04-08T14:45:21.568Z",
            "user": {
                "email": "massimiliano.vender@gmail.com",
                "firstName": "Massimiliano",
                "id": "e9b06132-6b25-4824-a0ed-aaa661f6c264",
                "lastName": "Vender",
                "password": "test",
                "role": "admin"
            },
            "resourceId": "fa0931b9-333a-498b-a6a4-c04add1b44e0",
            "actionLog": "ultima visualizzazione"
        },
        {
            "id": "5",
            "date": "2024-04-08T14:46:03.539Z",
            "user": {
                "email": "massimiliano.vender@gmail.com",
                "firstName": "Massimiliano",
                "id": "e9b06132-6b25-4824-a0ed-aaa661f6c264",
                "lastName": "Vender",
                "password": "test",
                "role": "admin"
            },
            "resourceId": "fa0931b9-333a-498b-a6a4-c04add1b44e0",
            "actionLog": "ultima visualizzazione"
        },
        {
            "id": "6",
            "date": "2024-04-08T15:03:24.596Z",
            "user": {
                "email": "massimiliano.vender@gmail.com",
                "firstName": "Massimiliano",
                "id": "e9b06132-6b25-4824-a0ed-aaa661f6c264",
                "lastName": "Vender",
                "password": "test",
                "role": "admin"
            },
            "resourceId": "fa0931b9-333a-498b-a6a4-c04add1b44e0",
            "actionLog": "ultima visualizzazione"
        },
        {
            "id": "7",
            "date": "2024-04-09T14:39:52.508Z",
            "user": {
                "email": "demicco.alessandro92@gmail.com",
                "firstName": "Alessandro",
                "id": "160653e4-8462-4798-90a3-15cbe2f69411",
                "lastName": "De Micco",
                "password": "test",
                "role": "support"
            },
            "resourceId": "fa0931b9-333a-498b-a6a4-c04add1b44e0",
            "actionLog": "ultima visualizzazione"
        },
        {
            "id": "8",
            "date": "2024-04-09T14:53:54.552Z",
            "user": {
                "email": "demicco.alessandro92@gmail.com",
                "firstName": "Alessandro",
                "id": "160653e4-8462-4798-90a3-15cbe2f69411",
                "lastName": "De Micco",
                "password": "test",
                "role": "support"
            },
            "resourceId": "fa0931b9-333a-498b-a6a4-c04add1b44e0",
            "actionLog": "ultima visualizzazione"
        },
        {
            "id": "9",
            "date": "2024-04-15T14:58:44.341Z",
            "user": {
                "email": "demicco.alessandro92@gmail.com",
                "firstName": "Alessandro",
                "id": "160653e4-8462-4798-90a3-15cbe2f69411",
                "lastName": "De Micco",
                "password": "test",
                "role": "support"
            },
            "resourceId": "fa0931b9-333a-498b-a6a4-c04add1b44e0",
            "actionLog": "ultima visualizzazione"
        },
        {
            "id": "10",
            "date": "2024-04-16T13:21:48.320Z",
            "user": {
                "email": "demicco.alessandro92@gmail.com",
                "firstName": "Alessandro",
                "id": "160653e4-8462-4798-90a3-15cbe2f69411",
                "lastName": "De Micco",
                "password": "test",
                "role": "support"
            },
            "resourceId": "fa0931b9-333a-498b-a6a4-c04add1b44e0",
            "actionLog": "ultima visualizzazione"
        },
        {
            "id": "11",
            "date": "2024-04-16T13:27:46.770Z",
            "user": {
                "email": "demicco.alessandro92@gmail.com",
                "firstName": "Alessandro",
                "id": "160653e4-8462-4798-90a3-15cbe2f69411",
                "lastName": "De Micco",
                "password": "test",
                "role": "support"
            },
            "resourceId": "fa0931b9-333a-498b-a6a4-c04add1b44e0",
            "actionLog": "ultima visualizzazione"
        },
        {
            "id": "12",
            "date": "2024-04-16T13:31:37.138Z",
            "user": {
                "email": "demicco.alessandro92@gmail.com",
                "firstName": "Alessandro",
                "id": "160653e4-8462-4798-90a3-15cbe2f69411",
                "lastName": "De Micco",
                "password": "test",
                "role": "support"
            },
            "resourceId": "fa0931b9-333a-498b-a6a4-c04add1b44e0",
            "actionLog": "ultima visualizzazione"
        },
        {
            "id": "13",
            "date": "2024-04-16T13:32:11.422Z",
            "user": {
                "email": "demicco.alessandro92@gmail.com",
                "firstName": "Alessandro",
                "id": "160653e4-8462-4798-90a3-15cbe2f69411",
                "lastName": "De Micco",
                "password": "test",
                "role": "support"
            },
            "resourceId": "fa0931b9-333a-498b-a6a4-c04add1b44e0",
            "actionLog": "ultima visualizzazione"
        },
        {
            "id": "14",
            "date": "2024-04-16T13:35:45.596Z",
            "user": {
                "email": "demicco.alessandro92@gmail.com",
                "firstName": "Alessandro",
                "id": "160653e4-8462-4798-90a3-15cbe2f69411",
                "lastName": "De Micco",
                "password": "test",
                "role": "support"
            },
            "resourceId": "fa0931b9-333a-498b-a6a4-c04add1b44e0",
            "actionLog": "ultima visualizzazione"
        },
        {
            "id": "15",
            "date": "2024-04-16T13:59:33.692Z",
            "user": {
                "email": "demicco.alessandro92@gmail.com",
                "firstName": "Alessandro",
                "id": "160653e4-8462-4798-90a3-15cbe2f69411",
                "lastName": "De Micco",
                "password": "test",
                "role": "support"
            },
            "resourceId": "fa0931b9-333a-498b-a6a4-c04add1b44e0",
            "actionLog": "ultima visualizzazione"
        },
        {
            "id": "16",
            "date": "2024-04-16T14:08:01.928Z",
            "user": {
                "email": "demicco.alessandro92@gmail.com",
                "firstName": "Alessandro",
                "id": "160653e4-8462-4798-90a3-15cbe2f69411",
                "lastName": "De Micco",
                "password": "test",
                "role": "support"
            },
            "resourceId": "fa0931b9-333a-498b-a6a4-c04add1b44e0",
            "actionLog": "ultima visualizzazione"
        },
        {
            "id": "17",
            "date": "2024-04-16T14:56:18.918Z",
            "user": {
                "email": "demicco.alessandro92@gmail.com",
                "firstName": "Alessandro",
                "id": "160653e4-8462-4798-90a3-15cbe2f69411",
                "lastName": "De Micco",
                "password": "test",
                "role": "support"
            },
            "resourceId": "fa0931b9-333a-498b-a6a4-c04add1b44e0",
            "actionLog": "ultima visualizzazione"
        },
        {
            "id": "18",
            "date": "2024-04-16T14:56:58.901Z",
            "user": {
                "email": "demicco.alessandro92@gmail.com",
                "firstName": "Alessandro",
                "id": "160653e4-8462-4798-90a3-15cbe2f69411",
                "lastName": "De Micco",
                "password": "test",
                "role": "support"
            },
            "resourceId": "fa0931b9-333a-498b-a6a4-c04add1b44e0",
            "actionLog": "ultima visualizzazione"
        },
        {
            "id": "19",
            "date": "2024-04-16T14:59:37.867Z",
            "user": {
                "email": "demicco.alessandro92@gmail.com",
                "firstName": "Alessandro",
                "id": "160653e4-8462-4798-90a3-15cbe2f69411",
                "lastName": "De Micco",
                "password": "test",
                "role": "support"
            },
            "resourceId": "fa0931b9-333a-498b-a6a4-c04add1b44e0",
            "actionLog": "ultima visualizzazione"
        },
        {
            "id": "20",
            "date": "2024-04-16T15:03:54.050Z",
            "user": {
                "email": "demicco.alessandro92@gmail.com",
                "firstName": "Alessandro",
                "id": "160653e4-8462-4798-90a3-15cbe2f69411",
                "lastName": "De Micco",
                "password": "test",
                "role": "support"
            },
            "resourceId": "fa0931b9-333a-498b-a6a4-c04add1b44e0",
            "actionLog": "ultima visualizzazione"
        },
        {
            "id": "21",
            "date": "2024-04-16T15:04:19.932Z",
            "user": {
                "email": "demicco.alessandro92@gmail.com",
                "firstName": "Alessandro",
                "id": "160653e4-8462-4798-90a3-15cbe2f69411",
                "lastName": "De Micco",
                "password": "test",
                "role": "support"
            },
            "resourceId": "fa0931b9-333a-498b-a6a4-c04add1b44e0",
            "actionLog": "ultima visualizzazione"
        },
        {
            "id": "22",
            "date": "2024-04-16T15:04:38.733Z",
            "user": {
                "email": "demicco.alessandro92@gmail.com",
                "firstName": "Alessandro",
                "id": "160653e4-8462-4798-90a3-15cbe2f69411",
                "lastName": "De Micco",
                "password": "test",
                "role": "support"
            },
            "resourceId": "fa0931b9-333a-498b-a6a4-c04add1b44e0",
            "actionLog": "ultima visualizzazione"
        },
        {
            "id": "23",
            "date": "2024-04-16T15:11:03.631Z",
            "user": {
                "email": "demicco.alessandro92@gmail.com",
                "firstName": "Alessandro",
                "id": "160653e4-8462-4798-90a3-15cbe2f69411",
                "lastName": "De Micco",
                "password": "test",
                "role": "support"
            },
            "resourceId": "fa0931b9-333a-498b-a6a4-c04add1b44e0",
            "actionLog": "ultima visualizzazione"
        },
        {
            "id": "24",
            "date": "2024-04-16T15:12:26.213Z",
            "user": {
                "email": "demicco.alessandro92@gmail.com",
                "firstName": "Alessandro",
                "id": "160653e4-8462-4798-90a3-15cbe2f69411",
                "lastName": "De Micco",
                "password": "test",
                "role": "support"
            },
            "resourceId": "fa0931b9-333a-498b-a6a4-c04add1b44e0",
            "actionLog": "ultima visualizzazione"
        },
        {
            "id": "25",
            "date": "2024-04-16T15:29:38.179Z",
            "user": {
                "email": "demicco.alessandro92@gmail.com",
                "firstName": "Alessandro",
                "id": "160653e4-8462-4798-90a3-15cbe2f69411",
                "lastName": "De Micco",
                "password": "test",
                "role": "support"
            },
            "resourceId": "fa0931b9-333a-498b-a6a4-c04add1b44e0",
            "actionLog": "ultima visualizzazione"
        },
        {
            "id": "26",
            "date": "2024-04-16T15:29:53.145Z",
            "user": {
                "email": "demicco.alessandro92@gmail.com",
                "firstName": "Alessandro",
                "id": "160653e4-8462-4798-90a3-15cbe2f69411",
                "lastName": "De Micco",
                "password": "test",
                "role": "support"
            },
            "resourceId": "fa0931b9-333a-498b-a6a4-c04add1b44e0",
            "actionLog": "ultima visualizzazione"
        },
        {
            "id": "27",
            "date": "2024-04-16T15:30:22.328Z",
            "user": {
                "email": "demicco.alessandro92@gmail.com",
                "firstName": "Alessandro",
                "id": "160653e4-8462-4798-90a3-15cbe2f69411",
                "lastName": "De Micco",
                "password": "test",
                "role": "support"
            },
            "resourceId": "fa0931b9-333a-498b-a6a4-c04add1b44e0",
            "actionLog": "ultima visualizzazione"
        },
        {
            "id": "28",
            "date": "2024-04-16T15:35:32.865Z",
            "user": {
                "email": "demicco.alessandro92@gmail.com",
                "firstName": "Alessandro",
                "id": "160653e4-8462-4798-90a3-15cbe2f69411",
                "lastName": "De Micco",
                "password": "test",
                "role": "support"
            },
            "resourceId": "fa0931b9-333a-498b-a6a4-c04add1b44e0",
            "actionLog": "ultima visualizzazione"
        },
        {
            "id": "29",
            "date": "2024-04-16T15:51:12.676Z",
            "user": {
                "email": "demicco.alessandro92@gmail.com",
                "firstName": "Alessandro",
                "id": "160653e4-8462-4798-90a3-15cbe2f69411",
                "lastName": "De Micco",
                "password": "test",
                "role": "support"
            },
            "resourceId": "fa0931b9-333a-498b-a6a4-c04add1b44e0",
            "actionLog": "ultima visualizzazione"
        },
        {
            "id": "30",
            "date": "2024-04-16T15:51:17.244Z",
            "user": {
                "email": "demicco.alessandro92@gmail.com",
                "firstName": "Alessandro",
                "id": "160653e4-8462-4798-90a3-15cbe2f69411",
                "lastName": "De Micco",
                "password": "test",
                "role": "support"
            },
            "resourceId": "fa0931b9-333a-498b-a6a4-c04add1b44e0",
            "actionLog": "ultima visualizzazione"
        },
        {
            "id": "31",
            "date": "2024-04-16T15:51:42.326Z",
            "user": {
                "email": "demicco.alessandro92@gmail.com",
                "firstName": "Alessandro",
                "id": "160653e4-8462-4798-90a3-15cbe2f69411",
                "lastName": "De Micco",
                "password": "test",
                "role": "support"
            },
            "resourceId": "fa0931b9-333a-498b-a6a4-c04add1b44e0",
            "actionLog": "ultima visualizzazione"
        },
        {
            "id": "32",
            "date": "2024-04-16T15:51:44.576Z",
            "user": {
                "email": "demicco.alessandro92@gmail.com",
                "firstName": "Alessandro",
                "id": "160653e4-8462-4798-90a3-15cbe2f69411",
                "lastName": "De Micco",
                "password": "test",
                "role": "support"
            },
            "resourceId": "fa0931b9-333a-498b-a6a4-c04add1b44e0",
            "actionLog": "ultima visualizzazione"
        },
        {
            "id": "33",
            "date": "2024-04-16T15:52:01.610Z",
            "user": {
                "email": "demicco.alessandro92@gmail.com",
                "firstName": "Alessandro",
                "id": "160653e4-8462-4798-90a3-15cbe2f69411",
                "lastName": "De Micco",
                "password": "test",
                "role": "support"
            },
            "resourceId": "fa0931b9-333a-498b-a6a4-c04add1b44e0",
            "actionLog": "ultima visualizzazione"
        },
        {
            "id": "34",
            "date": "2024-04-16T15:56:29.789Z",
            "user": {
                "email": "demicco.alessandro92@gmail.com",
                "firstName": "Alessandro",
                "id": "160653e4-8462-4798-90a3-15cbe2f69411",
                "lastName": "De Micco",
                "password": "test",
                "role": "support"
            },
            "resourceId": "fa0931b9-333a-498b-a6a4-c04add1b44e0",
            "actionLog": "ultima visualizzazione"
        },
        {
            "id": "35",
            "date": "2024-04-16T15:56:54.757Z",
            "user": {
                "email": "demicco.alessandro92@gmail.com",
                "firstName": "Alessandro",
                "id": "160653e4-8462-4798-90a3-15cbe2f69411",
                "lastName": "De Micco",
                "password": "test",
                "role": "support"
            },
            "resourceId": "fa0931b9-333a-498b-a6a4-c04add1b44e0",
            "actionLog": "ultima visualizzazione"
        }
    ],
    "id": "fa0931b9-333a-498b-a6a4-c04add1b44e0",
    "name": "Delibera01-04012006",
    "owners": [
        {
            "email": "demicco.alessandro92@gmail.com",
            "firstName": "Alessandro",
            "id": "160653e4-8462-4798-90a3-15cbe2f69411",
            "lastName": "De Micco",
            "password": "test",
            "role": "support"
        }
    ],
    "parentId": "74c3ff78-ee81-4786-ad88-96feb022c926",
    "placement": [],
    "states": [
        {
            "id": "0",
            "stateValue": "Accettazione",
            "user": {
                "email": "demicco.alessandro92@gmail.com",
                "firstName": "Alessandro",
                "id": "160653e4-8462-4798-90a3-15cbe2f69411",
                "lastName": "De Micco",
                "password": "test",
                "role": "support"
            },
            "date": "2024-04-05T21:38:25.590Z"
        }
    ],
    "topics": [
        {
            "oggetto": ": Contenzioso Comune di Rieti / Carrozza Francesco: ricorso per Cassazione avversonnsentenza di appello n. 3272/05.nn- Resistenza in giudizio e nomina del legale patrocinatore.nn",
            "annoStr": "DUEMILASEI",
            "giornoStr": "QUATTRO",
            "meseStr": "GENNAIO",
            "oreStr": "18:00",
            "data": "04-01-2006",
            "dataNoDash": "a04012006"
        }
    ]
}

def parseToXml(data):
    json_data = buildMetadataXML(data)
    return xmltodict.unparse(json_data, pretty=True) 