import { Socket } from "socket.io-client";

export type ModuleData = Record<string, VarName>;
export type VarName = Record<string, VarData>;
export interface VarData {
    type: string;
    value: unknown;
    encoded_name: string;
}
declare class DataManager {
    _data: Record<string, unknown>;
    _init_data: ModuleData;
    constructor(variableModuleData: ModuleData);
    init(variableModuleData: ModuleData): ModuleData;
    getEncodedName(varName: string, module: string): string | undefined;
    getName(encodedName: string): [string, string] | undefined;
    get(encodedName: string): unknown;
    getInfo(encodedName: string): VarData | undefined;
    getDataTree(): ModuleData;
    getAllData(): Record<string, unknown>;
    update(encodedName: string, value: unknown): void;
}
export type WsMessageType =
    | "A"
    | "U"
    | "DU"
    | "MU"
    | "RU"
    | "AL"
    | "BL"
    | "NA"
    | "ID"
    | "MS"
    | "DF"
    | "PR"
    | "ACK"
    | "GMC"
    | "GDT"
    | "AID"
    | "GR"
    | "FV";
export interface WsMessage {
    type: WsMessageType | string;
    name: string;
    payload: Record<string, unknown> | unknown;
    propagate: boolean;
    client_id: string;
    module_context: string;
    ack_id?: string;
}
export type OnInitHandler = (taipyApp: TaipyApp) => void;
export type OnChangeHandler = (taipyApp: TaipyApp, encodedName: string, value: unknown) => void;
export type OnNotifyHandler = (taipyApp: TaipyApp, type: string, message: string) => void;
export type OnReloadHandler = (taipyApp: TaipyApp, removedChanges: ModuleData) => void;
export type OnWsMessage = (taipyApp: TaipyApp, event: string, payload: unknown) => void;
export type OnWsStatusUpdate = (taipyApp: TaipyApp, messageQueue: string[]) => void;
export type Route = [string, string];
export declare class TaipyApp {
    socket: Socket;
    _onInit: OnInitHandler | undefined;
    _onChange: OnChangeHandler | undefined;
    _onNotify: OnNotifyHandler | undefined;
    _onReload: OnReloadHandler | undefined;
    _onWsMessage: OnWsMessage | undefined;
    _onWsStatusUpdate: OnWsStatusUpdate | undefined;
    _ackList: string[];
    variableData: DataManager | undefined;
    functionData: DataManager | undefined;
    appId: string;
    clientId: string;
    context: string;
    metadata: Record<string, unknown>;
    path: string | undefined;
    routes: Route[] | undefined;
    wsAdapters: WsAdapter[];
    constructor(
        onInit?: OnInitHandler | undefined,
        onChange?: OnChangeHandler | undefined,
        path?: string | undefined,
        socket?: Socket | undefined
    );
    get onInit(): OnInitHandler | undefined;
    set onInit(handler: OnInitHandler | undefined);
    onInitEvent(): void;
    get onChange(): OnChangeHandler | undefined;
    set onChange(handler: OnChangeHandler | undefined);
    onChangeEvent(encodedName: string, value: unknown): void;
    get onNotify(): OnNotifyHandler | undefined;
    set onNotify(handler: OnNotifyHandler | undefined);
    onNotifyEvent(type: string, message: string): void;
    get onReload(): OnReloadHandler | undefined;
    set onReload(handler: OnReloadHandler | undefined);
    onReloadEvent(removedChanges: ModuleData): void;
    get onWsMessage(): OnWsMessage | undefined;
    set onWsMessage(handler: OnWsMessage | undefined);
    onWsMessageEvent(event: string, payload: unknown): void;
    get onWsStatusUpdate(): OnWsStatusUpdate | undefined;
    set onWsStatusUpdate(handler: OnWsStatusUpdate | undefined);
    onWsStatusUpdateEvent(messageQueue: string[]): void;
    init(): void;
    sendWsMessage(type: WsMessageType | string, id: string, payload: unknown, context?: string | undefined): void;
    registerWsAdapter(wsAdapter: WsAdapter): void;
    getEncodedName(varName: string, module: string): string | undefined;
    getName(encodedName: string): [string, string] | undefined;
    get(encodedName: string): unknown;
    getInfo(encodedName: string): VarData | undefined;
    getDataTree(): ModuleData | undefined;
    getAllData(): Record<string, unknown> | undefined;
    getFunctionList(): string[];
    getRoutes(): Route[] | undefined;
    update(encodedName: string, value: unknown): void;
    getContext(): string;
    updateContext(path?: string | undefined): void;
    trigger(actionName: string, triggerId: string, payload?: Record<string, unknown>): void;
    upload(encodedName: string, files: FileList, progressCallback: (val: number) => void): Promise<string>;
    getPageMetadata(): Record<string, unknown>;
    getWsStatus(): string[];
}
export declare abstract class WsAdapter {
    abstract supportedMessageTypes: string[];
    abstract handleWsMessage(message: WsMessage, app: TaipyApp): boolean;
}
