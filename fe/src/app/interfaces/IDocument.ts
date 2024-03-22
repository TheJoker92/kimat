import { IDevice } from "./IDevice"
import { ILog } from "./ILog"

export interface IDocument {
    parentId?: string
    id?: string
    attachments?: IAttachment[]
    history?: ILog[]
    creation_date?: string   
    deviceIds?: string[]
    state: IDocumentState[]
}

export interface IAttachment{
    name?: string
    mimeType?: string
    base64?: string
}

export interface IDocumentState {
    id?: string
    stateValue?: string
    date?: string
}