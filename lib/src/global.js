
const globalState = {
    credentialsName: undefined,
    jsChannelName: undefined,
    onNativeMessage: undefined,
    expireDays: undefined,
    serviceTimeoutMs: 1000 * 10,
};

export const setGlobalState = (key, value) => {
    if(!(key in globalState))
        throw new Error(`globalState.${ key } is not initialized`);
    globalState[key] = value;
};

export const getGlobalState = (key) => {
    if(!(key in globalState))
        throw new Error(`globalState.${ key } is not initialized`);
    return globalState[key];
};