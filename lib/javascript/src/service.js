import { getGlobalState } from "./global";
import { ChannelMessage } from "./channel";
import { on, once, off } from "./events";

const nativeMessageSender = {
    _nativeListener: null,
    post(message) {
        if(!(message instanceof ChannelMessage))
            throw new Error("message is not ChannelMessage");

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
    constructor({
        serviceName,
        nativeEventName,
    }) {
        if(typeof serviceName != "string")
            throw new Error("serviceName is not string");
        if(typeof nativeEventName != "string")
            throw new Error("nativeEventName is not string");

        this.serviceName = serviceName;
        this.nativeEventName = nativeEventName;
    }

    call(data) {
        const eventName = this.nativeEventName;
        nativeMessageSender.post(
            new ChannelMessage({ eventName, data })
        );
    }
}

export class NativeGetterService extends NativeService {
    constructor({
        serviceName,
        nativeEventName,
    }) {
        if(typeof serviceName != "string")
            throw new Error("serviceName is not string");
        if(typeof nativeEventName != "string")
            throw new Error("nativeEventName is not string");
        super({ serviceName, nativeEventName });
    }

    async get() {
        const serviceName = this.serviceName;
        const eventName = this.nativeEventName;
        const timeoutMs = getGlobalState("serviceTimeoutMs");

        const [ data ] = await Promise.all([
            new Promise(resolve => once(eventName, resolve)),
            new Promise((resolve, reject) => {
                setTimeout(
                    () => reject( new Error(`native service '${ serviceName }' is too long to response`) ),
                    timeoutMs
                )
            })
        ]);
        return data;
    }
}

export class NativeSubscriberService extends NativeService {
    constructor({
        serviceName,
        nativeEventName,
    }) {
        if(typeof serviceName != "string")
            throw new Error("serviceName is not string");
        if(typeof nativeEventName != "string")
            throw new Error("nativeEventName is not string");
        super({ serviceName, nativeEventName });
    }

    onChange(callback) {
        if(typeof callback != "function")
            throw new Error("callback is not function");
        return on(this.nativeEventName, callback);
    }

    static off(listenerId) {
        off(listenerId);
    }
}