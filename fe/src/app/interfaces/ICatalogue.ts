import { IDocument } from "./IDocument"

export interface ICatalogue {
    id?: string 
    title?: string
    topic?: string
    documents?: IDocument[]
}