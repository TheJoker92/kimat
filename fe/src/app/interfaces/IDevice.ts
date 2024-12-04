export interface IDevice {
    _id?: string
    state?: string
    vendor?: string
    model?: string
    type?: string

}

export enum IDeviceState {
    AVAILABLE = "available",
    BUSY = "busy",
    ERROR = "error"
}