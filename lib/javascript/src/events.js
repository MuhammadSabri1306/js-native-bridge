import { getAllNativeListeners, addNativeListener, removeNativeListener } from "./native-listener";

export const on = (eventName, handler) => addNativeListener(eventName, handler);
export const once = (eventName, handler) => addNativeListener(eventName, handler, { onlyOnce: true });
export const off = (listenerId) => {
    const listeners = getAllNativeListeners();
    let eventName = null;

    for(let i=0; i<listeners.length; i++) {
        if(listeners[i].isListenerExists(listenerId)) {
            eventName = listeners[i].name;
            break;
        }
    }

    if(eventName)
        removeNativeListener(eventName, listenerId, true);
};