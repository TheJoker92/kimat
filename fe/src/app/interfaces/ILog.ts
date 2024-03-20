import { IUser } from "./IUser"

export interface ILog {
    id?: string
    action?: string
    resourceId?: string
    user?: IUser
    date?: string
}

export enum ActionEnum {
    RESOURCE_ACCESS = "resource access",
    LOGIN = "login",
    CREATION_CATALOGUE = "catalogue creation"
}