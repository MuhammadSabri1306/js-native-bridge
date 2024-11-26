import { getGlobalState } from "./global";
import { NativeChannelMessage } from "./channel";
import { on, once, off } from "./events";
import { getAllNativeListeners } from "./native-listener";

const nativeMessageSender = {
    _nativeListener: null,
    post(message) {
        if(!(message instanceof NativeChannelMessage))
            throw new Error("message is not NativeChannelMessage");

        if(typeof this._nativeListener != "function") {
            const onNativeMessage = getGlobalState("onNativeMessage");
            if(typeof onNativeMessage != "string")
                throw new Error("native listener is not defined yet");

            try {
                
                let handler = null;
                const handlerPaths = onNativeMessage.split(".");
                handlerPaths.forEach((key, index) => {
                    if(index === 0)
                        handler = window[key];
                    else
                        handler = handler[key];
                });

                this._nativeListener = handler;

            } catch(err) {
                console.error(`failed to get native listener '${ onNativeMessage }'`);
                throw err;
            }
        }

        this._nativeListener( message.toJson() );
    }
};

export class NativeService {
    constructor(serviceName, nativeEventName = null) {
        if(typeof serviceName != "string")
            throw new Error("serviceName is not string");
        if(nativeEventName && typeof nativeEventName != "string")
            throw new Error("nativeEventName is not string");

        this.serviceName = serviceName;
        this.nativeEventName = nativeEventName || serviceName;
    }

    call(data = null) {
        const service = this.nativeEventName;
        nativeMessageSender.post(
            new NativeChannelMessage({ service, data })
        );
    }
}

export class NativeGetterService extends NativeService {
    constructor(serviceName, nativeEventName = null) {
        if(typeof serviceName != "string")
            throw new Error("serviceName is not string");
        if(nativeEventName && typeof nativeEventName != "string")
            throw new Error("nativeEventName is not string");
        super(serviceName, nativeEventName);
        this.timeoutMs = getGlobalState("serviceTimeoutMs");
    }

    setTimeoutMs(timeoutMs) {
        if(timeoutMs !== false && typeof timeoutMs != "number")
            throw new Error("timeoutMs is not number or false");
        this.timeoutMs = timeoutMs;
    }

    async get(params = null) {
        const serviceName = this.serviceName;
        const eventName = this.nativeEventName;
        const timeoutMs = this.timeoutMs;

        const data = await new Promise((resolve, reject) => {
            once(eventName, resolve);
            this.call(params);

            if(timeoutMs) {
                setTimeout(() => {
                    reject( new Error(`native service '${ serviceName }' is too long to response`) );
                }, timeoutMs);
            }
        });
        return data;
    }
}

export class NativeSubscriberService extends NativeService {
    onChange(callback, params = {}) {
        if(typeof callback != "function")
            throw new Error("callback is not function");
        const listenerId = on(this.nativeEventName, callback);
        this.call({ ...params, listen: true });
        return listenerId;
    }

    static off(listenerId, params = {}) {
        this.call({ ...params, listen: false });
        off(listenerId);
    }
}