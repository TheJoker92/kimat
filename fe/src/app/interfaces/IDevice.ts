export interface IDevice {
    id?: string
    state?: string
}

export enum IDeviceState {
    AVAILABLE = "available",
    BUSY = "busy",
    ERROR = "error"
}