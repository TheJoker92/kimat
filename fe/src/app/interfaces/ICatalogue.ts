import { IDocument } from "./IDocument"

export interface ICatalogue {
    title: string
    topic: string
    documents?: IDocument[]
}