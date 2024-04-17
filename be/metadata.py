from hashlib import sha256

DIGITAL_MODE = "analogico;  memorizzazione su supporto informatico in formato digitale delle informazioni risultanti da transazioni o processi informatici o dalla presentazione telematica di dati attraverso moduli o formulari resi disponibili all’utente",
DOCUMENT_TYPE = "documento"
FLOW_TYPE = "interno"
REGISTER_TYPE = "Protocollo Ordinario/Protocollo Emergenza"

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
                "Impronta": sha256(data.id),
                "Algoritmo": "SHA-256",
                "Identificativo": data.id
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

