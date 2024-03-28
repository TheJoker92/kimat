import { IDevice } from "./IDevice"
import { ILog } from "./ILog"
import { IPlace } from "./IPlace"
import { IUser } from "./IUser"

export interface IDocument {
    parentId?: string
    id?: string
    attachments?: IAttachment[]
    history?: ILog[]
    creation_date?: string   
    deviceIds?: string[]
    states?: IDocumentState[]
    name?: string
    topics?: string[],
    placement?: IPlace[]
    owners?: IUser[]
}

export interface IAttachment{
    name?: string
    ext?: string
    base64?: string
    device?: IDevice
    user?: IUser
}

export interface IDocumentState {
    id?: string
    stateValue?: string
    user?: IUser
    date?: string
}