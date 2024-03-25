export interface IMetadata {
    DocumentoInformatico?: IDigitalDocument
}

export interface IDigitalDocument {
    IdDoc?: IDDoc
    ModalitaDiFormazione?: string
    TipologiaDocumentale?: string
    ChiaveDescrittiva?: IChiaveDescrittiva
    Soggetti?: ISubject[]
    Riservato?: boolean
    IdentificativoDelFormato?: string //PDF
    Allegati?: IAllegato[]
    Verifica?: IVerify
    VersioneDelDocumento?: string
    TracciatureModificheDocumento?: number //1
    Note?: string
}

export interface IDDoc {
    Impronta?: string //Hash
    Algoritmo?: string // SHA-256
    Identificativo?: string //guid
    DatiDiRegistrazione?: IDatiDiRegistrazione
}

export interface IDatiDiRegistrazione {
    TipologiaDiFlusso?: string
    TipoRegistro?: string
    DataRegistrazione?: string

}

export interface IChiaveDescrittiva {
    Oggetto?: string
}

export interface ISubject {
    Ruolo?: string
    TipoSoggetto?: string
    Nominativo?: string
}

export interface IAllegato {
    NumeroAllegati?: number
}

export interface IVerify {
    FirmatoDigitalmente?: boolean
    SigillatoDigitalmente?: boolean
    MarcaturaTemporale?: boolean
    ConformitaCopieImmagineSuSupportoInformatico?: boolean
}
// let schemaType = "DocumentoInformatico" // documento informatico / amministrativo
//   metadata[schemaType] = {
// "IdDoc"?: {
//   "Impronta"?: stringToHash(session.session.pages.processView['plicoSelected']['practiceSelected'].code),
//   "Algoritmo"?: "SHA-256",
//   "Identificativo"?: session.session.pages.processView['plicoSelected']['practiceSelected'].code.practiceCode
// },
// "ModalitaDiFormazione"?: session.session.pages.processView['plicoSelected']['practiceSelected']["formationMode"],
// "TipologiaDocumentale"?: session.session.pages.processView['plicoSelected']['practiceSelected']["documentType"],
// "DatiDiRegistrazione"?: {
//     "TipologiaDiFlusso"?: session.session.pages.processView['plicoSelected']['practiceSelected']["registrationData"]["flowType"],
//     "TipoRegistro"?: session.session.pages.processView['plicoSelected']['practiceSelected']["registrationData"]["registerType"],
//     "DataRegistrazione"?: session.session.pages.processView['plicoSelected']['practiceSelected']["registrationData"]["registrationDate"],
//   },
// "ChiaveDescrittiva"?: {
//   "Oggetto"?: session.session.pages.processView["plicoSelected"]["practiceSelected"]["objectDescKey"]
// },
// "Soggetti"?: subjects,
// "Riservato"?: session.session.pages.processView['plicoSelected']['practiceSelected']["reserved"],
// "IdentificativoDelFormato"?: "PDF", //hard coded
// "Allegati"?: attachments,
// "Verifica"?: {
//     "FirmatoDigitalmente"?: session.session.pages.processView['plicoSelected']['practiceSelected']["verify"]["digitalSigned"],
//         "SigillatoDigitalmente"?: session.session.pages.processView['plicoSelected']['practiceSelected']["verify"]["digitalSealed"],
//             "MarcaturaTemporale"?: session.session.pages.processView['plicoSelected']['practiceSelected']["verify"]["marked"],
//                 "ConformitaCopieImmagineSuSupportoInformatico"?: session.session.pages.processView['plicoSelected']['practiceSelected']["verify"]["compliant"]
// },
// "VersioneDelDocumento"?: session.session.pages.processView['plicoSelected']['practiceSelected']["verify"],
    // "TracciatureModificheDocumento"?: 1, //hard coded
    //     "Note"?: session.session.pages.processView['plicoSelected']['practiceSelected']["note"]
//   }