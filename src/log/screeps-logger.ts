const rawLog = console.log;

let mdc: Record<string, string> = {};

export const log = (message: any): void => {
    rawLog(JSON.stringify({
        mdc,
        tick: Game.time,
        timestamp: new Date().toISOString(),
        message
    }, null, 2));
}

export const setMdcValue = (key: string, value: string): void => {
    mdc[key] = value;
}

export const clearMdcValue = (key: string): void => {
    delete mdc[key];
}

export const clearAllMdc = (): void => {
    mdc = {};
}
