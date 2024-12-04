import { IDevice } from "./IDevice"
import { ILog } from "./ILog"
import { IPlace } from "./IPlace"
import { IUser } from "./IUser"

export interface IDocument {
    parentId?: string
    _id?: string
    attachments?: IAttachment[]
    history?: ILog[]
    creation_date?: string   
    deviceIds?: string[]
    states?: IDocumentState[]
    name?: string
    topics?: string[]
    placement?: IPlace[]
    owners?: IUser[]
    deliberationDate?: string
}

export interface IAttachment{
    name?: string
    ext?: string
    base64?: string
    device?: IDevice
    user?: IUser
}

export interface IDocumentState {
    _id?: string
    stateValue?: string
    user?: IUser
    date?: string
}