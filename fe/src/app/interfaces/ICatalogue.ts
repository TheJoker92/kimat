import { IDossier } from "./IDossier"
import { ILog } from "./ILog"
import { IPlace } from "./IPlace"
import { IUser } from "./IUser"

export interface ICatalogue {
    _id?: string
    title?: string
    topics?: string[]
    documents?: IDossier[]
    owners?: IUser[],
    history?: ILog[],
    placement?: IPlace[],
    data?: string
}