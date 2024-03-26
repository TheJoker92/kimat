import { IUser } from "./IUser"

export interface ILog {
    id?: string
    actionLog?: string
    resourceId?: string
    user?: IUser
    date?: string
}

export enum ActionLogEnum {
    RESOURCE_ACCESS = "resource access",
    LOGIN = "login",
    CREATION_CATALOGUE = "crea catalogo",
    UPDATE_CATALOGUE = "aggiorna catalogue",
    CREATION_DOCUMENT = "crea documento",
    UPDATE_DOCUMENT = "aggiornato documento",
    UPDATE_DOCUMENT_STATE = "aggiornato stato documento",
    UPDATE_DOCUMENT_LAST_VIEW = "ultima visualizzazione",
    UPDATE_DOCUMENT_ATTACHMENT = "aggiunto allegato"

}