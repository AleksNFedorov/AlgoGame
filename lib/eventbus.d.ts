
declare class EventBusClass {
    addEventListener(type: string, callback: Function, scope?: any): void;
    removeEventListener(type: string, callback: Function, scope?: any): void;
    hasEventListener(type: string, callback?: Function, scope?: any): boolean;
    dispatch(type:string, target: any, ...args: any[]): void;
    getEvents(): string;
}