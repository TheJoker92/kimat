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
    CREATION_CATALOGUE = "catalogue creation"
}