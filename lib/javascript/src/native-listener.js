
class NativeEvent {
    constructor(name) {
        if(typeof name != "string")
            throw new Error("name is not string");
        this.name = name;
        this.listeners = [];
    }

    addListener(handler, onlyOnce = false) {
        if(typeof handler != "function")
            throw new Error("handler is not function");
        if(typeof onlyOnce != "boolean")
            throw new Error("onlyOnce is not boolean");

        let i = -1;
        for(let index=0; index<this.listeners.length; index++) {
            if(this.listeners[index].handler === handler) {
                i = index;
                break;
            }
        }

        if(i >= 0)
            return this.listeners[i].id;

        const listenerId = Symbol(this.name);
        this.listeners.push({ id: listenerId, handler, onlyOnce });
        return listenerId;
    }

    removeListener(listenerId, useStrict = false) {
        let i = this.listeners.find(listener => listener.id === listenerId);
        if(i >= 0) {

            this.listeners = [
                ...this.listeners.slice(0, i - 1),
                ...this.listeners.slice(i),
            ];

        } else if(useStrict) {
            throw new Error("listener not found");
        }
    }

    isListenerExists(listenerId) {
        if(typeof listenerId != "symbol")
            throw new Error("listenerId is not symbol");

        let i = -1;
        for(let index=0; index<this.listeners.length; index++) {
            if(this.listeners[index].id == listenerId) {
                i = index;
                break;
            }
        }
        return i >= 0;
    }

    emit(data) {
        let applyFilter = false;
        for(let i=0; i<this.listeners.length; i++) {
            this.listeners[i].handler(data);
            if(this.listeners[i].onlyOnce) {
                this.listeners[i] = null;
                applyFilter = true;
            }
        }

        if(applyFilter)
            this.listeners.filter(item => item !== null);
    }
}

const nativeListeners = [];
export const getAllNativeListeners = () => nativeListeners;

export const getNativeListener = (eventName, useStrict = false) => {
    if(typeof eventName != "string")
        throw new Error("eventName is not string");

    let nativeEvent = null;
    for(let i=0; i<nativeListeners.length; i++) {
        if(nativeListeners[i].name == eventName) {
            nativeEvent = nativeListeners[i];
            break;
        }
    }

    if(!nativeEvent && useStrict)
        throw new Error(`native listener '${ eventName }' not found`);
    return nativeEvent;
};

export const addNativeListener = (eventName, handler, opts = {}) => {
    if(typeof eventName != "string")
        throw new Error("eventName is not string");
    if(typeof handler != "function")
        throw new Error("handler is not function");
    if(opts && opts.onlyOnce && typeof opts.onlyOnce != "boolean")
        throw new Error("opts.onlyOnce is not boolean");

    let i = -1;
    for(let index=0; index<nativeListeners.length; index++) {
        if(nativeListeners[index].name == eventName) {
            i = index;
            break;
        }
    }

    if(i < 0) {
        nativeListeners.push( new NativeEvent(eventName) );
        i = nativeListeners.length - 1;
    }

    const onlyOnce = opts?.onlyOnce || false;
    return nativeListeners[i].addListener(handler, onlyOnce);
};

export const removeNativeListener = (eventName, listenerId, useStrict = false) => {
    if(typeof eventName != "string")
        throw new Error("eventName is not string");
    if(typeof listenerId != "symbol")
        throw new Error("listenerId is not symbol");

    let i = -1;
    for(let index=0; index<nativeListeners.length; index++) {
        if(nativeListeners[index].name == eventName) {
            i = index;
            break;
        }
    }
    
    if(i < 0 && !useStrict)
        return;
    if(i < 0)
        throw new Error(`native listener '${ eventName }' not found`);
    nativeListeners[i].removeListener(listenerId, useStrict);
};