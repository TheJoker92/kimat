import { IDocument } from "./IDocument"
import { ILog } from "./ILog"
import { IPlace } from "./IPlace"
import { IUser } from "./IUser"

export interface IDossier {
    id?: string 
    title?: string
    topics?: string[]
    documents?: IDocument[]
    owners?: IUser[],
    history?: ILog[],
    placement?: IPlace[],
    data?: string
}