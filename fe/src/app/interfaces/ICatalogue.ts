import { IDocument } from "./IDocument"
import { IUser } from "./IUser"

export interface ICatalogue {
    id?: string 
    title?: string
    topic?: string
    documents?: IDocument[]
    owners?: IUser[]
}